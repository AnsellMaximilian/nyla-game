"use client";

import React, { ReactNode } from "react";

export default function SetupItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="font-semibold">{label}</div>
      <div>{children}</div>
    </div>
  );
}
