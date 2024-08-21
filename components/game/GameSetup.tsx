"use client";

import React from "react";
import BossSetup from "../game-setup/BossSetup";
import { BossParams } from "@/type";

export default function GameSetup({
  setBossParams,
}: {
  setBossParams: React.Dispatch<React.SetStateAction<BossParams | null>>;
}) {
  return (
    <div className="grow bg-[#001844//] text-whit33e">
      <div className="container mx-auto p-4 ">
        <BossSetup setBossParams={setBossParams} />
      </div>
    </div>
  );
}
