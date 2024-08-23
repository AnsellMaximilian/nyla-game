"use client";

import { Email } from "@/type";
import { extractStringFromEmailBody } from "@/utils/common";
import React from "react";
import { Separator } from "../ui/separator";

export default function EmailView({ email }: { email: Email }) {
  return (
    <div className="bg-[url('/images/paper-texture-borderless.png')] p-4 rounded-md border-border border">
      <header className="mb-8">
        <div className="font-bold text-3xl">{email.subject}</div>
        <div className="text-2xl">- {email.from[0].name}</div>
      </header>
      <Separator />
      <div className="mt-8 whitespace-pre-wrap">
        {extractStringFromEmailBody(email.body)}
      </div>
    </div>
  );
}
