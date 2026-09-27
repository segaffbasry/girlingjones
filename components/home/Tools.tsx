"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Eyebrow, Pill, Swipe } from "@/components/ui";
import { tools, toolsIntro } from "@/lib/content";

/* The live "Cool stuff" tools, laid out like jdavisgc.com's services block: an accordion on one side and a
   picture that follows the open item on the other. Each tool launches on coolstuff.girlingjones.com. */
export function Tools() {
  const [open, setOpen] = useState(0);
  const id = useId();
  return <section className="tools section" aria-labelledby={`${id}-title`}>
    <div className="wrap split tools-grid">
      <div>
        <Eyebrow>Tools</Eyebrow>
        <h2 className="h2" id={`${id}-title`} data-reveal="heading"><Swipe>Cool</Swipe> stuff</h2>
        <p className="lede tools-intro" data-reveal="text">{toolsIntro}</p>
        <ul className="accordion">
          {tools.map((tool, i) => <li key={tool.title} className="acc-item" data-open={open === i || undefined} data-reveal="card">
            <h3>
              <button id={`${id}-b${i}`} aria-expanded={open === i} aria-controls={`${id}-p${i}`} onClick={() => setOpen(i)}>
                <span className="num label">0{i + 1}</span><span className="h4">{tool.title}</span><span className="acc-icon" aria-hidden="true" />
              </button>
            </h3>
            <div className="acc-panel" id={`${id}-p${i}`} role="region" aria-labelledby={`${id}-b${i}`} inert={open !== i}>
              <div>
                <p className="body">{tool.body}</p>
                <Pill href={tool.href} tone="lime" size="sm" reveal={false}>Launch Tool</Pill>
              </div>
            </div>
          </li>)}
        </ul>
      </div>
      <div className="tools-frame" data-reveal="image"><div className="tools-frame-inner">
        {tools.map((tool, i) => <Image key={tool.title} src={tool.image} alt={`${tool.title} tool screenshot`} fill sizes="(max-width: 900px) 100vw, 46vw" className={open === i ? "is-on" : undefined} aria-hidden={open !== i} />)}
      </div></div>
    </div>
  </section>;
}
