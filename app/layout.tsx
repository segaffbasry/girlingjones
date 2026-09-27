import type { Metadata, Viewport } from "next";
import { Shell } from "@/components/chrome";
import { posthogSnippet } from "@/lib/posthog";
import "./globals.css";
import "@/styles/ui.css";
import "@/styles/chrome.css";
import "@/styles/home.css";

// Title and description are the live homepage's own (girlingjones.com, Yoast).
export const metadata: Metadata = {
  title: "Construction Recruitment Consultants | Girling Jones",
  description: "Girling Jones recruit technical staff to the construction and property industry in the South West.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#221f20" };

/* `js` (and the preloader's `is-loading`/`is-landing`) is set before first paint (unless reduced motion is requested) so reveal targets can start hidden without a flash.
   Without JavaScript the class is never added and every element renders in place; the <noscript> style also hides the preloader. */
// The site is a single page, so the preloader classes are set here too: nothing (header included) can paint before the ink ground.
const boot = "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js','is-loading','is-landing')";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" data-header="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script dangerouslySetInnerHTML={{ __html: posthogSnippet }} />
        <link rel="preload" href="/fonts/jost-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/media/hero-poster.jpg" as="image" />
        <noscript><style>{".preloader{display:none!important}"}</style></noscript>
      </head>
      <body><Shell>{children}</Shell></body>
    </html>
  );
}
