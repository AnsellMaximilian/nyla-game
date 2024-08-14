"use server";
import NylasLoginButton from "@/components/NylasLoginButton";
import { Button } from "@/components/ui/button";
import { decrypt } from "@/lib/session";
import { SessionProvider } from "next-auth/react";
import { cookies } from "next/headers";
import Image from "next/image";
import { logout } from "./actions/auth";

export default async function Home() {
  const session = await decrypt(cookies().get("session")?.value);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session?.userId ? (
        <form action={logout}>
          You are logged in
          <button type="submit">Log out</button>
        </form>
      ) : (
        <NylasLoginButton />
      )}
    </main>
  );
}
