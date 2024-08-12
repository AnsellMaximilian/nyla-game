"use client";

import Game from "@/models/Game";
import React, { useEffect, useRef } from "react";

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let game: Game | null;
    (async () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = 500;
        canvas.height = 500;

        const ctx = canvas.getContext("2d")!;

        game = new Game(canvas.width, canvas.height, ctx);
        await game.prepareAssets();
        game.animate();
      }
    })();

    return () => {
      if (game) game.stopAnimation();
    };
  }, [canvasRef.current]);
  return (
    <div>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 border-black border-4"
      ></canvas>
    </div>
  );
}
