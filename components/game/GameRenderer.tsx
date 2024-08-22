"use client";

import Game from "@/models/Game";
import { BossParams, GameResult } from "@/type";
import { getDefaultBossParams } from "@/utils/boss";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function GameRenderer({
  bossParams,
}: {
  bossParams: BossParams;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  useEffect(() => {
    (async () => {
      if (gameResult) {
        const res = await axios.get("/api/nylas/get-emails");

        console.log(res.data);
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
  return (
    <div className=" grow bg-[#2E3B65] text-white flex items-center justify-center">
      <div className="flex gap-8">
        <canvas ref={canvasRef} className=" border-black border-4"></canvas>
      </div>
    </div>
  );
}
