"use client";

import Game from "@/models/Game";
import { BossParams, ClientPlayerNyla, GameResult, PlayerNyla } from "@/type";
import { getDefaultBossParams } from "@/utils/boss";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { calculateLevelFromXP, calculateXPForLevel } from "@/utils/leveling";

export default function GameRenderer({
  bossParams,
  nyla,
}: {
  bossParams: BossParams;
  nyla: ClientPlayerNyla;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const [updatedNyla, setUpdatedNyla] = useState<ClientPlayerNyla | null>(null);

  useEffect(() => {
    (async () => {
      if (gameResult) {
        const res = await axios.post("/api/nylas/handle-win");

        const updatedNyla = res.data as ClientPlayerNyla;

        setUpdatedNyla(updatedNyla);
      }
    })();
  }, [gameResult]);

  useLayoutEffect(() => {
    let game: Game;
    let frameId: number;

    (async () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = 1000;
        canvas.height = 500;

        const ctx = canvas.getContext("2d")!;
        await Game.prepareAssets();
        game = new Game(
          canvas.width,
          canvas.height,
          ctx,
          bossParams,
          setGameResult
        );
        // game.animate();
        let lastTime = 0;

        const animate = (timeStamp: number) => {
          const deltaTime = timeStamp - lastTime;
          lastTime = timeStamp;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          game.update(deltaTime);
          game.draw();
          if (!game.gameOver) {
            frameId = requestAnimationFrame(animate);
          }
        };

        animate(0);
      }
    })();

    return () => {
      cancelAnimationFrame(frameId);
      if (game) game.cleanUp();
    };
  }, [canvasRef]);
  console.log(updatedNyla?.xp);
  return (
    <div className=" grow bg-[#2E3B65] text-white flex items-center justify-center">
      <div className="flex gap-8">
        <canvas ref={canvasRef} className=" border-black border-4"></canvas>
      </div>
      <Dialog open={!!gameResult}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="bgxx-[#BCCxxxDFF] text-primxxxary vic-font">
          <DialogHeader>
            <DialogTitle>Congrats!</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div>
              <div>XP Gained</div>
              <div className="border-border border-4 h-4 rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{
                    width: `${
                      ((updatedNyla ? updatedNyla.xp : nyla.xp) /
                        calculateXPForLevel(
                          calculateLevelFromXP(nyla.xp) + 1
                        )) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-sm font-bold">
                {updatedNyla ? updatedNyla.xp : nyla.xp}/
                {calculateXPForLevel(calculateLevelFromXP(nyla.xp) + 1)}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
