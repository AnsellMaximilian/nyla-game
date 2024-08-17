import Game from "./Game";

export class UI {
  game: Game;
  fontSize: number;
  fontFamily: string;
  constructor(game: Game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Helvetica";
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = this.fontSize + "px " + this.fontFamily;
    ctx.textAlign = "left";
    ctx.fillStyle = this.game.fontColor;

    ctx.lineWidth = 5;
    ctx.strokeRect(20, 20, 300, 30);
    ctx.fillStyle = "red";
    ctx.fillRect(
      20,
      20,
      300 * (this.game.player.currentHealth / this.game.player.maxHealth),
      30
    );

    // reset
    ctx.lineWidth = 1;
    ctx.fillStyle = "black";
  }
}
