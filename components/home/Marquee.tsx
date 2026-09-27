/* jdavisgc.com's "Innovation · Safety · Ethics" band: one line of oversized pale type sliding left forever
   (120px, #EFEFEF on white, 35s linear, -50% loop). Here the words are the Girling Jones film's own end card,
   "No egos, no idiots.", and the pale tone is ink at 7% so it stays inside the palette.
   It is decorative (aria-hidden) and CSS-only; reduced motion stops it. */
const words = ["No egos", "No idiots", "Best to work with"];

export function Marquee() {
  const run = [...words, ...words];
  return <div className="marquee" aria-hidden="true">
    <div className="marquee-track">
      {[0, 1].map((copy) => <span key={copy} className="marquee-run">
        {run.map((w, i) => <span key={i}>{w}<i>·</i></span>)}
      </span>)}
    </div>
  </div>;
}
