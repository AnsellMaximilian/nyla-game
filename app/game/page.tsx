import GameComponent from "@/components/game/GameComponent";
import GameRenderer from "@/components/game/GameRenderer";
import React from "react";

export default function GamePage() {
  return (
    <div className="container mx-auto p-8 grow flex flex-col">
      <GameComponent />
    </div>
  );
}
