"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/components/ui";
import { cta, reviews, reviewsHeader } from "@/lib/content";

/* The 19 live Google reviews, staged like jdavisgc.com's testimonial: on a paper ground (#f6f6f6 there) a white circle
   grows to fill the section as it scrolls through, with one large quote at its centre. The reference pins the stage
   for a full screen; here the section is only as tall as its content, so there is no dead scroll around it. Visitors step through the quotes with the arrows; nothing rotates on its own. */
export function Reviews() {
  const root = useRef<HTMLElement>(null);
  const quote = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const review = reviews[index];

  useEffect(() => {
    const el = root.current; if (!el || reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".reviews-circle", { scale: .3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 60%", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  const go = (step: number) => {
    const next = (index + step + reviews.length) % reviews.length;
    const el = quote.current;
    if (!el || reducedMotion()) { setIndex(next); return; }
    gsap.to(el, { opacity: 0, y: -16 * step, duration: .25, ease: "power2.in", onComplete: () => {
      setIndex(next);
      gsap.fromTo(el, { opacity: 0, y: 16 * step }, { opacity: 1, y: 0, duration: .45, ease: "gj" });
      ScrollTrigger.refresh();
    } });
  };

  return <section className="reviews" ref={root} aria-labelledby="reviews-title" data-late>
    <div className="reviews-stage">
      <div className="reviews-circle" aria-hidden="true" />
      <div className="wrap reviews-inner">
        <header className="reviews-head">
          <h2 className="h3" id="reviews-title" data-reveal="heading">{reviewsHeader.heading}</h2>
          <p className="body" data-reveal="label">{reviewsHeader.sub}</p>
        </header>
        <figure className="review" aria-live="polite">
          <div ref={quote}>
            <blockquote className="review-text"><p>{review.text}</p></blockquote>
            <figcaption><strong>{review.name}</strong><span>{review.source}</span></figcaption>
          </div>
        </figure>
        <div className="review-controls">
          <p className="review-count num"><span>{String(index + 1).padStart(2, "0")}</span> / {String(reviews.length).padStart(2, "0")}</p>
          <div className="review-buttons">
            <button className="arrow-ring" onClick={() => go(-1)} aria-label="Previous review"><svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" style={{ transform: "scaleX(-1)" }}><path d="M0 8.25H12.127L6.43075 13.9463L7.5 15L15 7.5L7.5 0L6.43075 1.05375L12.127 6.75H0V8.25Z" fill="currentColor" /></svg></button>
            <button className="arrow-ring" onClick={() => go(1)} aria-label="Next review"><svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true"><path d="M0 8.25H12.127L6.43075 13.9463L7.5 15L15 7.5L7.5 0L6.43075 1.05375L12.127 6.75H0V8.25Z" fill="currentColor" /></svg></button>
          </div>
          <p className="review-score"><strong>{cta.rating}</strong> on Google Reviews</p>
        </div>
      </div>
    </div>
  </section>;
}
