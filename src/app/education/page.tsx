import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { EducationSection } from "@/components/sections/EducationSection";

export const metadata: Metadata = {
  title: "Education",
  description: "My education journey from primary school to my current university studies.",
};

export default function EducationPage() {
  return (
    <>
      <Navbar />
      <EducationSection standalone />
      <Footer />
    </>
  );
}
