import type { ReactNode } from "react";
import { brandIcons, type BrandIcon } from "@/lib/brand-icons";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

// jdavisgc.com's button arrow: 15×15 path, drawn at 12px.
export function Arrow({ className = "arrow" }: { className?: string }) {
  return <svg className={className} width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" focusable="false">
    <path d="M0 8.25H12.127L6.43075 13.9463L7.5 15L15 7.5L7.5 0L6.43075 1.05375L12.127 6.75H0V8.25Z" fill="currentColor" />
  </svg>;
}

/* The copied interaction (README "Copied interaction"): jdavisgc.com's `.the-button` pill.
   Rest → hover swaps background and text colour over 0.3s cubic-bezier(.4,0,.2,1) (--ease-hover) while the arrow
   slides 5px right over 0.5s on the same curve. Structure is the reference's: <a> › <span> label + <svg> arrow.
   Tones re-map the reference's white/red pair onto the palette:
     light – white → lime (on dark photography)      lime – lime → ink (primary on light ground)
     ink   – ink → lime (on light ground)            line – transparent with a rule → ink fill */
export function Pill({ href, children, tone = "lime", size, className = "", external, onClick, reveal = true }: {
  href: string; children: ReactNode; tone?: "light" | "lime" | "ink" | "line"; size?: "sm"; className?: string;
  external?: boolean; onClick?: () => void; reveal?: boolean;
}) {
  const ext = external ?? isExternal(href);
  return <a href={href} className={`pill pill-${tone}${size ? ` pill-${size}` : ""} ${className}`} onClick={onClick}
    target={ext && href.startsWith("http") ? "_blank" : undefined} rel={ext ? "noreferrer" : undefined}
    data-reveal={reveal ? "label" : undefined}>
    <span>{children}</span><Arrow />
  </a>;
}

/* jdavisgc.com's `.red-swipe`: a solid block grows behind a word from left to right (width 0 → 100% + 4px,
   0.5s cubic-bezier(.16,.01,.77,1)). motion.tsx sets [data-swiped] when the phrase scrolls in; without JS or with
   reduced motion the block is simply drawn. Here the block is lime and the text over it is always ink (10:1). */
export function Swipe({ children }: { children: ReactNode }) {
  return <span className="swipe" data-swipe>{children}</span>;
}

export function SocialIcon({ icon }: { icon: BrandIcon }) {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d={brandIcons[icon]} fill="currentColor" /></svg>;
}

// Eyebrow label as jdavisgc uses it above every section heading: a short rule and small caps.
export function Eyebrow({ children, id }: { children: ReactNode; id?: string }) {
  return <p className="eyebrow" id={id} data-reveal="label"><span aria-hidden="true" />{children}</p>;
}
