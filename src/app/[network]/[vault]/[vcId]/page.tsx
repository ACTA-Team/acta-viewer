import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { ActaLoader } from "@/components/ui/acta-loader";
import { CredentialCard } from "@/components/viewer/credential-card";
import { CredentialNotFound } from "@/components/viewer/credential-not-found";
import { findCredential } from "@/lib/acta/credential";
import { isNetworkId } from "@/lib/stellar/networks";

export const metadata: Metadata = {
  title: "Credential",
};

type Params = PageProps<"/[network]/[vault]/[vcId]">["params"];

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Reads the chain at request time on every visit. The verdict is never cached:
 * a credential revoked a minute ago must show as revoked now.
 */
async function CredentialResult({ params }: { params: Params }) {
  await connection();
  const { network, vault, vcId } = await params;
  if (!isNetworkId(network)) return <CredentialNotFound />;

  const credential = await findCredential(network, vault, safeDecode(vcId));
  if (!credential) return <CredentialNotFound />;

  return <CredentialCard credential={credential} />;
}

export default function CredentialPage({ params }: PageProps<"/[network]/[vault]/[vcId]">) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center py-24">
          <ActaLoader size="xl" text="Verifying on Stellar…" />
        </div>
      }
    >
      <CredentialResult params={params} />
    </Suspense>
  );
}
