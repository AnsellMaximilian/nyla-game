import { loadImage } from "@/utils/common";
import Player from "./Player";

class Game {
  width: number;
  height: number;

  player: Player;

  context: CanvasRenderingContext2D;

  private animationFrameId: number | null;

  constructor(
    width: number,
    height: number,
    context: CanvasRenderingContext2D
  ) {
    this.width = width;
    this.height = height;

    this.context = context;

    this.animationFrameId = null;

    this.player = new Player(this);
  }

  update() {
    this.player.update();
  }

  draw() {
    this.player.draw(this.context);
  }

  animate() {
    console.log("ANIMATE START", this);
    if (this) {
      console.log("animate");
      this.update();
      this.draw();
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  }

  stopAnimation() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  async prepareAssets() {
    await this.player.prepareAssets();
  }
}

export default Game;
