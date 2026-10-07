"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { credentialPath, EXAMPLE_CREDENTIAL } from "@/lib/acta/examples";
import type { NetworkId } from "@/lib/stellar/networks";
import { cn } from "@/lib/utils";

const CONTRACT_ID = /^C[A-Z2-7]{55}$/;
const NETWORK_OPTIONS: { id: NetworkId; label: string }[] = [
  { id: "mainnet", label: "Mainnet" },
  { id: "testnet", label: "Testnet" },
];

export function SearchForm() {
  const router = useRouter();
  const [network, setNetwork] = useState<NetworkId>("mainnet");
  const [vault, setVault] = useState("");
  const [vcId, setVcId] = useState("");
  const [error, setError] = useState<{ field: "vault" | "vcId"; message: string } | null>(null);
  const [pending, setPending] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleanVault = vault.trim();
    const cleanId = vcId.trim();

    if (!CONTRACT_ID.test(cleanVault)) {
      setError({
        field: "vault",
        message: "The vault must be a Stellar contract address (starts with C, 56 characters).",
      });
      return;
    }
    if (!cleanId || cleanId.length > 64) {
      setError({ field: "vcId", message: "Enter the credential ID (64 characters max)." });
      return;
    }

    setError(null);
    setPending(true);
    router.push(credentialPath(network, cleanVault, cleanId));
  };

  const useExample = () => {
    setNetwork(EXAMPLE_CREDENTIAL.network);
    setVault(EXAMPLE_CREDENTIAL.vault);
    setVcId(EXAMPLE_CREDENTIAL.vcId);
    setError(null);
  };

  return (
    <form onSubmit={submit} className="space-y-5 panel p-5 shadow-raised sm:p-6" noValidate>
      <div className="space-y-2">
        <span className="section-label">Network</span>
        <div
          className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1"
          role="radiogroup"
          aria-label="Network"
        >
          {NETWORK_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={network === option.id}
              onClick={() => setNetwork(option.id)}
              className={cn(
                "h-8 rounded-sm text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:outline-none",
                network === option.id
                  ? "bg-surface text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vault">Holder vault</Label>
        <Input
          id="vault"
          value={vault}
          onChange={(e) => setVault(e.target.value)}
          placeholder="CABC…"
          spellCheck={false}
          autoComplete="off"
          className="mono"
          aria-invalid={error?.field === "vault" || undefined}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vcId">Credential ID</Label>
        <Input
          id="vcId"
          value={vcId}
          onChange={(e) => setVcId(e.target.value)}
          placeholder="vc-3f9a1c2e-7b4d-4e8a-…"
          spellCheck={false}
          autoComplete="off"
          className="mono"
          aria-invalid={error?.field === "vcId" || undefined}
        />
      </div>

      {error && (
        <p
          className="rounded-md border border-destructive/30 bg-destructive-subtle px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error.message}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" size="sm" onClick={useExample}>
          <Sparkles />
          Try a real example
        </Button>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Looking up…" : "Verify credential"}
          <ArrowRight />
        </Button>
      </div>
    </form>
  );
}
