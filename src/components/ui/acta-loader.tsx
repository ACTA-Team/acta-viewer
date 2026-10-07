"use client";

import { cn } from "@/lib/utils";

/**
 * Loading indicators.
 *
 * This used to crossfade three PNG pieces of the ACTA mark. Those assets are a
 * white logo on transparency, drawn for the old dark canvas, so on the light
 * one they read as a pale smudge or vanish entirely.
 *
 * Replacing them with a plain spinner is also the better answer on its own
 * terms: an animated brand mark is a splash screen, and this is a control that
 * appears while someone waits for a contract call. Enterprise software says
 * "working" quietly and gets out of the way.
 *
 * The exported API is unchanged so every call site keeps working.
 */

const SIZE = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
} as const;

const TEXT = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
  xl: "text-base",
} as const;

type Size = keyof typeof SIZE;

/**
 * The spinner itself: a ring plus a rotating arc.
 *
 * Drawn as an SVG in `currentColor` rather than a bordered box, so it inherits
 * the colour of wherever it is placed and stays crisp on a navy button and on
 * a white panel alike.
 */
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
      <path
        d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface ActaLoaderProps {
  size?: Size;
  className?: string;
  text?: string;
  subtext?: string;
}

export function ActaLoader({ size = "md", className, text, subtext }: ActaLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <Spinner className={cn(SIZE[size], "text-muted-foreground")} />
      {text && <p className={cn("text-center font-medium text-foreground", TEXT[size])}>{text}</p>}
      {subtext && (
        <p className="max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
          {subtext}
        </p>
      )}
    </div>
  );
}

/** Inline variant for buttons. Inherits the button's text colour. */
export function ActaLoaderInline({ className }: { className?: string }) {
  return <Spinner className={cn("h-4 w-4", className)} />;
}

/**
 * Blocking overlay, used while a transaction is being signed and submitted.
 *
 * A panel on a dimmed backdrop rather than a bare spinner on blur: when the
 * app is asking someone to wait on a ledger write, the reason belongs on
 * screen in a readable container.
 */
export function ActaLoaderOverlay({
  open,
  text,
  subtext,
}: {
  open: boolean;
  text?: string;
  subtext?: string;
}) {
  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-busy="true"
      aria-label={text}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6"
    >
      <div className="w-full max-w-xs rounded-md border border-border bg-surface px-6 py-7 shadow-overlay">
        <ActaLoader size="lg" text={text} subtext={subtext} />
      </div>
    </div>
  );
}
