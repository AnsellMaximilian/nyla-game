"use client";

import React, { useEffect, useState } from "react";
import GameRenderer from "./GameRenderer";
import GameSetup from "./GameSetup";
import { BossParams } from "@/type";

export default function GameComponent() {
  const [isGameOn, setIsGameOn] = useState(false);
  const [bossParams, setBossParams] = useState<null | BossParams>(null);

  return (
    <>
      {bossParams ? (
        <GameRenderer bossParams={bossParams} />
      ) : (
        <GameSetup setBossParams={setBossParams} />
      )}
    </>
  );
}
