import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectSection } from "@/components/sections/ProjectSection";
import { ArtSection } from "@/components/sections/ArtSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { EducationSection } from "@/components/sections/EducationSection";

/** Re-fetch the Art Journal from Supabase at most once a minute, so new uploads appear without a redeploy. */
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <AboutSection />
        <ProjectSection />
        <ArtSection />
        <EducationSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
