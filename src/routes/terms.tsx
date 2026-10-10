import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site-chrome";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: pageMeta("Terms & Conditions — Dr. Pruthvi Clinic", "Terms for using Dr. Pruthvi's clinic website and online appointment booking.") }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" intro="Template terms — have them reviewed by a legal professional before launch." />
      <article className="container-site mt-12 max-w-3xl space-y-6 leading-relaxed text-muted-foreground">
        <h2 className="text-2xl text-primary-deep">Medical disclaimer</h2>
        <p>Content on this website is for general information and does not replace a consultation. For emergencies, call 112 or visit the nearest hospital.</p>
        <h2 className="text-2xl text-primary-deep">Appointments</h2>
        <p>Online bookings are subject to confirmation by the clinic. Please arrive a few minutes early and inform us in advance if you need to cancel or reschedule.</p>
        <h2 className="text-2xl text-primary-deep">Use of the website</h2>
        <p>Please provide accurate information and do not misuse the booking or contact forms.</p>
      </article>
    </>
  ),
});
