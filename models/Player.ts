import { loadImage } from "@/utils/common";
import Game from "./Game";
import { Falling, Jumping, Running, Sitting, State } from "./State";
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

  static image: CanvasImageSource | null = null;
  static attackImage: CanvasImageSource | null = null;

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
  hasAttacked = false;

  // health
  maxHealth = 1000;
  currentHealth = 1000;

  isBackwards = false;

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
    // if (keys.length === 1) console.log({ key: keys[0] });
    this.checkCollisons();
    if (this.isAttacking) {
      this.checkAttackCollisons();
    }
    this.currentState.handleInput(keys);
    this.x += this.speed;
    if (keys.includes("ArrowRight")) {
      this.speed = this.maxSpeed;
      this.isBackwards = false;
    } else if (keys.includes("ArrowLeft")) {
      this.speed = -this.maxSpeed;
      this.isBackwards = true;
    } else this.speed = 0;

    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width - 300)
      this.x = this.game.width - this.width - 300;

    // attacking
    if (keys.includes("c") || keys.includes("C")) {
      if (!this.isAttackOnCooldown) {
        this.isAttacking = true;
        // this.tempFrameY = this.frameY;
        // this.frameY = 4;
      }
    }

    if (this.attackTimer > this.attackDuration) {
      this.attackTimer = 0;
      if (this.isAttacking) {
        this.isAttacking = false;
        this.isAttackOnCooldown = true;
        this.currentAttackFrame = this.currentAttackFrame === 0 ? 1 : 0;
        this.hasAttacked = false;
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

      // draw attack hitbox
      ctx.strokeStyle = "blue";
      ctx.strokeRect(
        this.x + (this.isBackwards ? -128 : this.width),
        this.y,
        128,
        128
      );
    } else {
      ctx.strokeStyle = "black";
    }

    if (Player.image) {
      const frameX =
        (this.isAttacking
          ? this.currentAttackFrame + (this.isBackwards ? 2 : 0)
          : this.frameX) * this.width;
      const frameY = (this.isAttacking ? 4 : this.frameY) * this.height;
      ctx.drawImage(
        Player.image,
        frameX,
        frameY,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    if (this.isAttacking && Player.attackImage) {
      ctx.drawImage(
        Player.attackImage,
        this.currentAttackFrame * 128,
        (this.isBackwards ? 1 : 0) * 128,
        128,
        128,
        this.x + (this.isBackwards ? -128 : 128),
        this.y,
        128,
        128
      );
    }
  }

  static async prepareAssets() {
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
    if (
      this.game.boss.x < this.x + this.width &&
      this.game.boss.x + this.game.boss.width > this.x &&
      this.game.boss.y < this.y + this.height &&
      this.game.boss.y + this.game.boss.height > this.y
    ) {
      // collision
      if (this.currentHealth - 1 > 0) this.currentHealth--;
    } else {
    }
  }

  checkAttackCollisons() {
    this.game.enemies.forEach((enemy) => {
      const isEnemyXBeforeAttackHitBoxEnd =
        enemy.x < this.x + (this.isBackwards ? 0 : this.width + 128);
      const isEnemyEndAfterAttackHitBoxX =
        enemy.x + enemy.width > this.x + (this.isBackwards ? -128 : 128);
      if (
        isEnemyXBeforeAttackHitBoxEnd &&
        isEnemyEndAfterAttackHitBoxX &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y &&
        !this.hasAttacked
      ) {
        // collision
        enemy.markedForDeletion = true;
        this.game.score++;
        this.hasAttacked = true;
      } else {
      }
    });

    const isBossXBeforeAttackHitBoxEnd =
      this.game.boss.x < this.x + (this.isBackwards ? 0 : this.width + 128);
    const isBossEndAfterAttackHitBoxX =
      this.game.boss.x + this.game.boss.width >
      this.x + (this.isBackwards ? -128 : 128);

    if (
      isBossXBeforeAttackHitBoxEnd &&
      isBossEndAfterAttackHitBoxX &&
      this.game.boss.y < this.y + this.height &&
      this.game.boss.y + this.game.boss.height > this.y &&
      !this.hasAttacked
    ) {
      // collision
      this.hasAttacked = true;

      if (this.game.boss.currentHealth - 1 > 0)
        this.game.boss.currentHealth -= 20;
    } else {
    }
  }
}

export default Player;
