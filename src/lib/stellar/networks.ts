import { Networks } from "@stellar/stellar-sdk";

export type NetworkId = "testnet" | "mainnet";

export interface NetworkConfig {
  id: NetworkId;
  label: string;
  rpcUrl: string;
  horizonUrl: string;
  passphrase: string;
  /** Deploys every ACTA vault and answers `is_vault` for them. */
  vaultFactory: string;
  /** did:stellar registry. */
  didRegistry: string;
  explorerUrl: string;
}

// Contract ids from ACTA-Team/contracts-acta, docs/deployments/<network>.md.
export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  testnet: {
    id: "testnet",
    label: "Testnet",
    rpcUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
    passphrase: Networks.TESTNET,
    vaultFactory: "CB23E4GXNRJ367BVPDRMGLADKBQLCWMAWP6SZVGFJPMR2D6I3KBA3B4H",
    didRegistry: "CAJQFHGAJR5Q2NMGM7IYGM2KK6FLQXT634XZMGEYKKOYN2E2ONCFRSQK",
    explorerUrl: "https://stellar.expert/explorer/testnet",
  },
  mainnet: {
    id: "mainnet",
    label: "Mainnet",
    rpcUrl: "https://mainnet.sorobanrpc.com",
    horizonUrl: "https://horizon.stellar.org",
    passphrase: Networks.PUBLIC,
    vaultFactory: "CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX",
    didRegistry: "CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ",
    explorerUrl: "https://stellar.expert/explorer/public",
  },
};

export function isNetworkId(value: string): value is NetworkId {
  return value === "testnet" || value === "mainnet";
}

export function explorerContractUrl(network: NetworkId, contractId: string): string {
  return `${NETWORKS[network].explorerUrl}/contract/${contractId}`;
}

export function explorerAccountUrl(network: NetworkId, account: string): string {
  return `${NETWORKS[network].explorerUrl}/account/${account}`;
}

export function explorerLedgerUrl(network: NetworkId, ledger: number): string {
  return `${NETWORKS[network].explorerUrl}/ledger/${ledger}`;
}
