"use client";

import Game from "@/models/Game";
import { GameResult } from "@/type";
import React, { useLayoutEffect, useRef, useState } from "react";

export default function GameRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameResult, setGameResult] = useState<GameResult | null>(null);

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
        game = new Game(canvas.width, canvas.height, ctx, setGameResult);
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
    <div className=" grow bg-[#2E3B65] text-white">
      <div className="flex gap-8">
        <div>{gameResult?.isWin ? "Win" : "Waiting"}</div>
        <canvas ref={canvasRef} className=" border-black border-4"></canvas>
      </div>
    </div>
  );
}
