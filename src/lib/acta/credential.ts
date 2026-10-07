import "server-only";

import { Address, StrKey, nativeToScVal, xdr } from "@stellar/stellar-sdk";

import type { NetworkId } from "@/lib/stellar/networks";
import { NETWORKS } from "@/lib/stellar/networks";
import { getEntryLedger, getLedgerCloseTime, readContract } from "@/lib/stellar/soroban";

import { resolveDid, type DidResolution } from "./did";

const MAX_VC_ID_LENGTH = 64;

export type CredentialStatus =
  { state: "valid" } | { state: "revoked"; since: string } | { state: "invalid" };

export interface OnChainCredential {
  network: NetworkId;
  vault: string;
  vcId: string;
  owner: string;
  vaultDid: string;
  vaultVersion: string;
  issuer: DidResolution;
  status: CredentialStatus;
  /** Ledger the credential was written in, and when that ledger closed. */
  anchoredLedger: number | null;
  anchoredAt: string | null;
  /** The payload on chain is ciphertext; this says whose key sealed it. */
  sealedBy: "acta" | "holder";
}

interface StoredCredential {
  id: string;
  data: string;
  issuance_contract: string;
  issuer_did: string;
}

/** `VCStatus` decodes to `["Valid"]`, `["Invalid"]` or `["Revoked", "<date>"]`. */
function toStatus(raw: unknown): CredentialStatus {
  const [tag, since] = Array.isArray(raw) ? raw : [raw];
  if (tag === "Valid") return { state: "valid" };
  if (tag === "Revoked") return { state: "revoked", since: String(since ?? "") };
  return { state: "invalid" };
}

function credentialKey(vault: string, vcId: string): xdr.LedgerKey {
  return xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: new Address(vault).toScAddress(),
      key: xdr.ScVal.scvVec([xdr.ScVal.scvSymbol("VaultVC"), xdr.ScVal.scvString(vcId)]),
      durability: xdr.ContractDataDurability.persistent,
    })
  );
}

export function isValidLookup(vault: string, vcId: string): boolean {
  return StrKey.isValidContract(vault) && vcId.length > 0 && vcId.length <= MAX_VC_ID_LENGTH;
}

/**
 * Looks up a credential by (vault, id) directly on Stellar.
 *
 * Returns null unless all of it holds: the vault was deployed by ACTA's
 * factory, and that vault holds a credential with this id. A
 * contract that merely mimics the vault interface is rejected by the first
 * check, which is what stops a forged vault from rendering as genuine.
 */
export async function findCredential(
  network: NetworkId,
  vault: string,
  vcId: string
): Promise<OnChainCredential | null> {
  if (!isValidLookup(vault, vcId)) return null;

  const isOfficialVault = await readContract<boolean>(
    network,
    NETWORKS[network].vaultFactory,
    "is_vault",
    [new Address(vault).toScVal()]
  ).catch(() => false);
  if (!isOfficialVault) return null;

  const idArg = nativeToScVal(vcId, { type: "string" });
  const stored = await readContract<StoredCredential | null>(network, vault, "get_vc", [
    idArg,
  ]).catch(() => null);
  if (!stored) return null;

  const [status, owner, vaultDid, vaultVersion, anchoredLedger, issuer] = await Promise.all([
    readContract<unknown>(network, vault, "verify_vc", [idArg]).then(toStatus),
    readContract<string>(network, vault, "vault_owner"),
    readContract<string>(network, vault, "vault_did"),
    readContract<string>(network, vault, "version"),
    getEntryLedger(network, credentialKey(vault, vcId)).catch(() => null),
    resolveDid(network, stored.issuer_did),
  ]);

  const anchoredAt = anchoredLedger ? await getLedgerCloseTime(network, anchoredLedger) : null;

  return {
    network,
    vault,
    vcId,
    owner,
    vaultDid,
    vaultVersion,
    issuer,
    status,
    anchoredLedger,
    anchoredAt,
    sealedBy: stored.data.startsWith("acv2:") ? "acta" : "holder",
  };
}
