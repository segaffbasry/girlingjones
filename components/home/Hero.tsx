"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/components/ui";
import { hero } from "@/lib/content";
import { jobSearch } from "@/lib/site";

/* Hero: the live brand film (a drive up to the Exeter office) full-bleed under an ink gradient, the live headline
   "Recruitment for [rotating sector] / BEST TO WORK WITH", and the live job search, which submits to the real
   girlingjones.com/job-search/. Layout after jdavisgc.com: left-aligned headline low in a full-height dark hero.
   The entrance waits for `intro:done` from the preloader. */
// "BEST TO WORK WITH" is set on two lines: "Best to" / "work with" (the live page sets it on one, in capitals via CSS).
const words = hero.title.toLowerCase().split(/\s+/);
const titleLines = [words.slice(0, 2), words.slice(2)].map((w) => w.join(" ").replace(/^./, (c) => c.toUpperCase()));

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const userPaused = useRef(false);

  /* Entrance. */
  useEffect(() => {
    const el = root.current; if (!el) return;
    const parts = el.querySelectorAll("[data-hero-in]");
    const lines = el.querySelectorAll(".hero-line > span");
    const header = document.querySelector(".site-header");
    if (reducedMotion()) return;
    gsap.set(parts, { opacity: 0, y: 24 });
    gsap.set(lines, { yPercent: 110 });
    gsap.set(el.querySelector(".hero-film"), { scale: 1.08 });
    if (header) gsap.set(header, { opacity: 0 });
    const play = () => {
      const tl = gsap.timeline({ defaults: { ease: "gj" } });
      tl.to(el.querySelector(".hero-film"), { scale: 1, duration: 1.6, ease: "power2.out" }, 0)
        .to(lines, { yPercent: 0, duration: 1, stagger: .1 }, .05)
        .to(parts, { opacity: 1, y: 0, duration: .8, stagger: .08, clearProps: "transform" }, .2);
      if (header) tl.to(header, { opacity: 1, duration: .6, clearProps: "opacity" }, .35);
    };
    if (document.documentElement.dataset.intro === "done") play();
    else document.addEventListener("intro:done", play, { once: true });
    return () => { document.removeEventListener("intro:done", play); gsap.killTweensOf([parts, lines, header]); };
  }, []);

  /* Rotating sector, as on the live site (its flip-text-anim), with a short vertical roll. */
  useEffect(() => {
    if (reducedMotion()) return;
    let timer = 0;
    const next = () => {
      const el = word.current; if (!el) return;
      gsap.to(el, { yPercent: -100, opacity: 0, duration: .4, ease: "power2.in", onComplete: () => {
        setIndex((i) => (i + 1) % hero.rotating.length);
        gsap.fromTo(el, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: "gj" });
      } });
    };
    const start = () => { timer = window.setInterval(next, 2800); };
    if (document.documentElement.dataset.intro === "done") start();
    else document.addEventListener("intro:done", start, { once: true });
    return () => { window.clearInterval(timer); document.removeEventListener("intro:done", start); };
  }, []);

  /* The film pauses while the hero is off screen, and stays paused if the visitor paused it. */
  useEffect(() => {
    const v = video.current, el = root.current; if (!v || !el) return;
    if (reducedMotion()) { v.pause(); setPaused(true); userPaused.current = true; return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !userPaused.current) void v.play().catch(() => {});
      else v.pause();
    }, { threshold: .05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current; if (!v) return;
    if (v.paused) { userPaused.current = false; void v.play(); setPaused(false); }
    else { userPaused.current = true; v.pause(); setPaused(true); }
  };

  return <section className="hero" ref={root} data-hero data-tone="dark" aria-labelledby="hero-title">
    <div className="hero-film" aria-hidden="true">
      <video ref={video} autoPlay muted loop playsInline preload="auto" poster="/media/hero-poster.jpg">
        <source src="/media/hero-1280.mp4" type="video/mp4" media="(max-width: 1100px)" />
        <source src="/media/hero-1920.mp4" type="video/mp4" />
      </video>
    </div>
    <div className="hero-shade" aria-hidden="true" />
    <div className="wrap hero-inner">
      <p className="hero-lead" data-hero-in>
        <span className="sr-only">{hero.lead} {hero.rotating.join(", ")}.</span>
        <span aria-hidden="true">{hero.lead} <span className="hero-word-mask"><span className="hero-word" ref={word}>{hero.rotating[index]}</span></span></span>
      </p>
      <h1 className="hero-title" id="hero-title">
        {titleLines.map((line, i) => <span key={i}><span className="hero-line"><span>{line}</span></span>{i < titleLines.length - 1 ? " " : ""}</span>)}
      </h1>
      <form className="search search-hero" action={jobSearch} method="get" role="search" data-hero-in>
        <label className="sr-only" htmlFor="hero-search">Search jobs</label>
        <svg className="search-icon" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m13.5 13.5 5 5" stroke="currentColor" strokeWidth="2" /></svg>
        <input id="hero-search" type="search" name="job-search" placeholder="Looking for…" />
        <button type="submit" className="pill pill-lime"><span>Search Jobs</span><svg className="arrow" width="15" height="15" viewBox="0 0 15 15" aria-hidden="true"><path d="M0 8.25H12.127L6.43075 13.9463L7.5 15L15 7.5L7.5 0L6.43075 1.05375L12.127 6.75H0V8.25Z" fill="currentColor" /></svg></button>
      </form>
    </div>
    <div className="wrap hero-foot" data-hero-in>
      <a href="#jobs" className="hero-scroll">Scroll <span aria-hidden="true">↓</span></a>
      <button className="film-toggle" onClick={toggle} aria-pressed={paused} aria-label={paused ? "Play background film" : "Pause background film"}>
        {paused
          ? <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 1l9 5-9 5z" fill="currentColor" /></svg>
          : <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2 1h3v10H2zM7 1h3v10H7z" fill="currentColor" /></svg>}
        <span>{paused ? "Play" : "Pause"}</span>
      </button>
    </div>
  </section>;
}
