import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHero } from "@/components/site-chrome";
import { Field } from "@/components/field";
import { ContactDetails } from "@/components/sections";
import { supabase } from "@/integrations/supabase/client";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: pageMeta("Contact Dr. Pruthvi Clinic — Address, Hours & Enquiries", "Get in touch with Dr. Pruthvi's clinic. Find our address, phone, email and opening hours, or send a message.") }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(20).regex(/^[0-9+\-\s()]*$/, "Enter a valid phone number").optional(),
  subject: z.string().trim().min(2, "Please add a subject").max(150),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the privacy policy" }) }),
});

function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // honeypot
    const parsed = schema.safeParse({ ...Object.fromEntries(fd), consent });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setStatus("sending");
    const d = parsed.data;
    const { error } = await supabase.rpc("submit_contact", { p_name: d.name, p_email: d.email, p_phone: d.phone ?? "", p_subject: d.subject, p_message: d.message });
    setStatus(error ? "error" : "sent");
  }

  return (
    <>
      <PageHero eyebrow="Contact" title="We're here to help" intro="Send a question or find everything you need for your visit." />
      <div className="container-site mt-16 grid gap-14 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-7 shadow-card md:p-10">
          {status === "sent" ? (
            <div className="py-10 text-center" role="status">
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-4 text-2xl text-primary-deep">Message received</h2>
              <p className="mt-2 text-muted-foreground">Thank you — the clinic team will get back to you soon.</p>
              <Button variant="outline" className="mt-6 rounded-full" onClick={() => setStatus("idle")}>Send another</Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <h2 className="text-2xl text-primary-deep">Send a message</h2>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Name" error={errors.name}><Input id="name" name="name" autoComplete="name" /></Field>
                <Field id="email" label="Email" error={errors.email}><Input id="email" name="email" type="email" autoComplete="email" /></Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="phone" label="Phone (optional)" error={errors.phone}><Input id="phone" name="phone" type="tel" autoComplete="tel" /></Field>
                <Field id="subject" label="Subject" error={errors.subject}><Input id="subject" name="subject" /></Field>
              </div>
              <Field id="message" label="Message" error={errors.message}><Textarea id="message" name="message" rows={5} placeholder="Please avoid sharing detailed medical information here." /></Field>
              <div>
                <div className="flex items-start gap-3">
                  <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} />
                  <Label htmlFor="consent" className="text-sm font-normal leading-snug">I agree to the <Link to="/privacy" className="text-primary underline">privacy policy</Link>.</Label>
                </div>
                {errors.consent && <p className="mt-1 text-sm text-destructive">{errors.consent}</p>}
              </div>
              {status === "error" && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">Sorry, your message couldn't be sent. Please try again or call the clinic.</p>}
              <Button type="submit" size="lg" className="w-full rounded-full" disabled={status === "sending"}>
                {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />} Send message
              </Button>
            </form>
          )}
        </div>
        <ContactDetails />
      </div>
    </>
  );
}
