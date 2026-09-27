import { Logo } from "@/components/Logo";
import { Pill, Swipe } from "@/components/ui";
import { cvHelp } from "@/lib/content";
import { contactPage, registration } from "@/lib/site";

/* "Submit your CV" and "Need More Help?" from the live homepage. The live form (Gravity Forms with reCAPTCHA and
   a file upload) cannot post from this demo, so the button opens the live registration form instead of
   imitating a form that would go nowhere. The oversized "gj" monogram echoes the live section's logomark. */
export function Cv() {
  return <section className="cv section" id="cv" tabIndex={-1} aria-labelledby="cv-title" data-late>
    <div className="cv-mark" aria-hidden="true"><Logo markOnly title="" /></div>
    <div className="wrap split cv-grid">
      <div className="cv-main">
        <h2 className="display" id="cv-title" data-reveal="heading">Submit your <Swipe>CV</Swipe></h2>
        <Pill href={registration} tone="lime">Submit your CV</Pill>
      </div>
      <div className="cv-side" data-reveal="card">
        <h3 className="h3">{cvHelp.heading}</h3>
        <p className="body">{cvHelp.body}</p>
        <div className="button-row">
          <Pill href={contactPage} tone="ink" size="sm" reveal={false}>Contact us</Pill>
          <Pill href={cvHelp.template} tone="line" size="sm" reveal={false}>Download template</Pill>
        </div>
      </div>
    </div>
  </section>;
}
