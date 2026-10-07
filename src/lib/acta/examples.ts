import type { NetworkId } from "@/lib/stellar/networks";

/** A real credential on mainnet, for trying the viewer without one of your own. */
export const EXAMPLE_CREDENTIAL: { network: NetworkId; vault: string; vcId: string } = {
  network: "mainnet",
  vault: "CCJGGUN6C26TW6J4BRD66JK6BF6T2BFT6JQXFM7Y2UFH7XIUJ3M4X3E5",
  vcId: "vc-ce0182b4-0ba7-498f-8d60-4aae9e896ff9",
};

export function credentialPath(network: NetworkId, vault: string, vcId: string): string {
  return `/${network}/${vault}/${encodeURIComponent(vcId)}`;
}
