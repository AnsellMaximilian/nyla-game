import Game from "@/models/Game";
import { loadImage } from "@/utils/common";

export class Boss {
  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  game: Game;
  width: number = 0;
  height: number = 0;
  x = 0;
  y = 0;
  speedX = 0;
  speedY = 0;
  maxFrame = 3;
  markedForDeletion = false;
  image: CanvasImageSource | null = null;

  static images: { [key: string]: CanvasImageSource } = {};
  constructor(game: Game) {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.game = game;
  }

  update(deltaTime: number) {
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    // if (this.x + this.width < 0) this.markedForDeletion = true;
    if (this.x + this.width < 0 || this.x + this.width > this.game.width)
      this.speedX = -this.speedX;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.game.debug) {
      ctx.strokeStyle = "red";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    } else ctx.strokeStyle = "black";
    if (this.image) {
      ctx.drawImage(
        this.image,
        this.frameX * this.width,
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

  static async prepareAssets() {
    const emailBoss = await loadImage("/images/email-boss.png");
    console.log(emailBoss);

    this.images["emailBoss"] = emailBoss;
  }

  static getImages() {
    return this.images;
  }
}
export class EmailBoss extends Boss {
  constructor(game: Game) {
    super(game);
    this.width = 256;
    this.height = 256;
    this.x = this.game.width - this.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = 1;
    this.speedY = 0;
    this.maxFrame = 2;
    this.image = Boss.getImages()["emailBoss"];
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
  }
}
