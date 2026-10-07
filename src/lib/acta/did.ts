import "server-only";

import { xdr } from "@stellar/stellar-sdk";

import type { NetworkId } from "@/lib/stellar/networks";
import { NETWORKS } from "@/lib/stellar/networks";
import { readContract } from "@/lib/stellar/soroban";

const DID_PATTERN = /^did:stellar:(mainnet|testnet):([a-z2-7]{26})$/;
const BASE32_ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";

export interface DidResolution {
  did: string;
  /** The DID names the same network the credential lives on. */
  networkMatches: boolean;
  registered: boolean;
  deactivated: boolean;
  /** Stellar account that controls the DID. */
  controller: string | null;
  createdLedger: number | null;
}

interface DidRecord {
  controller: string;
  deactivated: boolean;
  created_ledger: number;
}

/** RFC 4648 base32, lowercase, unpadded: the 26-char id is exactly 16 bytes. */
function decodeDidId(id: string): Buffer {
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of id) {
    value = (value << 5) | BASE32_ALPHABET.indexOf(char);
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

/** Resolves a did:stellar against the on-chain registry of `network`. */
export async function resolveDid(network: NetworkId, did: string): Promise<DidResolution> {
  const match = DID_PATTERN.exec(did);
  const unresolved: DidResolution = {
    did,
    networkMatches: match?.[1] === network,
    registered: false,
    deactivated: false,
    controller: null,
    createdLedger: null,
  };
  if (!match || match[1] !== network) return unresolved;

  try {
    const record = await readContract<DidRecord | null>(
      network,
      NETWORKS[network].didRegistry,
      "get",
      [xdr.ScVal.scvBytes(decodeDidId(match[2]))]
    );
    if (!record) return unresolved;
    return {
      ...unresolved,
      registered: true,
      deactivated: record.deactivated,
      controller: record.controller,
      createdLedger: Number(record.created_ledger),
    };
  } catch {
    return unresolved;
  }
}
