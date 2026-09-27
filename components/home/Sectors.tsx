import Image from "next/image";
import { Arrow, Eyebrow, Swipe } from "@/components/ui";
import { sectors, sectorsIntro } from "@/lib/content";
import { sectorLinks } from "@/lib/site";

/* The live "Want a job in construction?" cards, laid out like jdavisgc.com's "Our sectors": oversized outline
   pills with arrows, broken up by small photo pills, then the three live descriptions underneath.
   Each pill uses the copied button interaction at display size. */
const [ask, answer] = sectorsIntro.split(/(?<=\?)\s+/);

export function Sectors() {
  const photos = [
    { src: "/media/office.jpg", alt: "The Girling Jones office in Exeter from the air" },
    { src: "/media/plymouth.jpg", alt: "Royal William Yard, Plymouth, from the air" },
  ];
  return <section className="sectors section" aria-labelledby="sectors-title">
    <div className="wrap">
      <Eyebrow>Sectors</Eyebrow>
      <h2 className="h2 sectors-title" id="sectors-title" data-reveal="heading">{ask} <Swipe>{answer}</Swipe></h2>
      <ul className="sector-cloud">
        {sectors.map((sector, i) => <li key={sector.title} className="sector-cloud-item" data-reveal="card">
          <a className="sector-pill" href={sectorLinks[sector.title]}><span>{sector.title}</span><Arrow /></a>
          {photos[i] && <span className="photo-pill photo" aria-hidden="true"><Image src={photos[i].src} alt="" fill sizes="220px" /></span>}
        </li>)}
      </ul>
      <ol className="sector-notes">
        {sectors.map((sector, i) => <li key={sector.title} data-reveal="card">
          <span className="num label">0{i + 1}</span>
          <h3 className="h4">{sector.title}</h3>
          <p className="body">{sector.body}</p>
        </li>)}
      </ol>
    </div>
  </section>;
}
