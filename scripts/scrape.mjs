// Refreshes content/home.json from the live girlingjones.com homepage, job search and tools page.
// Usage: npm run scrape   (then `npm run media` if any image or film URL changed)
//
// The site returns 403 to non-browser user agents, so every request sends a desktop Chrome UA.
import * as cheerio from "cheerio";
import { writeFile } from "node:fs/promises";

const ORIGIN = "https://girlingjones.com";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

async function load(path) {
  const res = await fetch(new URL(path, ORIGIN), { headers: { "user-agent": UA, "accept-language": "en-GB" } });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return cheerio.load(await res.text());
}
const clean = (s) => s.replace(/\s+/g, " ").replace(/ /g, " ").trim();

/* ---------- Homepage ---------- */
const $ = await load("/");

const hero = {
  lead: "Recruitment for",
  rotating: $(".flip-text-anim").attr("data-items").split(",").map(clean),
  title: clean($(".banner-subheading").text()),
  film: new URL($("#main-banner video source").attr("src"), ORIGIN).href,
};

const sectorsIntro = clean($(".afs-jobs .top-content h2").text());
const sectors = $(".afs-job-card").map((_, el) => ({
  title: clean($(el).find("h3").text()),
  body: clean($(el).find("p").text()),
})).get();

const latest = {
  heading: clean($(".afs-latest-jobs-text h2").text()),
  body: clean($(".afs-latest-jobs-text p").text()),
  count: clean($(".afs-latest-jobs .pill").text()),
};

const cvHelp = {
  heading: clean($(".afs-form .side h2").text()),
  body: clean($(".afs-form .side p").text()),
  // The live template link points at a staging host; the same file is served from the live uploads folder.
  template: `${ORIGIN}/wp-content/uploads/2019/06/Girling-Jones-CV-Template.docx`,
};
const cvFields = $("#gform_2 .gfield").map((_, el) => clean($(el).find(".gfield_label").first().contents().first().text())).get().filter(Boolean);

const whoParas = $(".afs-join-our-team .container-left-content p").map((_, el) => $(el).html()).get();
const who = {
  heading: clean($(".afs-join-our-team h2").text()),
  intro: clean(cheerio.load(whoParas[0]).text()),
  markets: whoParas[1].split(/<br\s*\/?>/).map((s) => clean(cheerio.load(s).text()).replace(/^•\s*/, "")).filter(Boolean),
  closing: clean(cheerio.load(whoParas[2]).text()),
};

// The live slider repeats two reviews (Tim Dix, Andrew Murphy) at the end; they are kept once.
const seen = new Set();
const reviews = $(".gj-testimonials .swiper-slide").map((_, el) => ({
  text: clean($(el).find(".text").text()),
  name: clean($(el).find(".name").text()),
  source: clean($(el).find(".industry").text()),
})).get().filter((r) => { const key = r.name + r.text.slice(0, 40); if (seen.has(key)) return false; seen.add(key); return true; });
const reviewsHeader = { heading: clean($(".gj-testimonials header h2").text()), sub: clean($(".gj-testimonials header p").text()) };

const cta = { heading: clean($(".afs-cta h2").text()), body: clean($(".afs-cta .body p").first().text()), rating: clean($(".testimonials-footer span").text()) };
const footerBlurb = clean($("#footer .main-footer-column p").first().text());

/* ---------- Every live job (one request: the search page accepts job-length) ---------- */
const $j = await load("/job-search/?job-length=200&job-offset=0");
const jobs = $j(".afs-job-search-result-item").map((_, el) => {
  const $el = $j(el);
  const ld = JSON.parse($el.next('script[type="application/ld+json"]').html() || "{}");
  const info = $el.find(".info li").map((_, li) => clean($j(li).text())).get();
  return {
    title: clean($el.find("h2").text()),
    url: $el.find("h2 a").attr("href"),
    excerpt: clean($el.find(".excerpt").text()),
    location: info[0] ?? "",
    type: info[1] ?? "",
    category: clean($el.find(".category").text()),
    salary: clean($el.find(".salary").text()).replace(/\s*–\s*/, " – "),
    posted: ld.datePosted ?? null,
  };
}).get();

/* ---------- Tools (the "Cool stuff" page) ---------- */
const $t = await load("/cool-stuff/");
const toolsIntro = clean($t(".post-content p").filter((_, el) => $t(el).text().trim().length > 40).first().text());
const tools = $t(".wp-block-column").map((_, el) => {
  const box = $t(el);
  return {
    title: clean(box.find("h2").text()),
    body: clean(box.find("p").first().text()),
    href: box.find("a[href*='coolstuff']").attr("href"),
    // The largest srcset candidate is the uncropped screenshot.
    image: (box.find("img").attr("srcset") ?? "").split(",").map((c) => c.trim().split(" ")).sort((a, b) => parseInt(b[1]) - parseInt(a[1]))[0]?.[0] ?? box.find("img").attr("src"),
  };
}).get().filter((t) => t.href);

const out = { scraped: new Date().toISOString().slice(0, 10), hero, sectorsIntro, sectors, latest, cvHelp, cvFields, who, reviewsHeader, reviews, cta, footerBlurb, jobs, toolsIntro, tools };
await writeFile(new URL("../content/home.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(`home.json: ${sectors.length} sectors, ${reviews.length} reviews, ${jobs.length} jobs (live pill: "${latest.count}"), ${tools.length} tools`);
