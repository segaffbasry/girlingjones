/* One easing family for the whole site. The CSS twins live in app/globals.css as --ease-* custom properties. */

// jdavisgc.com ".fade-in-up": transition all 0.5s ease-out, translateY(40px) → 0 (CSS "ease-out" = cubic-bezier(0,0,.58,1)).
// A slightly longer tail (.22,.61,.36,1) keeps the same ease-out shape but settles more softly over GSAP's longer moves.
export const EASE = "0.22,0.61,0.36,1";
// jdavisgc.com ".red-swipe::before": transition width 0.5s cubic-bezier(0.16, 0.01, 0.77, 1).
export const EASE_SWIPE = "0.16,0.01,0.77,1";
// jdavisgc.com ".the-button": Tailwind "transition duration-300 ease-in-out" = cubic-bezier(0.4, 0, 0.2, 1).
export const EASE_HOVER = "0.4,0,0.2,1";

export const timing = {
  // jdavisgc's 0.5s fade-in-up is the base; labels are quicker, images slower.
  label: 0.45,
  heading: 0.8,
  text: 0.7,
  card: 0.65,
  image: 1.1,
  swipe: 0.5, // jdavisgc .red-swipe
  late: 0.75, // multiplier for sections marked data-late
};
