import { loadImage } from "@/utils/common";
import Game from "./Game";

class Player {
  game: Game;
  height: number;
  width: number;
  x: number;
  y: number;
  image: CanvasImageSource | null = null;

  constructor(game: Game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height;
  }

  update() {
    this.x++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.image) {
      ctx.drawImage(
        this.image,
        0,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  async prepareAssets() {
    this.image = await loadImage("/images/testsprite.png");
  }
}

export default Player;
