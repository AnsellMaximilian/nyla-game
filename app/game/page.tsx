"use client";

import Game from "@/models/Game";
import React, { useLayoutEffect, useRef } from "react";

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    let game: Game;
    let frameId: number;

    (async () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = 1000;
        canvas.height = 500;

        const ctx = canvas.getContext("2d")!;

        game = new Game(canvas.width, canvas.height, ctx);
        await game.prepareAssets();
        // game.animate();
        let lastTime = 0;

        const animate = (timeStamp: number) => {
          const deltaTime = timeStamp - lastTime;
          lastTime = timeStamp;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          game.update(deltaTime);
          game.draw();
          frameId = requestAnimationFrame(animate);
        };

        animate(0);
      }
    })();

    return () => {
      cancelAnimationFrame(frameId);
      game.cleanUp();
    };
  }, [canvasRef]);
  return (
    <div>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 border-black border-4"
      ></canvas>
    </div>
  );
}
