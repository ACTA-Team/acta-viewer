"use server";

import { findCredential } from "@/lib/acta/credential";
import { checkAccessCode } from "@/lib/access-codes";
import { CONCEPT_CONTENT, type RevealedContent } from "@/lib/concept";
import { isNetworkId } from "@/lib/stellar/networks";

export type RevealState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "revealed"; content: RevealedContent };

const MAX_CODE_LENGTH = 128;
const INVALID = "This password is not valid for this credential.";

export async function revealCredential(
  _previous: RevealState,
  formData: FormData
): Promise<RevealState> {
  const network = String(formData.get("network") ?? "");
  const vault = String(formData.get("vault") ?? "");
  const vcId = String(formData.get("vcId") ?? "");
  const code = String(formData.get("code") ?? "").trim();

  if (!code) {
    return { status: "error", message: "Enter the password." };
  }
  if (!isNetworkId(network) || code.length > MAX_CODE_LENGTH) {
    return { status: "error", message: INVALID };
  }

  const check = await checkAccessCode(network, vcId, code);
  if (check === "unavailable") {
    return {
      status: "error",
      message: "The password could not be checked right now. Try again in a moment.",
    };
  }
  if (check === "invalid") {
    return { status: "error", message: INVALID };
  }

  // The password never unlocks anything on its own: the credential it is
  // presented for must still exist in an official ACTA vault at this moment.
  const credential = await findCredential(network, vault, vcId);
  if (!credential) {
    return { status: "error", message: INVALID };
  }

  return { status: "revealed", content: CONCEPT_CONTENT };
}
