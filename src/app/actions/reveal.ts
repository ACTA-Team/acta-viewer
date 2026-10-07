"use server";

import { createHash, timingSafeEqual } from "node:crypto";

import { findCredential } from "@/lib/acta/credential";
import { CONCEPT_CONTENT, CONCEPT_SECRET_CODE, type RevealedContent } from "@/lib/concept";
import { isNetworkId } from "@/lib/stellar/networks";

export type RevealState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "revealed"; content: RevealedContent };

/** Compares digests so the check takes the same time whatever the input. */
function codeMatches(input: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(input.trim().toUpperCase()), digest(CONCEPT_SECRET_CODE));
}

export async function revealCredential(
  _previous: RevealState,
  formData: FormData
): Promise<RevealState> {
  const network = String(formData.get("network") ?? "");
  const vault = String(formData.get("vault") ?? "");
  const vcId = String(formData.get("vcId") ?? "");
  const code = String(formData.get("code") ?? "");

  if (!code.trim()) {
    return { status: "error", message: "Enter the access code." };
  }
  if (!isNetworkId(network) || !codeMatches(code)) {
    return { status: "error", message: "This code is not valid for this credential." };
  }

  // The code never unlocks anything on its own: the credential it is presented
  // for must still exist in an ACTA vault at this moment.
  const credential = await findCredential(network, vault, vcId);
  if (!credential) {
    return { status: "error", message: "This code is not valid for this credential." };
  }

  return { status: "revealed", content: CONCEPT_CONTENT };
}
