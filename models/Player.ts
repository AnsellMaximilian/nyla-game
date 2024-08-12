import Game from "./Game";

class Player {
  game: Game;
  height: number;
  width: number;
  x: number;
  y: number;

  constructor(game: Game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = 100;
  }

  update() {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Player;
