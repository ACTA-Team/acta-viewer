import type { Metadata } from "next";
import { Anonymous_Pro, Sora } from "next/font/google";

import { SiteFooter, SiteHeader } from "@/components/viewer/site-header";

import "./globals.css";

// Brandbook typography: Sora for text, Anonymous Pro for addresses, IDs and hashes.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["100", "300", "400", "600"],
});

const anonymousPro = Anonymous_Pro({
  variable: "--font-anonymous-pro",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ACTA Viewer",
    template: "%s · ACTA Viewer",
  },
  description: "Verify ACTA credentials directly on the Stellar network.",
};

// Restores the chosen theme before the first paint, as the dApp does; light is the default.
const themeScript = `(()=>{try{if(localStorage.getItem("theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${anonymousPro.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
