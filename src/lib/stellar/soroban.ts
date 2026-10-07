import "server-only";

import {
  Account,
  Contract,
  TransactionBuilder,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";

import { NETWORKS, type NetworkId } from "./networks";

/**
 * Read-only contract calls.
 *
 * A view function is evaluated by simulating a transaction: nothing is signed,
 * nothing is submitted, and the source account does not have to exist, so a
 * fixed placeholder (the all-zero key) stands in for it. Every read goes straight to the network's public RPC, so the
 * answer never passes through an ACTA server.
 */
const SIMULATION_SOURCE = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";

function server(network: NetworkId): rpc.Server {
  return new rpc.Server(NETWORKS[network].rpcUrl);
}

export async function readContract<T>(
  network: NetworkId,
  contractId: string,
  method: string,
  args: xdr.ScVal[] = []
): Promise<T> {
  const { passphrase } = NETWORKS[network];
  const source = new Account(SIMULATION_SOURCE, "0");
  const tx = new TransactionBuilder(source, { fee: "100", networkPassphrase: passphrase })
    .addOperation(new Contract(contractId).call(method, ...args))
    .setTimeout(30)
    .build();

  const result = await server(network).simulateTransaction(tx);
  if (rpc.Api.isSimulationError(result)) {
    throw new Error(`${method} failed: ${result.error.split("\n")[0]}`);
  }
  if (!result.result) {
    throw new Error(`${method} returned no value`);
  }
  return scValToNative(result.result.retval) as T;
}

/** The ledger a persistent contract-data entry was last written in, or null if absent. */
export async function getEntryLedger(
  network: NetworkId,
  key: xdr.LedgerKey
): Promise<number | null> {
  const { entries } = await server(network).getLedgerEntries(key);
  return entries[0]?.lastModifiedLedgerSeq ?? null;
}

/** Close time of a ledger, from Horizon. Null when Horizon no longer has it. */
export async function getLedgerCloseTime(
  network: NetworkId,
  ledger: number
): Promise<string | null> {
  try {
    const res = await fetch(`${NETWORKS[network].horizonUrl}/ledgers/${ledger}`);
    if (!res.ok) return null;
    const body = (await res.json()) as { closed_at?: string };
    return body.closed_at ?? null;
  } catch {
    return null;
  }
}
