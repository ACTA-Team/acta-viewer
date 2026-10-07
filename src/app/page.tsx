import { Blocks, LockKeyhole, ShieldCheck } from "lucide-react";

import { ActaMark } from "@/components/ui/acta-mark";
import { SearchForm } from "@/components/viewer/search-form";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Verified on-chain",
    text: "Status, issuer and vault are checked on Stellar on every visit, without going through ACTA.",
  },
  {
    icon: LockKeyhole,
    title: "Protected content",
    text: "Credential data is encrypted. It is only shown with the holder's access code.",
  },
  {
    icon: Blocks,
    title: "No accounts",
    text: "No wallet or sign-up needed. Paste the vault and the ID you were given.",
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col stage">
      <div className="pointer-events-none absolute inset-0 stage-grid" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-5xl flex-1 items-center gap-10 px-5 py-12 lg:grid-cols-[1fr_440px] lg:py-20">
        <div className="space-y-6">
          <ActaMark size={44} />
          <div className="space-y-3">
            <p className="section-label">Verifiable credentials</p>
            <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
              Verify an ACTA credential
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Check that a credential is authentic, who issued it and whether it is still valid,
              directly on the Stellar network.
            </p>
          </div>

          <ul className="space-y-4 pt-2">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface shadow-card">
                  <Icon className="size-4 text-brand" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <SearchForm />
      </div>
    </div>
  );
}
