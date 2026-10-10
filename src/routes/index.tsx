import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, HeartHandshake, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServicesGrid, TestimonialsCarousel, ContactDetails, BookCta } from "@/components/sections";
import { clinic, pageMeta } from "@/lib/site";
import clinicImg from "@/assets/clinic.jpg";
import doctorImg from "@/assets/doctor.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: pageMeta("Dr. Pruthvi Clinic — Compassionate, Patient-Focused Care", "Visit Dr. Pruthvi for attentive medical consultations in a calm, modern clinic. Book your appointment online in minutes.") }),
  component: Index,
});

const benefits = [
  { icon: HeartHandshake, title: "Patient-first care", text: "Time to listen, explain and plan together." },
  { icon: CalendarCheck, title: "Easy online booking", text: "Pick a date and an open slot in a few taps." },
  { icon: Clock, title: "Respect for your time", text: "Scheduled visits designed to reduce waiting." },
  { icon: ShieldCheck, title: "Privacy protected", text: "Only essential details collected, kept secure." },
];

function Index() {
  return (
    <>
      <section className="bg-soft">
        <div className="container-site grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div className="fade-up">
            <p className="eyebrow">{clinic.specialization}</p>
            <h1 className="mt-4 text-5xl leading-[1.05] text-primary-deep md:text-6xl">Care that listens.<br /><em className="text-primary">Medicine that heals.</em></h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">Welcome to the clinic of {clinic.doctor}. We combine careful diagnosis with warm, unhurried conversations — so you leave every visit informed and reassured.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7"><Link to="/book">Book an Appointment</Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7"><Link to="/about">Meet the Doctor</Link></Button>
            </div>
          </div>
          <div className="relative fade-up">
            <img src={clinicImg} alt="Bright, calm consultation room at the clinic" width={1280} height={960} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-soft" />
            <div className="absolute -bottom-8 left-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-3 pr-6 shadow-card sm:-left-8">
              <img src={doctorImg} alt={`Portrait of ${clinic.doctor}`} width={896} height={1120} className="h-16 w-16 rounded-xl object-cover object-top" />
              <div><p className="font-display text-lg text-primary-deep">{clinic.doctor}</p><p className="text-xs text-muted-foreground">{clinic.specialization}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-site mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((b) => (
          <div key={b.title} className="rounded-2xl p-2">
            <b.icon className="h-7 w-7 text-primary" aria-hidden />
            <h2 className="mt-4 text-lg text-primary-deep">{b.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
          </div>
        ))}
      </section>

      <section className="container-site mt-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow">Services</p><h2 className="mt-3 text-4xl text-primary-deep">How we can help</h2></div>
          <Link to="/services" className="text-sm font-semibold text-primary">View all services →</Link>
        </div>
        <ServicesGrid />
      </section>

      <section className="container-site mt-24 grid items-center gap-12 lg:grid-cols-2">
        <img src={doctorImg} alt={`${clinic.doctor} in the clinic`} width={896} height={1120} loading="lazy" className="aspect-[4/5] w-full max-w-md rounded-3xl object-cover shadow-soft" />
        <div>
          <p className="eyebrow">About the doctor</p>
          <h2 className="mt-3 text-4xl text-primary-deep">Meet {clinic.doctor}</h2>
          <p className="mt-5 text-lg text-muted-foreground">[Short introduction — the doctor's background, experience and what drives their approach to patient care.]</p>
          <dl className="mt-8 grid grid-cols-2 gap-4">
            {[["Qualifications", "[e.g. MBBS, MD]"], ["Experience", "[X years]"], ["Specialization", clinic.specialization], ["Languages", "[Languages spoken]"]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-secondary p-4"><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{k}</dt><dd className="mt-1 font-medium">{v}</dd></div>
            ))}
          </dl>
          <Button asChild variant="outline" className="mt-8 rounded-full"><Link to="/about">Read full profile</Link></Button>
        </div>
      </section>

      <section className="container-site mt-24">
        <p className="eyebrow">Testimonials</p>
        <h2 className="mt-3 mb-8 text-4xl text-primary-deep">What patients say</h2>
        <TestimonialsCarousel />
      </section>

      <section className="container-site mt-24 grid gap-12 lg:grid-cols-2">
        <div><p className="eyebrow">Visit us</p><h2 className="mt-3 text-4xl text-primary-deep">Find the clinic</h2><p className="mt-4 text-muted-foreground">Questions before your visit? <Link to="/contact" className="font-semibold text-primary">Send us a message</Link>.</p></div>
        <ContactDetails />
      </section>

      <BookCta />
    </>
  );
}
