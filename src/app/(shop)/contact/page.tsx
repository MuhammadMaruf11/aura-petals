import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/features/contact/contact-form";
import { getStoreSettings } from "@/server/services/admin-settings.service";

export const metadata: Metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const settings = await getStoreSettings();

  return (
    <div className="container-boutique py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-3xl">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">
          Questions about an order, a custom piece, or anything else — we&apos;d love to hear
          from you. We usually reply within a day.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          {settings.storeEmail && (
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{settings.storeEmail}</p>
              </div>
            </div>
          )}
          {settings.storePhone && (
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{settings.storePhone}</p>
              </div>
            </div>
          )}
          {settings.storeAddress && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{settings.storeAddress}</p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-6 lg:col-span-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
