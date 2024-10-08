"use server";
import NylasLoginButton from "@/components/NylasLoginButton";
import { Button } from "@/components/ui/button";
import { decrypt } from "@/lib/session";
import { SessionProvider } from "next-auth/react";
import { cookies } from "next/headers";
import Image from "next/image";
import { logout } from "./actions/auth";
import Link from "next/link";
import ControlsDialog from "@/components/ControlsDialog";

export default async function Home() {
  const session = await decrypt(cookies().get("session")?.value);

  return (
    <main className="grow flex flex-col items-center justify-center p-24 text-white vic-font text-xl text-center">
      {/* <h1 className="text-6xl font-bold mb-8">NYLA the CAT</h1> */}
      <Image
        src="/images/nyla-logo.png"
        width={320}
        height={154}
        className="w-[400px] mb-8"
        alt="logo"
      />
      {session?.grantRecordId ? (
        <div className="flex flex-col gap-2 text-2xl">
          <Link href="/game" className="hover:scale-105">
            Battle
          </Link>
          <Link href="/nyla" className="hover:scale-105">
            Your Nyla
          </Link>
          <Link href="/friends" className="hover:scale-105">
            Friends
          </Link>
          <ControlsDialog />

          <form action={logout}>
            <button type="submit" className="hover:scale-105">
              Log out
            </button>
          </form>
        </div>
      ) : (
        <NylasLoginButton />
      )}
    </main>
  );
}
