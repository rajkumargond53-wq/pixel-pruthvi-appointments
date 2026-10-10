import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site-chrome";
import { TestimonialsCarousel, BookCta } from "@/components/sections";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/testimonials")({
  head: () => ({ meta: pageMeta("Patient Testimonials — Dr. Pruthvi Clinic", "Read what patients share about their experience at Dr. Pruthvi's clinic.") }),
  component: () => (
    <>
      <PageHero eyebrow="Testimonials" title="Patient experiences" intro="Genuine, consented patient feedback will appear here." />
      <section className="container-site mt-16"><TestimonialsCarousel /></section>
      <BookCta />
    </>
  ),
});
