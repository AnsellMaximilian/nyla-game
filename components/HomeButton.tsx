import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import React from "react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

export default function HomeButton({ className = "" }) {
  return (
    <Link
      href="/"
      className={cn(
        buttonVariants({ variant: "secondary" }),
        "text-2xl px-8 py-6",
        className
      )}
    >
      <Home />
    </Link>
  );
}
