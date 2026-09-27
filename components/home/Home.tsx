import Preloader from "@/components/Preloader";
import { Cv } from "@/components/home/Cv";
import { Hero } from "@/components/home/Hero";
import { Jobs } from "@/components/home/Jobs";
import { Marquee } from "@/components/home/Marquee";
import { Reviews } from "@/components/home/Reviews";
import { Sectors } from "@/components/home/Sectors";
import { Tinkle } from "@/components/home/Tinkle";
import { Tools } from "@/components/home/Tools";
import { Who } from "@/components/home/Who";

/* Section order follows the live homepage (sectors, jobs, CV, who, reviews, CTA), re-staged on jdavisgc.com's rhythm:
   dark film hero → white intro with marquee → sector pills → sticky job stack → tools accordion →
   sticky review stage → CV → dark photo CTA. "Who are we?" moves up to introduce the company before the lists. */
export function Home() {
  return <>
    <Preloader />
    <Hero />
    <Who />
    <Marquee />
    <Sectors />
    <Jobs />
    <Tools />
    <Reviews />
    <Cv />
    <Tinkle />
  </>;
}
