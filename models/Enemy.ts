import { loadImage } from "@/utils/common";
import Game from "./Game";

export class Enemy {
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
  maxFrame = 5;
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

    if (this.x + this.width < 0) this.markedForDeletion = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.game.debug)
      ctx.strokeRect(this.x, this.y, this.width, this.height);
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
    const fly = await loadImage("/images/test/enemy_fly.png");
    const plant = await loadImage("/images/test/enemy_plant.png");

    this.images["fly"] = fly;
    this.images["plant"] = plant;
  }

  static getImages() {
    return this.images;
  }
}

export class FlyingEnemy extends Enemy {
  angle = 0;
  va = 0;
  constructor(game: Game) {
    super(game);
    this.width = 60;
    this.height = 44;
    this.x = this.game.width + Math.random() * this.game.width * 0.5;
    this.y = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() + 1;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = Enemy.getImages()["fly"];
    this.va = Math.random() * 0.1 + 0.1;
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
    this.angle += this.va;
    this.y += Math.sin(this.angle);
    // console.log({ angle: this.angle, y: this.y });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
  }
}

export class GroundEnemy extends Enemy {
  constructor(game: Game) {
    super(game);
    this.width = 60;
    this.height = 67;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = Enemy.getImages()["plant"];
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 1;
  }
}

export class ClimbingEnemy extends Enemy {
  constructor(game: Game) {
    super(game);
  }
  draw(): void {}
}
