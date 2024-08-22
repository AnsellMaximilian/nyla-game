"use client";

import React, { useEffect, useState } from "react";
import GameRenderer from "./GameRenderer";
import GameSetup from "./GameSetup";
import { BossParams, ClientPlayerNyla, PlayerNyla } from "@/type";
import axios from "axios";

export default function GameComponent() {
  const [bossParams, setBossParams] = useState<null | BossParams>(null);
  const [nyla, setNyla] = useState<ClientPlayerNyla | null>(null);
  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/nylas/get-nyla");

      const nyla = res.data as ClientPlayerNyla;

      setNyla(nyla);
    })();
  }, []);

  return nyla ? (
    <>
      {bossParams ? (
        <GameRenderer bossParams={bossParams} nyla={nyla} />
      ) : (
        <GameSetup setBossParams={setBossParams} />
      )}
    </>
  ) : (
    <div>Loading</div>
  );
}
