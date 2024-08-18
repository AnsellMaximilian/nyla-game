import Game from "./Game";

export class Particle {
  game: Game;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  markedForDeletion = false;
  constructor(game: Game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.speedX = 0;
    this.speedY = 0;
  }

  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.99;
    if (this.size < 0.5) this.markedForDeletion = true;
  }

  draw(ctx: CanvasRenderingContext2D) {}
}

export class Dust extends Particle {
  color: string;
  constructor(game: Game, x: number, y: number) {
    super(game);
    this.size = Math.random() * 10 + 50;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = "white";
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
  }
}
