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

/* Jobs come straight after the hero (client feedback: "the jobs are the most important part"), then the sectors,
   the tools, and only then "Who are we?" with its marquee, the reviews, the CV prompt and the closing CTA.
   Rhythm after jdavisgc.com: dark film hero → white lists → sticky review stage → dark photo CTA. */
export function Home() {
  return <>
    <Preloader />
    <Hero />
    <Jobs />
    <Sectors />
    <Tools />
    <Who />
    <Marquee />
    <Reviews />
    <Cv />
    <Tinkle />
  </>;
}
