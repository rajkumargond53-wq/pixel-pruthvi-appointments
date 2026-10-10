import { Stethoscope, HeartPulse, Baby, Activity, ShieldCheck, ClipboardList, type LucideIcon } from "lucide-react";

// EDITABLE: replace every "[...]" placeholder with the clinic's real details.
export const clinic = {
  name: "Dr. Pruthvi Clinic",
  doctor: "Dr. Pruthvi",
  specialization: "[Medical specialization]",
  address: "[Clinic street address, City, State, PIN]",
  phone: "[+91 00000 00000]",
  email: "[clinic@email.com]",
  hours: [
    { day: "Monday – Saturday", time: "9:30 AM – 12:30 PM · 4:00 PM – 7:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  hoursNote: "Sample hours — please confirm with the clinic.",
};

export type Service = { slug: string; name: string; description: string; details: string; icon: LucideIcon };

// EDITABLE: rename / rewrite to match the clinic's actual services.
export const services: Service[] = [
  { slug: "general", name: "General Consultation", description: "Thorough check-ups and diagnosis for everyday health concerns.", details: "[Duration · Fee]", icon: Stethoscope },
  { slug: "preventive", name: "Preventive Health Check", description: "Screenings and guidance to catch problems early and stay well.", details: "[Duration · Fee]", icon: ShieldCheck },
  { slug: "chronic", name: "Chronic Care", description: "Ongoing support for long-term conditions with clear care plans.", details: "[Duration · Fee]", icon: HeartPulse },
  { slug: "family", name: "Family & Child Health", description: "Gentle, attentive care for patients of every age.", details: "[Duration · Fee]", icon: Baby },
  { slug: "followup", name: "Follow-up Visit", description: "Review progress, test results and adjust treatment.", details: "[Duration · Fee]", icon: ClipboardList },
  { slug: "wellness", name: "Lifestyle & Wellness", description: "Practical advice on nutrition, sleep, activity and stress.", details: "[Duration · Fee]", icon: Activity },
];

// SAMPLE ONLY — replace with genuine, consented patient feedback before launch.
export const testimonials = [
  { name: "Sample Patient A", text: "Placeholder review: describe how the doctor listened carefully and explained every step clearly." },
  { name: "Sample Patient B", text: "Placeholder review: mention the welcoming staff, short waiting time and easy booking." },
  { name: "Sample Patient C", text: "Placeholder review: share how follow-up care made the patient feel supported." },
  { name: "Sample Patient D", text: "Placeholder review: highlight the calm, clean clinic and thoughtful advice." },
];

export const timeSlots = ["09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];

export function formatSlot(s: string) {
  const [h, m] = s.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function pageMeta(title: string, description: string) {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
