import "server-only";

import type { NetworkId } from "@/lib/stellar/networks";

/**
 * Checks a viewer password against the one the issuer set for this credential
 * in the ACTA back office.
 *
 * The back office keeps only a hash and answers `{ valid }`; this app never
 * holds database credentials, only the shared secret for that one endpoint.
 */

export type AccessCodeCheck = "valid" | "invalid" | "unavailable";

const TIMEOUT_MS = 8000;

function config() {
  const baseUrl = process.env.BACKOFFICE_URL?.replace(/\/$/, "");
  const secret = process.env.VIEWER_ACCESS_CODE_SECRET;
  return baseUrl && secret ? { baseUrl, secret } : null;
}

export async function checkAccessCode(
  network: NetworkId,
  vcId: string,
  code: string
): Promise<AccessCodeCheck> {
  const cfg = config();
  if (!cfg) {
    console.error("BACKOFFICE_URL and VIEWER_ACCESS_CODE_SECRET must both be set.");
    return "unavailable";
  }

  try {
    const resp = await fetch(`${cfg.baseUrl}/api/viewer/access-codes/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.secret}`,
      },
      body: JSON.stringify({ network, vc_id: vcId, code }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!resp.ok) {
      console.error(`Access code check failed with HTTP ${resp.status}.`);
      return "unavailable";
    }
    const body = (await resp.json().catch(() => null)) as { valid?: unknown } | null;
    return body?.valid === true ? "valid" : "invalid";
  } catch (error) {
    console.error("Access code check failed:", error);
    return "unavailable";
  }
}
