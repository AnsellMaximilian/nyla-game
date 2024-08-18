import { getGameSpeed, loadImage } from "@/utils/common";
import Player from "./Player";
import { InputHandler } from "./InputHandler";
import { Background } from "./Background";
import { Enemy, FlyingEnemy, GroundEnemy } from "./Enemy";
import { UI } from "./UI";
import { Boss, EmailBoss } from "@/lib/Boss";

class Game {
  width: number;
  height: number;

  groundMargin: number;

  player: Player;

  ui: UI;

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

  fontColor = "black";

  boss: Boss;

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

    this.ui = new UI(this);

    this.enemies = [];

    this.score = 0;

    this.boss = new EmailBoss(this);
  }

  update(deltaTime: number) {
    this.speed = getGameSpeed(this.inputHandler.keys) * this.maxSpeed;
    this.background.update();
    this.player.update(this.inputHandler.keys, deltaTime);

    // enemies
    // if (this.enemyTimer > this.enemyInterval) {
    //   this.addEnemy();
    //   this.enemyTimer = 0;
    // } else {
    //   this.enemyTimer += deltaTime;
    // }

    // this.enemies.forEach((enemy) => {
    //   enemy.update(deltaTime);
    //   if (enemy.markedForDeletion)
    //     this.enemies.splice(this.enemies.indexOf(enemy), 1);
    // });

    this.boss.update(deltaTime);
  }

  draw() {
    this.background.draw(this.context);

    // this.enemies.forEach((enemy) => {
    //   // console.log(enemy.y);
    //   enemy.draw(this.context);
    // });

    this.boss.draw(this.context);
    this.player.draw(this.context);

    this.ui.draw(this.context);
  }

  static async prepareAssets() {
    await Player.prepareAssets();
    await Background.prepareAssets();
    await Enemy.prepareAssets();
    await Boss.prepareAssets();
    await UI.prepareAssets();
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
