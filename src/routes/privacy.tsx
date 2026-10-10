import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site-chrome";
import { clinic, pageMeta } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: pageMeta("Privacy Policy — Dr. Pruthvi Clinic", "How Dr. Pruthvi's clinic collects, uses and protects your personal information.") }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" intro="Template policy — have it reviewed by a legal professional before launch." />
      <article className="container-site mt-12 max-w-3xl space-y-6 leading-relaxed text-muted-foreground">
        <h2 className="text-2xl text-primary-deep">What we collect</h2>
        <p>When you book an appointment or contact us, we collect your name, phone number, email, preferred appointment details and any message you choose to share. We do not ask for detailed medical history online.</p>
        <h2 className="text-2xl text-primary-deep">How we use it</h2>
        <p>Only to schedule and manage your appointment and respond to your enquiries. We never sell your information.</p>
        <h2 className="text-2xl text-primary-deep">Storage & security</h2>
        <p>Data is transmitted over encrypted connections and stored securely with access limited to clinic staff.</p>
        <h2 className="text-2xl text-primary-deep">Your rights</h2>
        <p>You may request access to, correction of, or deletion of your data by contacting {clinic.email}.</p>
      </article>
    </>
  ),
});
