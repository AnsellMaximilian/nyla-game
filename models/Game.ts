import { loadImage } from "@/utils/common";
import Player from "./Player";
import { InputHandler } from "./InputHandler";

class Game {
  width: number;
  height: number;

  player: Player;

  context: CanvasRenderingContext2D;
  inputHandler: InputHandler;

  constructor(
    width: number,
    height: number,
    context: CanvasRenderingContext2D
  ) {
    this.width = width;
    this.height = height;

    this.context = context;

    this.inputHandler = new InputHandler(this);

    this.player = new Player(this);
  }

  update(deltaTime: number) {
    this.player.update(this.inputHandler.keys, deltaTime);
  }

  draw() {
    this.player.draw(this.context);
  }

  async prepareAssets() {
    await this.player.prepareAssets();
  }

  cleanUp() {
    this.inputHandler.cleanUp();
  }
}

export default Game;
