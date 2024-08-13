"use client";
import { useRouter } from "next/navigation";

import React from "react";
import { Button } from "@/components/ui/button";

export default function NylasLoginButton() {
  const router = useRouter();

  const handle = () => {
    const baseUrl = "api.us.nylas.com/v3/connect/auth";
    const clientId = String(process.env.NEXT_PUBLIC_NYLAS_CLIENT_ID);
    const callbackURL = "http://localhost:3000/api/nylas/callback";

    const responseType = "code";
    const provider = "google";
    const accessType = "offline";

    const authUrl = `${baseUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      callbackURL
    )}&response_type=${responseType}&provider=${provider}&access_type=${accessType}`;
    3;

    router.push(authUrl);
  };
  return <Button onClick={handle}>Login</Button>;
}
