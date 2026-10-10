import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site-chrome";
import { clinic, pageMeta } from "@/lib/site";
import doctorImg from "@/assets/doctor.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: pageMeta("About Dr. Pruthvi — Qualifications & Approach to Care", "Learn about Dr. Pruthvi's qualifications, experience, areas of expertise and patient-centred philosophy.") }),
  component: About,
});

const expertise = ["[Area of expertise 1]", "[Area of expertise 2]", "[Area of expertise 3]", "[Area of expertise 4]", "[Area of expertise 5]", "[Area of expertise 6]"];

function About() {
  return (
    <>
      <PageHero eyebrow="About the doctor" title={`${clinic.doctor}`} intro={`${clinic.specialization} — dedicated to thoughtful, evidence-based care.`} />
      <div className="container-site mt-16 grid gap-14 lg:grid-cols-[380px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <img src={doctorImg} alt={`Professional portrait of ${clinic.doctor}`} width={896} height={1120} className="aspect-[4/5] w-full rounded-3xl object-cover shadow-soft" />
          <p className="mt-3 text-xs text-muted-foreground">Representative photo — replace with the doctor's own portrait.</p>
          <Button asChild size="lg" className="mt-6 w-full rounded-full"><Link to="/book">Book an Appointment</Link></Button>
        </aside>
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl text-primary-deep">Qualifications & experience</h2>
            <p className="mt-2 text-sm text-muted-foreground">Please replace the placeholders with verified credentials.</p>
            <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
              {[["Degree", "[Medical degree, institution, year]"], ["Postgraduate", "[Specialist qualification, institution, year]"], ["Registration", "[Medical council registration number]"], ["Certifications", "[Certifications / memberships]"], ["Experience", "[Number of years in practice]"]].map(([k, v]) => (
                <li key={k} className="grid gap-1 p-5 sm:grid-cols-[180px_1fr]"><span className="font-semibold">{k}</span><span className="text-muted-foreground">{v}</span></li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-3xl text-primary-deep">Philosophy of care</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">[Describe the doctor's approach — for example: listening first, explaining diagnoses in plain language, involving patients in decisions, and focusing on prevention as much as treatment.]</p>
          </section>
          <section>
            <h2 className="text-3xl text-primary-deep">Areas of expertise</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {expertise.map((e) => (
                <li key={e} className="flex items-center gap-3 rounded-xl bg-secondary p-4"><Check className="h-5 w-5 text-primary" aria-hidden />{e}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
