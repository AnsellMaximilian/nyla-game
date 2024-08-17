import { loadImage } from "@/utils/common";
import Game from "./Game";
import { InputHandler } from "./InputHandler";
import { Falling, Jumping, Running, Sitting, Slashing, State } from "./State";
import { PlayerState } from "@/const/states";

class Player {
  game: Game;
  height: number;
  width: number;
  x: number;
  y: number;
  vy: number;
  speed: number;
  maxSpeed: number;
  weight: number;
  states: State[];
  currentState: State;

  image: CanvasImageSource | null = null;
  attackImage: CanvasImageSource | null = null;

  // animation
  frameX: number;
  frameY: number;
  maxFrame: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;

  // attack
  isAttacking = false;
  attackDuration = 300;
  attackTimer = 0;
  isAttackOnCooldown = false;
  currentAttackFrame = 0;

  // health
  maxHealth = 1000;
  currentHealth = 1000;

  constructor(game: Game) {
    this.game = game;
    this.width = 128;
    this.height = 128;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speed = 0;
    this.maxSpeed = 5;
    this.vy = 0;
    this.weight = 0.5;

    // state
    this.states = [
      new Sitting(this),
      new Running(this),
      new Jumping(this),
      new Falling(this),
      // new Slashing(this),
    ];

    // animation
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 4;
    this.fps = 5;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;

    // enter state
    this.currentState = this.states[0];
    this.currentState.enter();

    // attack
    // attack duration
    // attack cooldown
  }

  update(keys: string[], deltaTime: number) {
    this.checkCollisons();
    if (this.isAttacking) {
      this.checkAttackCollisons();
    }
    this.currentState.handleInput(keys);
    this.x += this.speed;
    if (keys.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (keys.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;

    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    // attacking
    if (keys.includes("c")) {
      if (!this.isAttackOnCooldown) this.isAttacking = true;
    }

    if (this.attackTimer > this.attackDuration) {
      this.attackTimer = 0;
      if (this.isAttacking) {
        this.isAttacking = false;
        this.isAttackOnCooldown = true;
        this.currentAttackFrame = this.currentAttackFrame === 0 ? 1 : 0;
      } else {
        this.isAttackOnCooldown = false;
      }
    } else {
      this.attackTimer += deltaTime;
    }

    this.y += this.vy;

    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;

    // sprite
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.game.debug) {
      ctx.strokeStyle = "#35fc03";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    } else {
      ctx.strokeStyle = "black";
    }

    if (this.image) {
      ctx.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    if (this.isAttacking && this.attackImage) {
      ctx.drawImage(
        this.attackImage,
        this.currentAttackFrame * 128,
        0,
        128,
        128,
        this.x + 128,
        this.y,
        128,
        128
      );
    }
  }

  async prepareAssets() {
    this.image = await loadImage("/images/nyla-spritesheet.png");
    this.attackImage = await loadImage("/images/slash.png");
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state: PlayerState, speed: number) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  checkCollisons() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        // collision
        if (this.currentHealth - 1 > 0) this.currentHealth--;
      } else {
      }
    });
  }

  checkAttackCollisons() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width + 128 &&
        enemy.x + enemy.width > this.x + 128 &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        // collision
        enemy.markedForDeletion = true;
        this.game.score++;
      } else {
      }
    });
  }
}

export default Player;
