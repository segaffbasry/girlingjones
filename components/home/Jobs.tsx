import { Arrow, Pill, Swipe } from "@/components/ui";
import { formatDate, latest, latestJobs, splitSalary } from "@/lib/content";
import { allJobs } from "@/lib/site";

/* "Our latest property and construction jobs", staged like jdavisgc.com's "Featured Projects": each job is a
   sticky article (top rule, title, location, type tag, arrow) that slides up over the one before it.
   The reference fills each card with a project photograph; jobs have none, so the card body carries the live
   excerpt and salary on alternating paper and ink panels instead. Every job links to its live page. */
const Heading = () => {
  // The live heading colours "property" and "construction" green; here those two words get the swipe.
  const parts = latest.heading.split(/(property|construction)/);
  return <>{parts.map((part, i) => /^(property|construction)$/.test(part) ? <Swipe key={i}>{part}</Swipe> : part)}</>;
};

export function Jobs() {
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

      <div className="job-stack">
        {latestJobs.map((job, i) => {
          const pay = splitSalary(job.salary);
          return <article key={job.url} className={`job ${i % 2 ? "job-ink" : "job-paper"}`} style={{ zIndex: i + 1 }} aria-labelledby={`job-${i}`}>
            <header className="job-bar">
              <h3 className="job-title" id={`job-${i}`}><a href={job.url}>{job.title}</a></h3>
              <p className="job-where">{job.location}</p>
              <p className="tag">{job.type}</p>
              <a className="arrow-ring" href={job.url} tabIndex={-1} aria-hidden="true"><Arrow /></a>
            </header>
            <div className="job-panel" data-tone={i % 2 ? "dark" : undefined}>
              <p className="job-excerpt">{job.excerpt}</p>
              <dl className="job-facts">
                <div className="job-pay"><dt className="sr-only">Salary</dt><dd><strong>{pay.figure}</strong> {pay.unit}{pay.extra && <span>{pay.extra}</span>}</dd></div>
                <div><dt>Sector</dt><dd>{job.category}</dd></div>
                {job.posted && <div><dt>Posted</dt><dd><time dateTime={job.posted}>{formatDate(job.posted)}</time></dd></div>}
              </dl>
              <a className="job-more" href={job.url}>Read more<span className="sr-only"> about {job.title}, {job.location}</span> <Arrow /></a>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
