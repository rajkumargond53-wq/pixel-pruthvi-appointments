import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageHero } from "@/components/site-chrome";
import { Field } from "@/components/field";
import { supabase } from "@/integrations/supabase/client";
import { clinic, formatSlot, pageMeta, services, timeSlots } from "@/lib/site";

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>): { service?: string } => (typeof s["service"] === "string" ? { service: s["service"] as string } : {}),
  head: () => ({ meta: pageMeta("Book an Appointment — Dr. Pruthvi Clinic", "Book a consultation with Dr. Pruthvi online. Choose your service, date and an available time slot.") }),
  component: Book,
});

function todayIST() {
  const now = new Date(Date.now() + 5.5 * 3600_000);
  return { date: now.toISOString().slice(0, 10), minutes: now.getUTCHours() * 60 + now.getUTCMinutes() };
}

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  patientType: z.enum(["new", "returning"], { errorMap: () => ({ message: "Please choose one" }) }),
  service: z.string().min(1, "Please choose a consultation type"),
  date: z.string().min(1, "Please choose a date"),
  slot: z.string().min(1, "Please choose a time slot"),
  reason: z.string().trim().max(500).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the privacy policy" }) }),
});

function Book() {
  const search = Route.useSearch();
  const [service, setService] = useState(search.service && services.some((s) => s.name === search.service) ? (search.service ?? "") : "");
  const [patientType, setPatientType] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [consent, setConsent] = useState(false);
  const [booked, setBooked] = useState<string[] | null>(null);
  const [slotsError, setSlotsError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [reference, setReference] = useState<{ ref: string; date: string; slot: string } | null>(null);
  const [today, setToday] = useState("");

  useEffect(() => setToday(todayIST().date), []);

  async function loadSlots(d: string) {
    setBooked(null); setSlotsError(false);
    const { data, error } = await supabase.rpc("get_booked_slots", { p_date: d });
    if (error) { setSlotsError(true); return; }
    setBooked((data as string[]) ?? []);
  }

  useEffect(() => { setSlot(""); if (date) loadSlots(date); }, [date]);

  const isSunday = date ? new Date(date + "T00:00:00").getDay() === 0 : false;
  const t = todayIST();
  const available = timeSlots.filter((s) => {
    if (booked?.includes(s)) return false;
    if (date === t.date) { const [h, m] = s.split(":").map(Number); return (h ?? 0) * 60 + (m ?? 0) > t.minutes + 30; }
    return true;
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return;
    const parsed = schema.safeParse({ fullName: fd.get("fullName"), phone: fd.get("phone"), email: fd.get("email"), reason: fd.get("reason") || undefined, patientType, service, date, slot, consent });
    const errs: Record<string, string> = {};
    if (!parsed.success) parsed.error.issues.forEach((i) => { errs[String(i.path[0])] ??= i.message; });
    if (date && date < todayIST().date) errs["date"] = "Please choose today or a future date";
    if (Object.keys(errs).length || !parsed.success) { setErrors(errs); return; }
    setErrors({}); setStatus("sending"); setSubmitError("");
    const d = parsed.data;
    const { data, error } = await supabase.rpc("book_appointment", {
      p_full_name: d.fullName, p_phone: d.phone, p_email: d.email, p_patient_type: d.patientType,
      p_service: d.service, p_date: d.date, p_slot: d.slot, p_reason: d.reason ?? "",
    });
    if (error) {
      setStatus("error");
      if (error.message.includes("SLOT_TAKEN")) { setSubmitError("Sorry, that time slot was just booked. Please pick another."); setSlot(""); loadSlots(date); }
      else setSubmitError("We couldn't save your booking. Please try again or call the clinic.");
      return;
    }
    setReference({ ref: data as string, date: d.date, slot: d.slot });
    setStatus("idle");
  }

  if (reference) {
    return (
      <div className="container-site py-24">
        <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-10 text-center shadow-card fade-up" role="status">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-5 text-3xl text-primary-deep">Appointment booked</h1>
          <p className="mt-3 text-muted-foreground">
            {new Date(reference.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} at {formatSlot(reference.slot)}
          </p>
          <div className="mt-6 rounded-2xl bg-secondary p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your reference</p>
            <p className="mt-1 font-display text-3xl tracking-wider text-primary-deep">{reference.ref}</p>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Please keep this reference. To cancel or reschedule, call {clinic.phone}.</p>
          <Button asChild variant="outline" className="mt-6 rounded-full"><Link to="/">Back to home</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero eyebrow="Online booking" title="Book an appointment" intro="Fill in a few details and choose an available time. It takes under two minutes." />
      <div className="container-site mt-12">
        <form onSubmit={onSubmit} noValidate className="mx-auto max-w-3xl space-y-10 rounded-3xl border border-border bg-card p-7 shadow-card md:p-10">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <fieldset className="space-y-5">
            <legend className="font-display text-2xl text-primary-deep">1. Your details</legend>
            <Field id="fullName" label="Full name" error={errors["fullName"]}><Input id="fullName" name="fullName" autoComplete="name" /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="phone" label="Phone number" error={errors["phone"]}><Input id="phone" name="phone" type="tel" autoComplete="tel" /></Field>
              <Field id="email" label="Email address" error={errors["email"]}><Input id="email" name="email" type="email" autoComplete="email" /></Field>
            </div>
            <div className="space-y-2">
              <Label>Are you a new or returning patient?</Label>
              <RadioGroup value={patientType} onValueChange={setPatientType} className="flex gap-6" aria-label="Patient type">
                {([["new", "New patient"], ["returning", "Returning patient"]] as const).map(([v, l]) => (
                  <div key={v} className="flex items-center gap-2"><RadioGroupItem value={v} id={`pt-${v}`} /><Label htmlFor={`pt-${v}`} className="font-normal">{l}</Label></div>
                ))}
              </RadioGroup>
              {errors["patientType"] && <p className="text-sm text-destructive" role="alert">{errors["patientType"]}</p>}
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="font-display text-2xl text-primary-deep">2. Appointment</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="service" label="Consultation type" error={errors["service"]}>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger id="service"><SelectValue placeholder="Choose a service" /></SelectTrigger>
                  <SelectContent>{services.map((s) => <SelectItem key={s.slug} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field id="date" label="Preferred date" error={errors["date"]}>
                <Input id="date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
            </div>
            <div className="space-y-3">
              <Label>Available time slots</Label>
              {!date ? <p className="text-sm text-muted-foreground">Choose a date to see open times.</p>
                : isSunday ? <p className="text-sm text-muted-foreground">The clinic is closed on Sundays. Please pick another day.</p>
                : slotsError ? <p className="text-sm text-destructive">Couldn't load times. <button type="button" className="underline" onClick={() => loadSlots(date)}>Retry</button></p>
                : booked === null ? <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Checking availability…</p>
                : available.length === 0 ? <p className="text-sm text-muted-foreground">No times left on this day — please try another date.</p>
                : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Time slot">
                    {available.map((s) => (
                      <button key={s} type="button" role="radio" aria-checked={slot === s} onClick={() => setSlot(s)}
                        className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${slot === s ? "border-primary bg-primary text-primary-foreground" : "border-input hover:border-primary hover:text-primary"}`}>
                        {formatSlot(s)}
                      </button>
                    ))}
                  </div>
                )}
              {errors["slot"] && <p className="text-sm text-destructive" role="alert">{errors["slot"]}</p>}
            </div>
            <Field id="reason" label="Reason for visit (optional)" error={errors["reason"]}>
              <Textarea id="reason" name="reason" rows={3} maxLength={500} placeholder="A short note is enough — no detailed medical history needed." />
            </Field>
          </fieldset>

          <div className="space-y-5 border-t border-border pt-8">
            <div>
              <div className="flex items-start gap-3">
                <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                <Label htmlFor="consent" className="text-sm font-normal leading-snug">I agree to the <Link to="/privacy" className="text-primary underline">privacy policy</Link> and consent to the clinic contacting me about this appointment.</Label>
              </div>
              {errors["consent"] && <p className="mt-1 text-sm text-destructive" role="alert">{errors["consent"]}</p>}
            </div>
            {status === "error" && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">{submitError}</p>}
            <Button type="submit" size="lg" className="w-full rounded-full" disabled={status === "sending" || isSunday}>
              {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />} Confirm appointment
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
