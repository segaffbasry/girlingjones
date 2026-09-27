"use client";

import gsap from "gsap";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { focusOverlay, usePageMotion } from "@/components/motion";
import { Arrow, Pill, SocialIcon, reducedMotion } from "@/components/ui";
import { footerBlurb, latestJobs, splitSalary } from "@/lib/content";
import { contact, footerGroups, jobSearch, nav, socials } from "@/lib/site";

/* Full-screen menu, rebuilt from the live popup: a job search and the two newest jobs on one side, the site links
   and contact details on the other. In: an ink curtain drops from the top edge, then its contents rise into place.
   Out: the same timeline reversed, a little faster. Focus is trapped while open and returned to the trigger. */
function Menu({ open, close, trigger }: { open: boolean; close: () => void; trigger: HTMLElement | null }) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "gj" }, onReverseComplete: () => { el.style.visibility = "hidden"; } });
    tl.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .7, ease: "power3.inOut" }, 0)
      .fromTo(el.querySelectorAll("[data-menu-in]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .55, stagger: .045 }, .36);
    timeline.current = tl;
    return () => { tl.kill(); timeline.current = null; };
  }, []);

  useEffect(() => {
    const el = root.current, tl = timeline.current; if (!el || !tl) return;
    if (open) {
      el.style.visibility = "visible";
      tl.timeScale(reducedMotion() ? 50 : 1).play();
      return focusOverlay(el, close, trigger);
    }
    if (tl.progress() > 0) tl.timeScale(reducedMotion() ? 50 : 1.4).reverse();
  }, [open, close, trigger]);

  return <div className="menu" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open} data-lenis-prevent data-tone="dark">
    <div className="menu-top wrap">
      <a href="#top" className="brand" onClick={close} aria-label="Girling Jones home"><Logo title="" /></a>
      <button className="menu-close" onClick={close}>Close <span aria-hidden="true">×</span></button>
    </div>
    <div className="menu-body wrap">
      <nav className="menu-links" aria-label="Main">
        <ul>
          <li data-menu-in><a href="#top" onClick={close} aria-current="page"><span>Home</span><Arrow /></a></li>
          {nav.map((link) => <li key={link.href} data-menu-in><a href={link.href}><span>{link.label}</span><Arrow /></a></li>)}
        </ul>
      </nav>
      <aside className="menu-side" aria-label="Job search">
        <form className="search search-dark" action={jobSearch} method="get" role="search" data-menu-in>
          <label className="sr-only" htmlFor="menu-search">Search for a job</label>
          <input id="menu-search" type="search" name="job-search" placeholder="Search for a job" />
          <button type="submit" aria-label="Search jobs"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m13.5 13.5 5 5" stroke="currentColor" strokeWidth="2" /></svg></button>
        </form>
        <p className="menu-label" data-menu-in>Latest jobs</p>
        <ul className="menu-jobs">
          {latestJobs.slice(0, 2).map((job) => {
            const pay = splitSalary(job.salary);
            return <li key={job.url} data-menu-in><a href={job.url}>
              <strong>{job.title}</strong>
              <span>{job.location} / {job.type}</span>
              <span className="menu-job-pay">{pay.figure} {pay.unit}</span>
            </a></li>;
          })}
        </ul>
      </aside>
    </div>
    <div className="menu-foot wrap" data-menu-in>
      <a href={contact.tel}>{contact.phone}</a><a href={contact.mailto}>{contact.email}</a>
      <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} target="_blank" rel="noreferrer" aria-label={`Girling Jones on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}</ul>
    </div>
  </div>;
}

/* Frameless header: no bar or box. Its colour follows the section underneath (motion.tsx sets html[data-header]),
   it slides away on the way down and comes back on the way up. */
function Header() {
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const bar = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const el = bar.current; if (!el) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, delta = y - last;
      if (y < 120) { el.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(delta) < 6) return;
      el.classList.toggle("is-hidden", delta > 0 && !document.documentElement.classList.contains("overlay-open"));
      last = y;
    };
    const reveal = () => el.classList.remove("is-hidden");
    el.addEventListener("focusin", reveal);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { el.removeEventListener("focusin", reveal); window.removeEventListener("scroll", onScroll); };
  }, []);

  return <>
    <header className="site-header" ref={bar} data-hero-part>
      <div className="wrap site-header-inner">
        <a href="#top" className="brand" aria-label="Girling Jones home"><Logo title="" /></a>
        <nav className="header-nav" aria-label="Main navigation">
          {nav.map((link) => <a key={link.href} href={link.href} className="nav-item">{link.label}</a>)}
        </nav>
        <div className="header-actions">
          <Pill href="#cv" size="sm" className="header-cta" reveal={false} external={false}>Submit your CV</Pill>
          <button className="menu-toggle" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={(e) => { setTrigger(e.currentTarget); setOpen(true); }}>
            <span className="menu-toggle-lines" aria-hidden="true"><i /><i /><i /></span><span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>
    </header>
    <Menu open={open} close={close} trigger={trigger} />
  </>;
}

function Footer() {
  return <footer className="site-footer" data-tone="dark" data-late>
    <div className="wrap">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="#top" aria-label="Back to the top"><Logo title="Girling Jones" /></a>
          <p data-reveal="text">{footerBlurb}</p>
          <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} target="_blank" rel="noreferrer" aria-label={`Girling Jones on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}</ul>
        </div>
        {footerGroups.map((group) => <div key={group.title} className="footer-col" data-reveal="card">
          <h2 className="footer-title">{group.title}</h2>
          <ul>{group.links.map((l) => <li key={l.href}><a href={l.href} target={l.href.endsWith(".pdf") ? "_blank" : undefined} rel="noreferrer">{l.label}</a></li>)}</ul>
        </div>)}
      </div>
      <div className="footer-bar">
        <p>© {new Date().getFullYear()} Girling Jones</p>
        <p><a href={contact.tel}>{contact.phone}</a> · <a href={contact.mailto}>{contact.email}</a></p>
      </div>
    </div>
  </footer>;
}

/* Everything around the page: header and menu, footer, smooth scroll and reveals. */
export function Shell({ children }: { children: ReactNode }) {
  usePageMotion();
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" tabIndex={-1} />
    <Header />
    <main id="main" tabIndex={-1}>{children}</main>
    <Footer />
  </>;
}
