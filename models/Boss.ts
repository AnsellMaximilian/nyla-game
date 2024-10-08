import { BossBaseStats } from "@/const/boss-setup";
import Game from "@/models/Game";
import { Particle } from "@/models/Particle";
import { Projectile } from "@/models/Projectile";
import { BossParams } from "@/type";
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
  maxHealth = BossBaseStats.health;
  currentHealth = BossBaseStats.health;
  particles: Particle[] = [];

  // damage
  wasJustAttacked = false;
  inDmgAnim = false;
  dmgAnimDuration = 300;
  dmgAnimTimer = 0;

  // attack
  attackTimer = 0;
  attackInterval = BossBaseStats.attackSpeed;
  projectiles: Projectile[] = [];
  projectileLimit = BossBaseStats.maxProjectiles;
  projectileLifetime = BossBaseStats.projectileLifetime;
  projectileBounces = false;

  prepareAttackTimer = 0;
  prepareAttackDuration = 500;
  isPreparingAttack = false;

  // backwards
  isBackwards = false;

  static images: { [key: string]: CanvasImageSource } = {};
  constructor(game: Game, bossParams: BossParams) {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.game = game;

    this.speedX = BossBaseStats.speed;

    // setup using boss params
    this.maxHealth = BossBaseStats.health * bossParams.healthBoost;
    this.currentHealth = this.maxHealth;
    this.speedX = BossBaseStats.speed * bossParams.speedBoost;
    this.attackInterval =
      BossBaseStats.attackSpeed / bossParams.attackSpeedBoost;
    this.projectileLifetime = bossParams.projectileLifetime;
    this.projectileLimit = bossParams.maxProjectiles;
    this.projectileBounces = bossParams.projectileBounces;
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

    // attack handling
    if (!this.isPreparingAttack) {
      if (this.attackTimer > this.attackInterval) {
        this.attackTimer = 0;
        this.isPreparingAttack = true;
      } else {
        this.attackTimer += deltaTime;
      }
    } else {
      if (this.prepareAttackTimer > this.prepareAttackDuration) {
        this.prepareAttackTimer = 0;
        this.isPreparingAttack = false;
        if (this.projectiles.length < this.projectileLimit) {
          this.projectiles.push(
            new Projectile(
              this.game,
              this.x + (this.isBackwards ? this.width : 0),
              this.y + 100,
              4 * (this.isBackwards ? -1 : 1),
              -1,
              25,
              this.projectileBounces,
              true,
              this.projectileLifetime
            )
          );
        }
      } else {
        this.prepareAttackTimer += deltaTime;
      }
    }

    // face player
    if (this.x + this.width < this.game.player.x) {
      this.isBackwards = true;
    } else if (this.x > this.game.player.x + this.game.player.width) {
      this.isBackwards = false;
    }

    this.particles.forEach((p, i) => {
      p.update();
      if (p.markedForDeletion) this.particles.splice(i, 1);
    });

    this.projectiles.forEach((p, i) => {
      p.update(deltaTime);
      if (p.markedForDeletion) this.projectiles.splice(i, 1);
    });

    // console.log(this.projectiles);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.game.debug) {
      ctx.strokeStyle = "red";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    } else ctx.strokeStyle = "black";
    if (this.image) {
      if (this.wasJustAttacked) ctx.filter = "brightness(50%)";

      let frameY = this.isPreparingAttack ? 2 : 0;

      if (this.isBackwards) frameY++;

      ctx.drawImage(
        this.image,
        this.frameX * this.width,
        frameY * this.height,
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
  constructor(game: Game, bossParams: BossParams) {
    super(game, bossParams);
    this.width = 256;
    this.height = 256;
    this.x = this.game.width - this.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
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
