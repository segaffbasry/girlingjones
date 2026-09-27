/* Typed access to content/home.json (written by scripts/scrape.mjs). Components never import the JSON directly. */
import home from "@/content/home.json";

export type Job = (typeof home.jobs)[number];
export type Review = (typeof home.reviews)[number];

export const hero = home.hero;
export const sectorsIntro = home.sectorsIntro;
export const sectors = home.sectors;
export const who = home.who;
export const cvHelp = home.cvHelp;
export const cvFields = home.cvFields;
export const reviews = home.reviews;
export const reviewsHeader = home.reviewsHeader;
export const cta = home.cta;
export const footerBlurb = home.footerBlurb;
export const toolsIntro = home.toolsIntro;
export const scraped = home.scraped;

// Tools: the live screenshots are downloaded by scripts/media.sh under these names.
const toolImages: Record<string, string> = {
  "Salary Intelligence": "/media/tool-salary.jpg",
  "Worth The Drive?": "/media/tool-drive.jpg",
  "PAYE Calculator": "/media/tool-paye.jpg",
};
export const tools = home.tools.map((tool) => ({ ...tool, image: toolImages[tool.title] ?? "/media/tool-salary.jpg" }));

/* Jobs. The live homepage slider shows the newest five; this build shows the newest six (the job search order). */
export const jobs = home.jobs;
export const latestJobs = jobs.slice(0, 6);
export const latest = {
  ...home.latest,
  // "Our latest property and construction jobs": the two words the live page colours green get the swipe here.
  total: jobs.length,
};

// "£65000 – £70000 per year Juicy Benefits Package" → figure "£65,000 – £70,000", unit "per year", extra "Juicy Benefits Package".
export function splitSalary(salary: string) {
  const match = /^(£[\d,.]+(?:\s*[–-]\s*£[\d,.]+)?)\s*(per (?:year|annum|day|hour))?\s*(.*)$/i.exec(salary);
  if (!match) return { figure: salary, unit: "", extra: "" };
  const figure = match[1].replace(/\d{4,}/g, (n) => n.replace(/\B(?=(\d{3})+(?!\d))/g, ",")).replace(/\s*[–-]\s*/, " – ");
  return { figure, unit: match[2] ?? "", extra: match[3] ?? "" };
}

// Formatted by hand so the server and every browser print the same string (ICU differs on "Sep" vs "Sept", and a
// local time zone could shift the day), which keeps hydration clean.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const formatDate = (iso: string | null) => {
  const m = iso && /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : "";
};
