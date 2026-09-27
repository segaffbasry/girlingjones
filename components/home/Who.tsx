import Image from "next/image";
import { Eyebrow, Pill, Swipe } from "@/components/ui";
import { who } from "@/lib/content";
import { contactPage } from "@/lib/site";

/* "Who are we?" after jdavisgc.com's "Who we are": eyebrow, a heading with one swiped phrase, copy and a button on
   the left, a photograph on the right, and a slow marquee of the brand line underneath.
   The heading is the live page's own closing line ("The consultancy of choice in the region. Best to work with!"). */
const [lead, ...rest] = who.closing.split(/(?<=\.)\s+/);

export function Who() {
  return <section className="who section" id="who" tabIndex={-1} aria-labelledby="who-title">
    <div className="wrap split who-grid">
      <div className="who-copy">
        <Eyebrow>{who.heading}</Eyebrow>
        <h2 className="h2" id="who-title" data-reveal="heading">{lead} <Swipe>{rest.join(" ")}</Swipe></h2>
        <p className="lede" data-reveal="text">{who.intro}</p>
        <ol className="markets">
          {who.markets.map((market, i) => <li key={market} data-reveal="card"><span className="num">0{i + 1}</span>{market}</li>)}
        </ol>
        <Pill href={contactPage} tone="line">Make Contact</Pill>
      </div>
      <figure className="who-photo photo" data-reveal="image" data-parallax>
        <Image src="/media/join-our-team.jpg" alt="Simon Girling on a bench outside the Girling Jones office, raising a GJ mug" fill sizes="(max-width: 900px) 100vw, 46vw" />
      </figure>
    </div>
  </section>;
}
