"use client";
import { useRouter } from "next/navigation";

import React from "react";
import { Button } from "@/components/ui/button";

export default function NylasLoginButton() {
  const router = useRouter();

  const handle = () => {
    const baseUrl = "https://api.eu.nylas.com/v3/connect/auth";
    const clientId = String(process.env.NEXT_PUBLIC_NYLAS_CLIENT_ID);
    const callbackURL = `${String(
      process.env.NEXT_PUBLIC_BASE_URL
    )}/api/nylas/callback`;

    const responseType = "code";
    const provider = "google";
    const accessType = "online";

    const authUrl = `${baseUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      callbackURL
    )}&response_type=${responseType}&provider=${provider}&access_type=${accessType}`;
    3;

    router.push(authUrl);
  };
  return (
    <button className="text-4xl hover:scale-105" onClick={handle}>
      Login
    </button>
  );
}
