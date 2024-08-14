"use client";

import Game from "@/models/Game";
import React, { useEffect, useLayoutEffect, useRef } from "react";

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    let game: Game;
    let frameId: number;

    (async () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = 500;
        canvas.height = 500;

        const ctx = canvas.getContext("2d")!;

        game = new Game(canvas.width, canvas.height, ctx);
        await game.prepareAssets();
        // game.animate();

        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          game.update();
          game.draw();
          frameId = requestAnimationFrame(animate);
        };

        animate();
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
