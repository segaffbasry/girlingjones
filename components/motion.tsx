"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { reducedMotion } from "@/components/ui";
import { EASE, timing } from "@/lib/ease";
import { getLenis, setLenis } from "@/lib/scroll";
import { splitWords } from "@/lib/split";

// Registered at module load so child components (menu, preloader) can build timelines on "gj" in their own effects,
// which run before this hook's effect.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("gj", EASE);
}

/* One small, fixed set of reveal moves, applied the same way everywhere (table in README):
   label   – eyebrows and buttons: 12px rise and fade
   heading – the whole phrase fades and rises 40px (jdavisgc.com ".fade-in-up": translateY(40px), ease-out)
   text    – paragraphs: each word slides up out of its own mask
   card    – cards, rows and pills: batched 24px rise and fade with a short stagger
   image   – photography clips open from the bottom edge; [data-parallax] adds ~10% scroll drift
   swipe   – [data-swipe] phrases get their lime block once the heading around them has landed
   All play once, all use the one ease-out curve, and inside [data-late] sections they run at 75% of the duration. */
export function usePageMotion() {
  /* Lenis lives for the whole visit, driven by the GSAP ticker so ScrollTrigger reads the same frame. */
  useEffect(() => {
    if (reducedMotion()) return;
    // jdavisgc.com scrolls natively, so there is no value to copy; a lerp of .1 keeps wheel input close to native with a light glide.
    const lenis = new Lenis({ lerp: .1, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (document.documentElement.classList.contains("is-loading")) lenis.stop();
    const start = () => lenis.start();
    document.addEventListener("intro:done", start);

    // In-page anchors go through Lenis.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
      if (!link || event.defaultPrevented) return;
      const hash = link.getAttribute("href")!;
      const target = hash === "#top" ? null : document.querySelector<HTMLElement>(hash);
      if (hash !== "#top" && !target) return;
      event.preventDefault();
      lenis.start();
      lenis.scrollTo(target ?? 0, { offset: 0, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
      target?.focus({ preventScroll: true });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("intro:done", start);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy(); setLenis(null);
    };
  }, []);

  /* Reveals. */
  useEffect(() => {
    const reduced = reducedMotion();
    const splits: { revert: () => void }[] = [];
    const scale = (el: Element) => (el.closest("[data-late]") ? timing.late : 1);
    const mark = () => document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-shown", ""));
    const ctx = gsap.context(() => {
      const all = (kind: string) => gsap.utils.toArray<HTMLElement>(`[data-reveal="${kind}"]:not([data-hero] [data-reveal])`);
      if (reduced) {
        mark();
        document.querySelectorAll("[data-swipe]").forEach((el) => el.setAttribute("data-swiped", ""));
        return;
      }

      all("label").forEach((el) => {
        gsap.set(el, { opacity: 0, y: 12 });
        ScrollTrigger.create({ trigger: el, start: "top 94%", once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: timing.label * scale(el), ease: "gj", clearProps: "transform" }) });
      });

      all("heading").forEach((el) => {
        gsap.set(el, { opacity: 0, y: 40 });
        ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: timing.heading * scale(el), ease: "gj", clearProps: "transform" }) });
      });

      all("text").forEach((el) => {
        const split = splitWords(el);
        splits.push(split);
        gsap.set(split.inner, { yPercent: 105 });
        ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => gsap.to(split.inner, { yPercent: 0, duration: timing.text * scale(el), ease: "gj", delay: .06, stagger: Math.min(.012, .45 / split.inner.length) }) });
      });

      const cards = all("card");
      gsap.set(cards, { opacity: 0, y: 24 });
      ScrollTrigger.batch(cards, { start: "top 94%", once: true, onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: timing.card * scale(batch[0]), ease: "gj", stagger: .08, clearProps: "transform" }) });

      all("image").forEach((el) => {
        gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
        ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: timing.image * scale(el), ease: "gj", clearProps: "clipPath" }) });
      });

      // The swipe waits for the heading's rise to be mostly done, as on jdavisgc.com where the block follows the fade-in-up.
      gsap.utils.toArray<HTMLElement>("[data-swipe]:not([data-hero] [data-swipe])").forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => gsap.delayedCall(.35 * scale(el), () => el.setAttribute("data-swiped", "")) });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const media = el.querySelector("img, video"); if (!media) return;
        gsap.fromTo(media, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: el, scrub: true, start: "top bottom", end: "bottom top" } });
      });
      mark();
    });

    /* The header takes its colour from whichever section sits under it: [data-tone="dark"] sections flip it to white. */
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = 36;
      const dark = Array.from(document.querySelectorAll<HTMLElement>("[data-tone='dark']")).some((el) => {
        if (el.closest(".menu")) return false;
        const r = el.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe;
      });
      root.dataset.header = dark ? "dark" : "light";
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); window.removeEventListener("load", refresh);
      cancelAnimationFrame(frame);
      ctx.revert();
      splits.forEach((split) => split.revert());
    };
  }, []);
}

/* Traps focus inside an overlay, closes on Escape, pauses the page scroll and returns focus to the trigger. */
export function focusOverlay(container: HTMLElement, close: () => void, trigger?: HTMLElement | null) {
  const previous = trigger ?? (document.activeElement as HTMLElement);
  getLenis()?.stop();
  document.documentElement.classList.add("overlay-open");
  const focusable = () => Array.from(container.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, [tabindex='0']")).filter((el) => el.offsetParent !== null);
  focusable()[0]?.focus({ preventScroll: true });
  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); close(); }
    if (event.key === "Tab") {
      const items = focusable(); const first = items[0]; const last = items[items.length - 1];
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener("keydown", handleKey);
  return () => {
    document.removeEventListener("keydown", handleKey);
    document.documentElement.classList.remove("overlay-open");
    getLenis()?.start();
    previous?.focus({ preventScroll: true });
  };
}
