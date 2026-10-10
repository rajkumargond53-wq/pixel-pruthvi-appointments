import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site-chrome";
import { ServicesGrid, BookCta } from "@/components/sections";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: pageMeta("Medical Services — Dr. Pruthvi Clinic", "Consultations, preventive check-ups, chronic care and more at Dr. Pruthvi's clinic. Book a consultation online.") }),
  component: () => (
    <>
      <PageHero eyebrow="Medical services" title="Care for every stage of life" intro="Explore our consultations and book the one that fits your needs." />
      <section className="container-site mt-16"><ServicesGrid /></section>
      <BookCta />
    </>
  ),
});
