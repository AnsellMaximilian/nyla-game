"use client";

import LoginButton from "@/components/LoginButton";
import NylasLoginButton from "@/components/NylasLoginButton";
import { Button } from "@/components/ui/button";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  return (
    <SessionProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <NylasLoginButton />
      </main>
    </SessionProvider>
  );
}
