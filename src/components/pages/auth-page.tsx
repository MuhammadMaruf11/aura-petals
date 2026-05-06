"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMounted } from "@/hooks/use-mounted";
import { usePlatformStore } from "@/store/usePlatformStore";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useMounted();
  const auth = usePlatformStore((state) => state.auth);
  const login = usePlatformStore((state) => state.login);
  const register = usePlatformStore((state) => state.register);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!mounted) {
    return <div className="min-h-[50vh] bg-background" />;
  }

  const isLogin = mode === "login";
  const nextPath = searchParams.get("next");

  const handleSubmit = () => {
    if (!email) return;

    if (isLogin) {
      login(email);
    } else {
      register({
        fullName: fullName || "New Customer",
        email,
        phone,
        address,
      });
    }
    setSubmitted(true);
    router.push(nextPath || "/profile");
  };

  return (
    <div className="bg-background py-16">
      <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[1fr_1.1fr]">
        <Panel
          title={isLogin ? "Customer access" : "Create an account"}
          subtitle="Auth and profile access are included in the storefront requirement."
          badge={isLogin ? "Login" : "Register"}
        >
          <div className="space-y-4">
            {!isLogin ? (
              <label className="space-y-2 text-sm font-medium">
                Full name
                <Input value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-11 rounded-full" />
              </label>
            ) : null}

            <label className="space-y-2 text-sm font-medium">
              Email
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 rounded-full"
              />
            </label>

            {!isLogin ? (
              <>
                <label className="space-y-2 text-sm font-medium">
                  Phone
                  <Input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-11 rounded-full" />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Address
                  <Input value={address} onChange={(event) => setAddress(event.target.value)} className="h-11 rounded-full" />
                </label>
              </>
            ) : null}

            <Button onClick={handleSubmit} className="mt-4 h-11 w-full rounded-full">
              {isLogin ? "Login to profile" : "Register and continue"}
              <ArrowRight />
            </Button>

            <p className="text-sm text-muted-foreground">
              {isLogin ? "Need an account?" : "Already registered?"}{" "}
              <Link href={isLogin ? "/register" : "/login"} className="font-medium text-primary underline-offset-4 hover:underline">
                {isLogin ? "Register here" : "Login here"}
              </Link>
            </p>

            {submitted && auth.isAuthenticated ? (
              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
                Your mock session is active. Visit{" "}
                <Link href="/profile" className="font-semibold text-primary underline-offset-4 hover:underline">
                  profile
                </Link>{" "}
                to manage customer details and order history.
              </div>
            ) : null}
          </div>
        </Panel>

        <div className="space-y-6 rounded-[36px] border border-border/70 bg-card/80 p-8 shadow-sm">
          <SectionHeading
            eyebrow="Profile Scope"
            title="Customer authentication unlocks profile settings and order tracking."
            description="This is a front-end ready flow so the UI can later connect directly to Supabase Auth without redesigning the customer journey."
          />

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Login and registration entry points.",
              "Editable profile information.",
              "Order history tracking.",
              "Shared branding and storefront continuity.",
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-muted/55 p-5 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-4 text-secondary" />
                  <p>{item}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[28px] border border-border/70 bg-background p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                <UserRound className="size-7" />
              </div>
              <div>
                <p className="font-heading text-2xl text-primary">Supabase-ready UI</p>
                <p className="text-sm text-muted-foreground">
                  Replace the mock store actions with real auth endpoints later without changing the page structure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
