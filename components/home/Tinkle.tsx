import Image from "next/image";
import { Pill } from "@/components/ui";
import { cta } from "@/lib/content";
import { contact, contactPage } from "@/lib/site";

/* "Why not give us a tinkle?", closing the page like jdavisgc.com's "Ready to break ground?" band: a full-width
   photograph under an ink shade with the heading, one line and a button. The still is Simon on the red phone,
   taken from the Girling Jones brand film and turned monochrome so it stays in the palette. */
export function Tinkle() {
  return <section className="tinkle" data-tone="dark" aria-labelledby="tinkle-title" data-late>
    <div className="tinkle-photo photo" data-parallax aria-hidden="true">
      <Image src="/media/tinkle.jpg" alt="" fill sizes="100vw" />
    </div>
    <div className="tinkle-shade" aria-hidden="true" />
    <div className="wrap tinkle-inner">
      <h2 className="display" id="tinkle-title" data-reveal="heading">{cta.heading}</h2>
      <p className="lede" data-reveal="text">{cta.body}</p>
      <div className="button-row">
        <Pill href={contactPage} tone="light">Get in touch</Pill>
        <a className="tinkle-phone" href={contact.tel} data-reveal="label">{contact.phone}</a>
      </div>
    </div>
  </section>;
}
