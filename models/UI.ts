import { loadImage } from "@/utils/common";
import Game from "./Game";
import { DetailedImage } from "@/type";

export class UI {
  game: Game;
  fontSize: number;
  fontFamily: string;
  static images: { [key: string]: DetailedImage } = {};

  constructor(game: Game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Helvetica";
  }

  draw(ctx: CanvasRenderingContext2D) {
    // ctx.font = this.fontSize + "px " + this.fontFamily;
    // ctx.textAlign = "left";
    // ctx.fillStyle = this.game.fontColor;
    // ctx.fillStyle = "green";
    // ctx.fillRect(
    //   20,
    //   20,
    //   300 * (this.game.player.currentHealth / this.game.player.maxHealth),
    //   30
    // );

    const img = UI.images["heart"];

    for (let i = 0; i < this.game.player.maxHealth; i++) {
      const isHeartFilled = this.game.player.currentHealth >= i + 1;
      ctx.drawImage(
        img.img,
        isHeartFilled ? img.width : 0,
        0,
        img.width,
        img.height,
        20 + i * (img.width + 10),
        20,
        img.width,
        img.height
      );
    }

    // boss health
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.game.width - 300 - 20,
      20,
      300 * (this.game.boss.currentHealth / this.game.boss.maxHealth),
      30
    );
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    // ctx.strokeRect(20, 20, 300, 30);
    ctx.strokeRect(this.game.width - 300 - 20, 20, 300, 30);

    // nyla blast meter
    ctx.fillStyle = "#BCCDFF";
    ctx.fillRect(
      20,
      20 + img.height + 10,
      150 *
        (this.game.player.canNylaBlast
          ? 1
          : this.game.player.nylaBlastTimer / this.game.player.nylaBlastMeter),
      15
    );

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#4067DC";
    ctx.strokeRect(20, 20 + img.height + 10, 150, 15);

    if (this.game.debug) {
      ctx.textAlign = "right";
      ctx.font = this.fontSize - 10 + "px " + this.fontFamily;
      ctx.fillStyle = "black";
      ctx.fillText(
        `${this.game.boss.currentHealth}/${this.game.boss.maxHealth}`,
        this.game.width - 300 - 20 + 100,
        20 + 22
      );
    }

    // game over screen
    if (this.game.gameOver) {
      ctx.textAlign = "center";
      ctx.font = this.fontSize * 2 + "px " + this.fontFamily;
      ctx.fillStyle = "black";
      ctx.fillText(
        "Game Over",
        this.game.width / 2 + 2,
        this.game.height / 2 + 2 - 20
      );

      ctx.fillStyle = "#BCCDFF";
      ctx.fillText("Game Over", this.game.width / 2, this.game.height / 2 - 20);

      // sub text
      ctx.font = this.fontSize * 0.7 + "px " + this.fontFamily;
      ctx.fillStyle = "black";

      ctx.fillText(
        "Good!",
        this.game.width / 2 + 2,
        this.game.height / 2 + 2 + 20
      );

      ctx.fillStyle = "#BCCDFF";
      ctx.fillText("Good!", this.game.width / 2, this.game.height / 2 + 20);
    }

    // reset
    ctx.lineWidth = 1;
    ctx.fillStyle = "black";
  }

  static async prepareAssets() {
    const heartImg = await loadImage("/images/nyla-heart.png");
    this.images["heart"] = {
      img: heartImg,
      width: 32,
      height: 32,
    };
  }
}
