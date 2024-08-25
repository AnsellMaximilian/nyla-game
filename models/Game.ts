import { getGameSpeed, loadImage } from "@/utils/common";
import Player from "./Player";
import { InputHandler } from "./InputHandler";
import { Background } from "./Background";
import { Enemy, FlyingEnemy, GroundEnemy } from "./Enemy";
import { UI } from "./UI";
import { BossParams, GameResult, PlayerNyla } from "@/type";
import { Boss, EmailBoss } from "./Boss";

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

  // game over
  gameOver = false;

  setGameResult: React.Dispatch<React.SetStateAction<GameResult | null>>;

  constructor(
    width: number,
    height: number,
    context: CanvasRenderingContext2D,
    bossParams: BossParams,
    nyla: PlayerNyla,
    setGameResult: React.Dispatch<React.SetStateAction<GameResult | null>>
  ) {
    this.width = width;
    this.height = height;

    this.groundMargin = 50;

    this.speed = 0;
    this.maxSpeed = 3;

    this.background = new Background(this);

    this.context = context;

    this.inputHandler = new InputHandler(this);

    this.player = new Player(this, nyla);

    this.ui = new UI(this);

    this.enemies = [];

    this.score = 0;

    this.boss = new EmailBoss(this, bossParams);

    this.setGameResult = setGameResult;
  }

  update(deltaTime: number) {
    if (this.player.currentHealth <= 0) {
      this.gameOver = true;
      this.setGameResult({ isWin: false });
    } else if (this.boss.currentHealth <= 0) {
      this.gameOver = true;
      this.setGameResult({ isWin: true });
    }

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
