import { redirect } from "next/navigation";

// Consolidated into /beta/onboarding (the core value screen).
export default function BetaWelcomeRedirect() {
  redirect("/beta/onboarding");
}
