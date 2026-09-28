"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Arrow, Pill, Swipe, reducedMotion } from "@/components/ui";
import { formatDate, jobs, latest, splitSalary } from "@/lib/content";
import { allJobs } from "@/lib/site";

/* "Our latest property and construction jobs": every live job (not just the newest five the live slider shows) in
   one horizontal row of cards. It scrolls sideways by trackpad, touch, shift-wheel, the arrow buttons or the
   keyboard, snaps card by card, and can be narrowed by location. Each card links to its live job page.
   (Client feedback: the earlier sticky stack took too much vertical scrolling to get through the jobs.) */
const Heading = () => {
  // The live heading colours "property" and "construction" green; here those two words get the swipe.
  const parts = latest.heading.split(/(property|construction)/);
  return <>{parts.map((part, i) => /^(property|construction)$/.test(part) ? <Swipe key={i}>{part}</Swipe> : part)}</>;
};

// Location filters in the live job search's order of frequency.
const locations = Object.entries(jobs.reduce<Record<string, number>>((acc, job) => { acc[job.location] = (acc[job.location] ?? 0) + 1; return acc; }, {}))
  .sort((a, b) => b[1] - a[1]);

export function Jobs() {
  const [where, setWhere] = useState<string | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false, progress: 0 });
  const track = useRef<HTMLUListElement>(null);
  const list = useMemo(() => (where ? jobs.filter((job) => job.location === where) : jobs), [where]);

  useEffect(() => {
    const el = track.current; if (!el) return;
    el.scrollTo({ left: 0 });
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft > max - 4, progress: max > 0 ? el.scrollLeft / max : 1 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [list]);

  const step = (dir: number) => {
    const el = track.current; if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const by = card ? (card.offsetWidth + 16) * Math.max(1, Math.floor(el.clientWidth / (card.offsetWidth + 16))) : el.clientWidth;
    el.scrollBy({ left: dir * by, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  return <section className="jobs section" id="jobs" tabIndex={-1} aria-labelledby="jobs-title">
    <div className="wrap">
      <div className="jobs-head">
        <div>
          <p className="count-pill" data-reveal="label"><span className="dot" aria-hidden="true" />{latest.total} Jobs Found</p>
          <h2 className="h2" id="jobs-title" data-reveal="heading"><Heading /></h2>
        </div>
        <div className="jobs-head-side">
          <p className="lede" data-reveal="text">{latest.body}</p>
          <Pill href={allJobs} tone="ink">View All jobs</Pill>
        </div>
      </div>

      <div className="jobs-bar" data-reveal="label">
        <div className="chips" role="group" aria-label="Filter jobs by location">
          <button className="chip" aria-pressed={where === null} onClick={() => setWhere(null)}>All <span>{jobs.length}</span></button>
          {locations.map(([name, count]) => <button key={name} className="chip" aria-pressed={where === name} onClick={() => setWhere(name)}>{name} <span>{count}</span></button>)}
        </div>
        <div className="jobs-nav">
          <button className="arrow-ring" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous jobs" aria-controls="job-track"><svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" style={{ transform: "scaleX(-1)" }}><path d="M0 8.25H12.127L6.43075 13.9463L7.5 15L15 7.5L7.5 0L6.43075 1.05375L12.127 6.75H0V8.25Z" fill="currentColor" /></svg></button>
          <button className="arrow-ring" onClick={() => step(1)} disabled={edge.end} aria-label="More jobs" aria-controls="job-track"><svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true"><path d="M0 8.25H12.127L6.43075 13.9463L7.5 15L15 7.5L7.5 0L6.43075 1.05375L12.127 6.75H0V8.25Z" fill="currentColor" /></svg></button>
        </div>
      </div>
    </div>

    <div className="job-rail" data-reveal="card">
      <ul className="job-track" id="job-track" ref={track} tabIndex={0} aria-label={`${list.length} jobs${where ? ` in ${where}` : ""}, scroll sideways`} data-lenis-prevent-horizontal>
        {list.map((job, i) => {
          const pay = splitSalary(job.salary);
          return <li key={job.url} className={`job-card${i % 3 === 1 ? " job-card-ink" : ""}`}>
            <article aria-labelledby={`job-${i}`}>
              <p className="job-meta"><span>{job.location}</span><span className="tag">{job.type}</span></p>
              <h3 className="job-title" id={`job-${i}`}><a href={job.url}>{job.title}</a></h3>
              <p className="job-excerpt">{job.excerpt}</p>
              <div className="job-foot">
                <p className="job-pay"><strong>{pay.figure}</strong> {pay.unit}{pay.extra && <span>{pay.extra}</span>}</p>
                <p className="job-small">{job.category}{job.posted && <> · <time dateTime={job.posted}>{formatDate(job.posted)}</time></>}</p>
                <a className="job-more" href={job.url} tabIndex={-1} aria-hidden="true">Read more <Arrow /></a>
              </div>
            </article>
          </li>;
        })}
      </ul>
    </div>
    <div className="wrap">
      <div className="job-progress" aria-hidden="true"><span style={{ transform: `scaleX(${Math.max(.04, edge.progress)})` }} /></div>
    </div>
  </section>;
}
