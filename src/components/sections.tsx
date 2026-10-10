import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Quote, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { clinic, services, testimonials } from "@/lib/site";

export function ServicesGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <article key={s.slug} className="group flex flex-col rounded-2xl border border-border bg-card p-7 shadow-card transition-transform hover:-translate-y-1">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
            <s.icon className="h-6 w-6" aria-hidden />
          </span>
          <h3 className="mt-5 text-xl text-primary-deep">{s.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
          <p className="mt-4 text-xs font-semibold text-muted-foreground">{s.details}</p>
          <Link to="/book" search={{ service: s.name }} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Book consultation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </article>
      ))}
    </div>
  );
}

export function TestimonialsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) return;
    const on = () => setCurrent(api.selectedScrollSnap());
    on();
    api.on("select", on);
    return () => { api.off("select", on); };
  }, [api]);

  return (
    <div>
      <p className="mb-6 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Sample testimonials — not real patient reviews</p>
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} aria-label="Patient testimonials">
        <CarouselContent>
          {testimonials.map((t) => (
            <CarouselItem key={t.name} className="md:basis-1/2">
              <figure className="h-full rounded-2xl border border-border bg-card p-8 shadow-card">
                <Quote className="h-7 w-7 text-primary/60" aria-hidden />
                <blockquote className="mt-4 font-display text-xl leading-snug text-primary-deep">“{t.text}”</blockquote>
                <figcaption className="mt-6 text-sm font-semibold text-muted-foreground">— {t.name}</figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
            {testimonials.map((t, i) => (
              <button key={t.name} role="tab" aria-selected={i === current} aria-label={`Testimonial ${i + 1}`} onClick={() => api?.scrollTo(i)}
                className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-primary" : "w-2 bg-border"}`} />
            ))}
          </div>
          <div className="relative flex gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </div>
      </Carousel>
    </div>
  );
}

export function ContactDetails() {
  const items = [
    { icon: MapPin, label: "Address", value: clinic.address },
    { icon: Phone, label: "Phone", value: clinic.phone },
    { icon: Mail, label: "Email", value: clinic.email },
  ];
  return (
    <div className="space-y-6">
      {items.map((i) => (
        <div key={i.label} className="flex gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><i.icon className="h-5 w-5" aria-hidden /></span>
          <div><p className="text-sm font-bold">{i.label}</p><p className="text-muted-foreground">{i.value}</p></div>
        </div>
      ))}
      <div className="flex gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><Clock className="h-5 w-5" aria-hidden /></span>
        <div>
          <p className="text-sm font-bold">Operating hours</p>
          {clinic.hours.map((h) => <p key={h.day} className="text-muted-foreground"><span className="font-medium text-foreground">{h.day}:</span> {h.time}</p>)}
          <p className="mt-1 text-xs text-muted-foreground">{clinic.hoursNote}</p>
        </div>
      </div>
      <div className="grid aspect-[16/9] place-items-center rounded-2xl border border-dashed border-input bg-soft text-sm text-muted-foreground">
        Map placeholder — add the clinic's Google Maps embed here
      </div>
    </div>
  );
}

export function BookCta() {
  return (
    <section className="container-site mt-24">
      <div className="bg-brand rounded-3xl px-8 py-14 text-center text-primary-foreground shadow-soft md:px-16">
        <h2 className="text-3xl md:text-4xl">Ready to see Dr. Pruthvi?</h2>
        <p className="mx-auto mt-3 max-w-xl opacity-90">Choose a convenient date and time — booking takes under two minutes.</p>
        <Button asChild size="lg" variant="secondary" className="mt-8 rounded-full"><Link to="/book">Book an Appointment</Link></Button>
      </div>
    </section>
  );
}
