import { Gift, Heart, Package, ShieldCheck } from "lucide-react";

const reasons = [
  {
    icon: Heart,
    title: "Handmade with care",
    description:
      "Every piece is shaped, glazed, and finished by hand in small batches.",
  },
  {
    icon: Gift,
    title: "Made to be personal",
    description:
      "Add names, dates, and messages to turn a piece into a keepsake.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description:
      "Your payment details are encrypted and never stored on our servers.",
  },
  {
    icon: Package,
    title: "Thoughtful packaging",
    description: "Gift-ready boxes and padding so everything arrives intact.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-sand py-16">
      <div className="container-boutique">
        <h2 className="mb-10 text-center font-heading text-3xl">
          Why Aura &amp; Petals
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-card text-primary">
                <reason.icon className="size-6" />
              </div>
              <h3 className="mb-1 font-heading text-lg">{reason.title}</h3>
              <p className="text-sm text-muted-foreground">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Priya M.",
    quote:
      "The custom clay frame was even better than I imagined. It felt truly made for us, not off a shelf.",
  },
  {
    name: "Daniel R.",
    quote:
      "Ordered a gift box for my mom's birthday — the packaging alone made it feel special before she even opened it.",
  },
  {
    name: "Sarah K.",
    quote:
      "Fast shipping, gorgeous quality, and the personalization option made it the most thoughtful gift I've given.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-sand py-16">
      <div className="container-boutique">
        <h2 className="mb-10 text-center font-heading text-3xl">
          Loved by our customers
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-border/70 bg-card p-6"
            >
              <blockquote className="text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-muted-foreground">
                — {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
