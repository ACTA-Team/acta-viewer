import {
  CircleCheck,
  CircleX,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import { ActaMark } from "@/components/ui/acta-mark";
import type { OnChainCredential } from "@/lib/acta/credential";
import {
  explorerAccountUrl,
  explorerContractUrl,
  explorerLedgerUrl,
  NETWORKS,
} from "@/lib/stellar/networks";
import { cn, truncateMiddle } from "@/lib/utils";

import { CopyButton } from "./copy-button";
import { RevealPanel } from "./reveal-panel";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short" });

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormat.format(date);
}

const STATUS_VIEW = {
  valid: {
    label: "Verified",
    pill: "border-success/30 bg-success-subtle text-success",
    dot: "bg-success",
    icon: ShieldCheck,
    iconClass: "text-success",
  },
  revoked: {
    label: "Revoked",
    pill: "border-destructive/30 bg-destructive-subtle text-destructive",
    dot: "bg-destructive",
    icon: ShieldAlert,
    iconClass: "text-destructive",
  },
  invalid: {
    label: "Invalid",
    pill: "border-destructive/30 bg-destructive-subtle text-destructive",
    dot: "bg-destructive",
    icon: ShieldX,
    iconClass: "text-destructive",
  },
} as const;

function Check({ ok, title, detail }: { ok: boolean; title: string; detail: React.ReactNode }) {
  const Icon = ok ? CircleCheck : CircleX;
  return (
    <li className="flex gap-3 py-3">
      <Icon className={cn("mt-0.5 size-4 shrink-0", ok ? "text-success" : "text-destructive")} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm break-words text-muted-foreground">{detail}</p>
      </div>
    </li>
  );
}

function Row({
  label,
  value,
  href,
  mono = true,
}: {
  label: string;
  value: string;
  href?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-dashed border-border pb-3 last:border-0">
      <dt className="shrink-0 text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="flex min-w-0 items-center gap-1 text-right">
        <span className={cn("text-sm text-foreground", mono && "mono text-xs")} title={value}>
          {mono && value.length > 48 ? truncateMiddle(value, 10, 8) : value}
        </span>
        {mono && <CopyButton value={value} label={`Copy ${label.toLowerCase()}`} />}
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${label.toLowerCase()} on Stellar Expert`}
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
          </a>
        )}
      </dd>
    </div>
  );
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        {children}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function CredentialCard({ credential }: { credential: OnChainCredential }) {
  const { network, vault, vcId, issuer, status } = credential;
  const view = STATUS_VIEW[status.state];
  const StatusIcon = view.icon;
  const issuerOk = issuer.registered && !issuer.deactivated && issuer.networkMatches;
  const anchoredAt = formatDate(credential.anchoredAt);

  const statusDetail =
    status.state === "valid"
      ? "The contract reports this credential as valid."
      : status.state === "revoked"
        ? `Revoked on ${formatDate(status.since) ?? status.since}.`
        : "The contract does not recognise this credential as valid.";

  const issuerDetail = !issuer.networkMatches
    ? `${issuer.did} does not belong to ${NETWORKS[network].label}.`
    : !issuer.registered
      ? `${issuer.did} is not registered in the did:stellar registry.`
      : issuer.deactivated
        ? `${issuer.did} was deactivated by its controller.`
        : `${issuer.did} is registered and active.`;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 lg:py-14">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-overlay">
        <div className="absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute -top-32 -right-32 size-64 rounded-full bg-primary-subtle blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-64 rounded-full bg-success-subtle blur-3xl" />

        <div className="relative px-5 py-8 sm:px-12 sm:py-12">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ActaMark size={26} alt="ACTA" />
              <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                ACTA
              </span>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase",
                view.pill
              )}
            >
              <span className={cn("size-1.5 rounded-full", view.dot)} />
              {view.label}
            </span>
          </div>

          <div className="text-center">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              Verifiable credential
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {status.state === "valid" ? "Authentic credential" : "Credential not valid"}
            </h1>
            <p className="mono mt-3 text-xs break-all text-muted-foreground">{vcId}</p>
            <div className="mt-6 flex justify-center">
              <div className="flex size-14 items-center justify-center rounded-md border border-border bg-muted">
                <StatusIcon className={cn("size-6", view.iconClass)} />
              </div>
            </div>
          </div>

          <Divider>Verified on Stellar</Divider>

          <ul className="divide-y divide-dashed divide-border">
            <Check
              ok
              title="Official ACTA vault"
              detail="The contract was deployed by the ACTA vault factory."
            />
            <Check
              ok
              title="Credential exists in the vault"
              detail="The ID matches a credential stored in this contract."
            />
            <Check ok={status.state === "valid"} title="Status" detail={statusDetail} />
            <Check ok={issuerOk} title="Issuer has an on-chain identity" detail={issuerDetail} />
            {credential.anchoredLedger && (
              <Check
                ok
                title="Anchored on-chain"
                detail={
                  <>
                    Ledger{" "}
                    <a
                      href={explorerLedgerUrl(network, credential.anchoredLedger)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand hover:text-brand-hover"
                    >
                      #{credential.anchoredLedger.toLocaleString("en-US")}
                    </a>
                    {anchoredAt && ` · ${anchoredAt}`}
                  </>
                }
              />
            )}
          </ul>

          <Divider>Content</Divider>

          <RevealPanel network={network} vault={vault} vcId={vcId} />

          <Divider>Details</Divider>

          <dl className="space-y-3">
            <Row label="Issuer" value={issuer.did} />
            {issuer.controller && (
              <Row
                label="Issuer wallet"
                value={issuer.controller}
                href={explorerAccountUrl(network, issuer.controller)}
              />
            )}
            <Row
              label="Holder"
              value={credential.owner}
              href={explorerAccountUrl(network, credential.owner)}
            />
            <Row label="Vault" value={vault} href={explorerContractUrl(network, vault)} />
            <Row label="Network" value={NETWORKS[network].label} mono={false} />
            <Row label="Contract" value={`vc-vault v${credential.vaultVersion}`} mono={false} />
            <Row
              label="Encryption"
              value={
                credential.sealedBy === "acta" ? "AES-256-GCM (ACTA)" : "Encrypted by the holder"
              }
              mono={false}
            />
          </dl>
        </div>
      </div>

      {status.state === "revoked" && (
        <div className="mt-5 flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive-subtle px-5 py-3.5">
          <ShieldAlert className="size-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{statusDetail}</p>
        </div>
      )}
    </div>
  );
}
