import { siteConfig } from "@/config/site";
import { PortraitComposition } from "@/components/decor/PortraitComposition";
import { RotatingPhrase } from "@/components/decor/RotatingPhrase";
import { StatusChip } from "@/components/decor/StatusChip";
import { LinkButton } from "@/components/ui/LinkButton";

/**
 * The page opens on a split desk: graph paper on one side (logic),
 * watercolour wash on the other (art). The portrait sits where they meet.
 */
export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-graph absolute inset-x-0 top-0 -z-10 h-1/2 lg:bottom-0 lg:right-1/2 lg:left-0 lg:h-auto [mask-image:linear-gradient(to_bottom,black,transparent)] lg:[mask-image:linear-gradient(to_right,black_30%,transparent)]"
      />
      <div aria-hidden="true" className="bg-wash absolute inset-x-0 bottom-0 -z-10 h-1/2 lg:left-1/2 lg:right-0 lg:top-0 lg:h-auto" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
        <div>
          <StatusChip text={siteConfig.currentlyExploring} />
          <h1 id="hero-title" className="mt-6 text-5xl sm:text-6xl">
            Hi, I&apos;m {siteConfig.name}.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/90">{siteConfig.intro}</p>
          <p className="mt-4 text-lg">
            Right now I&apos;m probably <RotatingPhrase phrases={siteConfig.rotatingPhrases} />.
          </p>
          <p className="mt-6 max-w-md -rotate-1 border-l-4 border-rose pl-4 font-serif text-xl italic text-forest">
            {siteConfig.tagline}
          </p>

          {/* Two paths, same size and weight */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="#work" variant="forest">Explore my projects</LinkButton>
            <LinkButton href="#art" variant="sage">Wander through my art</LinkButton>
          </div>
        </div>

        <PortraitComposition />
      </div>
    </section>
  );
}
