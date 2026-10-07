"use client";

import { KeyRound, LockKeyhole, LockOpen } from "lucide-react";
import { useActionState } from "react";

import { revealCredential, type RevealState } from "@/app/actions/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NetworkId } from "@/lib/stellar/networks";

const INITIAL: RevealState = { status: "idle" };

export function RevealPanel({
  network,
  vault,
  vcId,
}: {
  network: NetworkId;
  vault: string;
  vcId: string;
}) {
  const [state, action, pending] = useActionState(revealCredential, INITIAL);

  if (state.status === "revealed") {
    const { content } = state;
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-success">
            <LockOpen className="size-4" />
            Content unlocked
          </div>
          {content.isSample && (
            <span className="rounded-sm border border-warning/40 bg-warning-subtle px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-warning uppercase">
              Sample data · concept
            </span>
          )}
        </div>
        <h3 className="text-lg">{content.title}</h3>
        <dl className="space-y-3">
          {content.fields.map((field) => (
            <div
              key={field.label}
              className="flex items-baseline justify-between gap-6 border-b border-dashed border-border pb-3 last:border-0"
            >
              <dt className="shrink-0 text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
                {field.label}
              </dt>
              <dd className="text-right text-sm text-foreground">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="network" value={network} />
      <input type="hidden" name="vault" value={vault} />
      <input type="hidden" name="vcId" value={vcId} />

      <div className="flex gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
          <LockKeyhole className="size-4 text-muted-foreground" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">The content is encrypted</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Only ciphertext is stored on-chain. Enter the access code the holder shared with you to
            see the credential data.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <KeyRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="code"
            placeholder="ACTA-XXXX-XXXX"
            autoComplete="off"
            spellCheck={false}
            className="mono pl-9 uppercase"
            aria-label="Access code"
            aria-invalid={state.status === "error" || undefined}
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Checking…" : "Unlock"}
        </Button>
      </div>

      {state.status === "error" && (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
