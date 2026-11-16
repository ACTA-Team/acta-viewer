import Link from "next/link";

import { ActaMark } from "@/components/ui/acta-mark";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5 rounded-md focus-ring">
          <ActaMark size={24} alt="ACTA" priority />
          <span className="text-sm font-semibold tracking-tight text-foreground">ACTA</span>
          <span className="relative rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
            Viewer
            {/* The brandbook's seal dot. */}
            <span
              className="absolute -top-1 -right-1 size-1.5 rounded-full bg-seal"
              aria-hidden="true"
            />
          </span>
        </Link>
        {/*
          Uncontrolled, as in the dApp: the toggler owns the `theme` key in
          localStorage that the pre-paint script in the root layout reads back.
        */}
        <AnimatedThemeToggler
          aria-label="Theme"
          title="Theme"
          className="inline-flex size-8 items-center justify-center rounded-md border border-border-strong bg-surface text-muted-foreground focus-ring transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-4"
        />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Verified directly against the Stellar network. No accounts, no wallets.</p>
        <a href="https://acta.build" className="text-brand hover:text-brand-hover">
          acta.build
        </a>
      </div>
    </footer>
  );
}
