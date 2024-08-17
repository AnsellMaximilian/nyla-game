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

    ctx.fillText("Health: " + this.game.player.currentHealth, 20, 50);
  }
}
