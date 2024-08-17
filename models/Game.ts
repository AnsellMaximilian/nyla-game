import { loadImage } from "@/utils/common";
import Player from "./Player";
import { InputHandler } from "./InputHandler";
import { Background } from "./Background";
import { Enemy, FlyingEnemy, GroundEnemy } from "./Enemy";

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
  enemies: Enemy[];
  enemyTimer = 0;
  enemyInterval = 1000;

  debug = false;

  // scoring
  score: number;

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

    this.enemies = [];

    this.score = 0;
  }

  update(deltaTime: number) {
    this.background.update();
    this.player.update(this.inputHandler.keys, deltaTime);

    // enemies
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }

    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime);
      if (enemy.markedForDeletion)
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
    });
  }

  draw() {
    this.background.draw(this.context);
    this.player.draw(this.context);

    this.enemies.forEach((enemy) => {
      // console.log(enemy.y);
      enemy.draw(this.context);
    });
  }

  async prepareAssets() {
    await this.player.prepareAssets();
    await this.background.prepareAssets();
    await Enemy.prepareAssets();
  }

  cleanUp() {
    this.inputHandler.cleanUp();
  }

  addEnemy() {
    if (this.speed > 0 && Math.random() < 0.5)
      this.enemies.push(new GroundEnemy(this));
    this.enemies.push(new FlyingEnemy(this));
  }
}

export default Game;
