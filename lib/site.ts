/* Site structure taken from the live girlingjones.com header, popup menu and footer (checked 2026-09-28).
   Only the homepage is rebuilt here, so every other link goes to the real URL on girlingjones.com. */
import type { BrandIcon } from "@/lib/brand-icons";

export type Link = { label: string; href: string };

export const LIVE = "https://girlingjones.com";

// Live header: Home · Jobs · Tools · About Us · Contact Us.
export const nav: Link[] = [
  { label: "Jobs", href: `${LIVE}/girling-jones-jobs/` },
  { label: "Tools", href: `${LIVE}/cool-stuff/` },
  { label: "About Us", href: `${LIVE}/about-us/` },
  { label: "Contact Us", href: `${LIVE}/contact/` },
];

export const jobSearch = `${LIVE}/job-search/`;
export const allJobs = `${LIVE}/girling-jones-jobs/`;
export const contactPage = `${LIVE}/contact/`;
export const registration = `${LIVE}/registration-form/`;

// Live footer columns.
export const footerGroups: { title: string; links: Link[] }[] = [
  { title: "Browse", links: [
    { label: "Jobs", href: `${LIVE}/girling-jones-jobs/` },
    { label: "About Us", href: `${LIVE}/about-us/` },
    { label: "Contact Us", href: `${LIVE}/contact/` },
  ] },
  { title: "Cool stuff", links: [
    { label: "Registration Form", href: `${LIVE}/registration-form/` },
    { label: "Salary Intelligence", href: "https://coolstuff.girlingjones.com/" },
    { label: "Worth the Drive?", href: "https://coolstuff.girlingjones.com/real-rate/" },
    { label: "PAYE Calculator", href: "https://coolstuff.girlingjones.com/payslip/" },
  ] },
  { title: "Legal", links: [
    { label: "Terms and Conditions", href: `${LIVE}/wp-content/uploads/2026/07/GJ-Terms-of-Business.pdf` },
    { label: "Privacy Policy", href: `${LIVE}/privacy-policy/` },
    { label: "Cookie Policy", href: `${LIVE}/cookie-policy/` },
  ] },
];

// The popup menu and footer list the same number and address (the address is Cloudflare-obfuscated on the live page).
export const contact = {
  phone: "01392 493 347",
  tel: "tel:+441392493347",
  email: "info@girlingjones.com",
  mailto: "mailto:info@girlingjones.com",
  base: "Exeter, Devon",
};

export const socials: { name: string; href: string; icon: BrandIcon }[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/girling-jones-ltd/", icon: "linkedin" },
  { name: "X", href: "https://x.com/GirlingJonesLtd", icon: "x" },
  { name: "Facebook", href: "https://www.facebook.com/GirlingJonesltd", icon: "facebook" },
];

// The homepage "Who are we?" market list maps onto these live sector pages. Building Surveying has no page of
// its own on the live site, so it opens the sectors overview.
export const sectorLinks: Record<string, string> = {
  "Construction Consultancy": `${LIVE}/consultancy/`,
  "Civil Engineering, Energy and Utilities": `${LIVE}/construction/`,
  "Building Surveying and General Practice": `${LIVE}/sectors/`,
};
