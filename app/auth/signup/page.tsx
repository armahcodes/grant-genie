"use client";

import { SignUp } from "@stackframe/stack";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function SignUpPage() {
  return (
    <TooltipProvider>
      <SignUp />
    </TooltipProvider>
  );
}
