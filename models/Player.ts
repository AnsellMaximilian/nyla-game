import { loadImage } from "@/utils/common";
import Game from "./Game";
import { InputHandler } from "./InputHandler";

class Player {
  game: Game;
  height: number;
  width: number;
  x: number;
  y: number;
  vy: number;
  speed: number;
  maxSpeed: number;
  weight: number;
  image: CanvasImageSource | null = null;

  constructor(game: Game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height;
    this.speed = 0;
    this.maxSpeed = 10;
    this.vy = 0;
    this.weight = 0.5;
  }

  update(keys: string[]) {
    this.x += this.speed;
    if (keys.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (keys.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;

    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    if (keys.includes("ArrowUp") && this.onGround()) this.vy -= 20;

    this.y += this.vy;

    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;
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

  onGround() {
    return this.y >= this.game.height - this.height;
  }
}

export default Player;
