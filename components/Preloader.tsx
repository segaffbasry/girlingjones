"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import "@/components/motion";
import { reducedMotion } from "@/components/ui";

/* The company signing its name, built from the logo's own vector paths (lib/logo.ts).
   The "gj" monogram is a single merged outline (the g and j share a contour), so it cannot be split into tiles;
   instead its outline is drawn as a lime stroke and then filled white, like a signature being inked.
     Build  0.10–0.95s  monogram stroke draws (stroke-dashoffset), fill floods in, the twelve wordmark letters rise
                        one after another, the two hairlines draw outwards from the descenders, the tagline wipes open.
     Hold   0.95–1.20s
     Exit   1.20–1.75s  the whole lock-up travels and shrinks into the header logo while the ink ground fades onto
                        the hero film (whose opening frame sits under an ink overlay), so there is no colour jump.
   One GSAP timeline, 1.75s in all; the handover fires at 1.35s so the hero entrance overlaps the landing. */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.documentElement;
    let handed = false;
    const handover = () => {
      if (handed) return; handed = true;
      root.classList.remove("is-loading");
      root.dataset.intro = "done";
      document.dispatchEvent(new Event("intro:done"));
    };
    // The header logo stays hidden (is-landing) until the travelling logo arrives, then the two swap in one frame.
    const finish = () => { handover(); root.classList.remove("is-landing"); el.style.display = "none"; };
    delete root.dataset.intro;
    if (reducedMotion()) { finish(); return; }
    root.classList.add("is-loading", "is-landing"); // already set by the boot script in app/layout.tsx; repeated for client navigations

    const q = (part: string) => Array.from(el.querySelectorAll<SVGPathElement>(`[data-part="${part}"]`));
    const logo = el.querySelector<SVGSVGElement>(".logo")!;
    const target = document.querySelector<HTMLElement>(".site-header .brand .logo");
    const [mark] = q("mark");
    const length = mark.getTotalLength();
    const [ruleLeft, ruleRight] = q("rule");

    const tl = gsap.timeline({ defaults: { ease: "gj" }, onComplete: finish });
    tl.set(el.querySelector(".preloader-sign"), { autoAlpha: 1 })
      .set(mark, { strokeDasharray: length, strokeDashoffset: length, fillOpacity: 0 })
      .to(mark, { strokeDashoffset: 0, duration: .6, ease: "power2.inOut" }, .1)
      .to(mark, { fillOpacity: 1, duration: .3 }, .5)
      .to(mark, { strokeOpacity: 0, duration: .25 }, .62)
      .fromTo(q("letter"), { y: 9, opacity: 0 }, { y: 0, opacity: 1, duration: .32, stagger: .03 }, .34)
      .fromTo(ruleLeft, { scaleX: 0, transformOrigin: "100% 50%" }, { scaleX: 1, duration: .4, ease: "power2.out" }, .62)
      .fromTo(ruleRight, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: .4, ease: "power2.out" }, .62)
      .fromTo(q("tagline"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .4, ease: "power2.inOut" }, .66)
      .addLabel("exit", 1.2)
      .add(() => {
        // Measured at exit time so a late web-font or resize cannot misplace the landing.
        if (!target) return;
        const from = logo.getBoundingClientRect(), to = target.getBoundingClientRect();
        gsap.to(logo, { x: to.left - from.left + (to.width - from.width) / 2, y: to.top - from.top + (to.height - from.height) / 2, scale: to.width / from.width, transformOrigin: "50% 50%", duration: .55, ease: "power3.inOut" });
      }, "exit")
      .to(el, { backgroundColor: "rgba(34,31,32,0)", duration: .5, ease: "gj" }, "exit+=.05")
      .add(handover, "exit+=.15")
      .set({}, {}, "exit+=.55");

    // Never hold the page beyond ~2s, even if a frame stalls.
    const failsafe = window.setTimeout(finish, 2300);
    return () => { window.clearTimeout(failsafe); tl.kill(); gsap.killTweensOf(logo); root.classList.remove("is-loading", "is-landing"); };
  }, []);

  return <div className="preloader" ref={ref} aria-hidden="true">
    <div className="preloader-sign"><Logo parts title="" /></div>
  </div>;
}
