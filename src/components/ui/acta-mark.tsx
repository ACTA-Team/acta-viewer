import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The ACTA mark in whichever ink the theme can show.
 *
 * `black.png` is a black mark and `logo.png` a white one; both render and CSS
 * picks, so the right one is there on the first paint in either theme.
 */
export function ActaMark({
  size = 26,
  alt = "",
  priority = false,
  className,
}: {
  size?: number;
  /** Leave empty where a nearby label already names the product. */
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  const shared = "h-full w-full object-contain";

  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/black.png"
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className={cn(shared, "dark:hidden")}
      />
      <Image
        src="/logo.png"
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        className={cn(shared, "hidden dark:block")}
      />
    </span>
  );
}
