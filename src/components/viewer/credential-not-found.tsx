import { SearchX } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

/**
 * One message for every miss: unknown vault, a contract ACTA did not deploy,
 * or an id the vault does not hold. Telling them apart would let anyone probe
 * which vaults and ids exist.
 */
export function CredentialNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <span className="flex size-12 items-center justify-center rounded-md border border-border bg-muted">
        <SearchX className="size-5 text-muted-foreground" />
      </span>
      <h1 className="mt-5 text-2xl">Credential not found</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        The vault and ID do not match any credential issued by ACTA on this network. Check that you
        copied both in full and picked the right network.
      </p>
      <Link href="/" className={buttonVariants({ variant: "outline", className: "mt-6" })}>
        Look up another credential
      </Link>
    </div>
  );
}
