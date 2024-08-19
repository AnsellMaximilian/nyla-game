import Game from "@/models/Game";
import { Particle } from "@/models/Particle";
import { Projectile } from "@/models/Projectile";
import { loadImage } from "@/utils/common";

export class Boss {
  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  game: Game;
  width: number = 0;
  height: number = 0;
  x = 0;
  y = 0;
  speedX = 0;
  speedY = 0;
  maxFrame = 3;
  markedForDeletion = false;
  image: CanvasImageSource | null = null;
  maxHealth = 1000;
  currentHealth = 1000;
  particles: Particle[] = [];

  // damage
  wasJustAttacked = false;
  inDmgAnim = false;
  dmgAnimDuration = 300;
  dmgAnimTimer = 0;

  // attack
  attackTimer = 0;
  attackInterval = 5000;
  projectiles: Projectile[] = [];
  projectileLimit = 2;

  static images: { [key: string]: CanvasImageSource } = {};
  constructor(game: Game) {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.game = game;
  }

  update(deltaTime: number) {
    // console.log("BOSS SPEED: " + this.speedX);
    this.x -= this.speedX + this.game.speed;
    this.y += this.speedY;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    // if (this.x + this.width < 0) this.markedForDeletion = true;
    if (this.x < 0) this.speedX = -Math.abs(this.speedX);
    else if (this.x + this.width > this.game.width)
      this.speedX = Math.abs(this.speedX);

    // dmg animation
    if (this.dmgAnimTimer > this.dmgAnimDuration) {
      this.dmgAnimTimer = 0;
      if (this.wasJustAttacked) {
        this.wasJustAttacked = false;
      }
    } else {
      this.dmgAnimTimer += deltaTime;
    }

    if (
      this.attackTimer > this.attackInterval &&
      this.projectiles.length < this.projectileLimit
    ) {
      this.attackTimer = 0;
      this.projectiles.push(
        new Projectile(this.game, this.x, this.y + 100, 4, -1, 25, false, false)
      );
    } else {
      this.attackTimer += deltaTime;
    }

    this.particles.forEach((p, i) => {
      p.update();
      if (p.markedForDeletion) this.particles.splice(i, 1);
    });

    this.projectiles.forEach((p, i) => {
      p.update(deltaTime);
      if (p.markedForDeletion) this.projectiles.splice(i, 1);
    });

    console.log(this.projectiles);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.game.debug) {
      ctx.strokeStyle = "red";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    } else ctx.strokeStyle = "black";
    if (this.image) {
      if (this.wasJustAttacked) ctx.filter = "brightness(50%)";
      ctx.drawImage(
        this.image,
        this.frameX * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );

      ctx.filter = "none";
    }
    this.particles.forEach((p) => {
      p.draw(ctx);
    });

    this.projectiles.forEach((p) => {
      p.draw(ctx);
    });
  }

  static async prepareAssets() {
    const emailBoss = await loadImage("/images/email-boss.png");

    this.images["emailBoss"] = emailBoss;
  }

  static getImages() {
    return this.images;
  }
}
export class EmailBoss extends Boss {
  constructor(game: Game) {
    super(game);
    this.width = 256;
    this.height = 256;
    this.x = this.game.width - this.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = 1;
    this.speedY = 0;
    this.maxFrame = 2;
    this.image = Boss.getImages()["emailBoss"];
  }

  update(deltaTime: number): void {
    super.update(deltaTime);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
  }
}
