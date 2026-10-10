import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clinic } from "@/lib/site";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Doctor" },
  { to: "/services", label: "Services" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${clinic.name} home`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-soft">
        <Plus className="h-5 w-5" strokeWidth={3} />
      </span>
      <span className="font-display text-xl text-primary-deep">Dr. Pruthvi</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="container-site flex h-18 items-center justify-between py-4">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-primary-deep" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden rounded-full sm:inline-flex"><Link to="/book">Book Appointment</Link></Button>
          <button className="rounded-lg p-2 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background lg:hidden" aria-label="Mobile">
          <div className="container-site flex flex-col py-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 text-base font-medium">{n.label}</Link>
            ))}
            <Button asChild className="mt-2 rounded-full"><Link to="/book" onClick={() => setOpen(false)}>Book Appointment</Link></Button>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="container-site grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">Patient-focused care in a calm, welcoming clinic. {clinic.address}</p>
        </div>
        <div>
          <h2 className="font-sans text-sm font-bold">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {nav.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-foreground">{n.label}</Link></li>)}
            <li><Link to="/book" className="hover:text-foreground">Book Appointment</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-sm font-bold">Information</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
            <li>{clinic.phone}</li>
            <li>{clinic.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-site flex flex-col gap-2 py-5 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {clinic.name}. All rights reserved.</p>
          <p>This website provides general information and is not a substitute for professional medical advice. In an emergency, call 112.</p>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="bg-soft border-b border-border/60">
      <div className="container-site py-16 md:py-20 fade-up">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl text-primary-deep md:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{intro}</p>}
      </div>
    </section>
  );
}
