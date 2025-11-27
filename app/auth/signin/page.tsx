"use client";

import { SignIn } from "@stackframe/stack";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function SignInPage() {
  return (
    <TooltipProvider>
      <SignIn />
    </TooltipProvider>
  );
}
