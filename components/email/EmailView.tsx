"use client";

import { Email } from "@/type";
import { extractStringFromEmailBody } from "@/utils/common";
import React, { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Cat, Mail } from "lucide-react";

export default function EmailView({
  email,
  purrifiedVersion = null,
  isPurrifying = false,
}: {
  email: Email;
  purrifiedVersion?: string | null;
  isPurrifying?: boolean;
}) {
  const [purrifyMode, setPurrifyMode] = useState(!!purrifiedVersion);

  useEffect(() => {
    if (purrifiedVersion) setPurrifyMode(true);
  }, [purrifiedVersion]);
  return (
    <div className="bg-[url('/images/paper-texture-borderless.png')] p-4 rounded-md border-border border">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <div className="font-bold text-3xl">{email.subject}</div>
          <div className="text-2xl">- {email.from[0].name}</div>
        </div>
        <Button
          className="shadow-md border-4 border-primary flex items-center gap-2"
          variant="outline"
          disabled={(!purrifiedVersion && !purrifyMode) || isPurrifying}
          onClick={() => setPurrifyMode((prev) => !prev)}
        >
          {isPurrifying ? (
            "Purrifying..."
          ) : (
            <>
              {purrifyMode ? <Mail /> : <Cat />}{" "}
              <span> {purrifyMode ? "Normal" : "Purrify"}</span>
            </>
          )}
        </Button>
      </header>
      <Separator />
      <div className="mt-8 whitespace-pre-wrap">
        {purrifiedVersion && purrifyMode
          ? purrifiedVersion
          : extractStringFromEmailBody(email.body)}
      </div>
    </div>
  );
}
