import { loadImage } from "@/utils/common";
import Player from "./Player";
import { InputHandler } from "./InputHandler";
import { Background } from "./Background";

class Game {
  width: number;
  height: number;

  groundMargin: number;

  player: Player;

  context: CanvasRenderingContext2D;
  inputHandler: InputHandler;

  background: Background;

  speed: number;
  maxSpeed: number;

  constructor(
    width: number,
    height: number,
    context: CanvasRenderingContext2D
  ) {
    this.width = width;
    this.height = height;

    this.groundMargin = 50;

    this.speed = 0;
    this.maxSpeed = 3;

    this.background = new Background(this);

    this.context = context;

    this.inputHandler = new InputHandler(this);

    this.player = new Player(this);
  }

  update(deltaTime: number) {
    this.background.update();
    this.player.update(this.inputHandler.keys, deltaTime);
  }

  draw() {
    this.background.draw(this.context);
    this.player.draw(this.context);
  }

  async prepareAssets() {
    await this.player.prepareAssets();
    await this.background.prepareAssets();
  }

  cleanUp() {
    this.inputHandler.cleanUp();
  }
}

export default Game;
