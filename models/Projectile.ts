import Game from "./Game";

export class Projectile {
  game: Game;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  markedForDeletion = false;
  bounces = false;

  //timed
  timed = true;
  maxLifetime = 5000;
  lifetimeTimer = 0;
  constructor(
    game: Game,
    x: number,
    y: number,
    speedX: number,
    speedY: number,
    size: number,
    bounces: boolean,
    timed: boolean,
    maxLifetime: number = 5000
  ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = "black";
    this.bounces = bounces;
    this.timed = timed;
    this.maxLifetime = maxLifetime;
  }

  update(deltaTime: number) {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    // this.size *= 0.99;
    // if (this.size < 0.5) this.markedForDeletion = true;

    if (this.bounces) {
      if (this.x - this.size < 0) {
        this.speedX = -Math.abs(this.speedX);
      } else if (this.x + this.size > this.game.width) {
        this.speedX = Math.abs(this.speedX);
      }

      if (this.y - this.size < 0) {
        this.speedY = -Math.abs(this.speedY);
      } else if (
        this.y + this.size >
        this.game.height - this.game.groundMargin
      ) {
        this.speedY = Math.abs(this.speedY);
      }
    }

    // if timed
    if (this.timed) {
      this.lifetimeTimer += deltaTime;
      if (this.lifetimeTimer > this.maxLifetime) this.markedForDeletion = true;
    }

    // check if projectile is outside of game boundaries.
    if (this.x + this.size < 0 || this.y + this.size < 0)
      this.markedForDeletion = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "lightgray";
    ctx.stroke();

    ctx.lineWidth = 1;

    if (this.game.debug) {
      ctx.strokeStyle = "red";
      ctx.strokeRect(
        this.x - this.size,
        this.y - this.size,
        this.size * 2,
        this.size * 2
      );
    }
  }
}
