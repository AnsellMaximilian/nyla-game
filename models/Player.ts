import { loadImage } from "@/utils/common";
import Game from "./Game";
import { Falling, Jumping, Running, Sitting, State } from "./State";
import { PlayerState } from "@/const/states";
import { Dust } from "./Particle";
import { PLAYER_BASE_STATS } from "@/const/player";
import { PlayerNyla, Trinket } from "@/type";
import { getBoostedStat, getBoostStatFromTrinket } from "@/utils/player";
import { TRINKETS } from "@/const/trinkets";

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
  static nylaBlastImage: CanvasImageSource | null = null;

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
  damage = PLAYER_BASE_STATS.ATTACK;

  // health
  maxHealth = PLAYER_BASE_STATS.HEALTH;
  currentHealth = this.maxHealth;

  // damage. Properties that control player's behaviour when taking damage
  damageCooldownTimer = 0;
  damageCooldownDuration = 2000;
  isInDamageCooldown = false;
  damageCooldownBlink = false;

  isBackwards = false;

  // dash
  dashTimer = 0;
  dashCooldownTimer = 0;
  dashDuration = 200;
  dashCooldownDuration = PLAYER_BASE_STATS.DASH_COOLDOWN;
  isInDash = false;
  isDashInCooldown = false;
  hasDashed = false;
  dashFrame = 0;

  // nyla blast
  nylaBlastTimer = 0;
  nylaBlastMeter = PLAYER_BASE_STATS.NYLA_BLAST_METER;
  nylaBlastDamage = PLAYER_BASE_STATS.NYLA_BLAST;
  nylaBlastFrame: 0 | 1 = 0;
  isNylaBlasting = false;
  canNylaBlast = false;
  nylaBlastDuration = 2000;
  nylaBlastWidth = 400;
  nylaBlastHeight = 64;
  canNylaBlastDamage = true;
  nylaBlastPulseInterval = 100;
  nylaBlastPulseTimer = 0;
  nylaTimerPassedMeterFirstTime = false;

  constructor(game: Game, nyla: PlayerNyla) {
    this.game = game;
    this.width = 128;
    this.height = 128;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speed = 0;
    this.maxSpeed = getBoostedStat("SPEED", nyla.upgrades);
    this.vy = 0;
    this.weight = 0.5;
    this.damage = getBoostedStat("ATTACK", nyla.upgrades);

    const maxHearts = getBoostedStat("HEALTH", nyla.upgrades);
    this.maxHealth = maxHearts;
    this.currentHealth = maxHearts;

    // handle trinket
    const playerTrinket = TRINKETS.find((t) => t.id === nyla.equipped_trinket);

    if (playerTrinket) {
      this.damage += getBoostStatFromTrinket(playerTrinket, "ATTACK");
      this.maxSpeed += getBoostStatFromTrinket(playerTrinket, "SPEED");
      const addedHearts = getBoostStatFromTrinket(playerTrinket, "HEALTH");
      this.maxHealth += addedHearts;
      this.currentHealth = this.maxHealth;

      this.nylaBlastDamage += getBoostStatFromTrinket(
        playerTrinket,
        "NYLA_BLAST"
      );
      this.dashCooldownDuration += getBoostStatFromTrinket(
        playerTrinket,
        "DASH_COOLDOWN"
      );
      this.nylaBlastMeter += getBoostStatFromTrinket(
        playerTrinket,
        "NYLA_BLAST_METER"
      );
    }

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

    console.log({
      speed: this.maxSpeed,
      health: this.maxHealth,
      attack: this.damage,
      nylaBlastDmg: this.nylaBlastDamage,
      nylaMeter: this.nylaBlastMeter,
      dashCooldown: this.dashCooldownDuration,
    });
  }

  update(keys: string[], deltaTime: number) {
    this.checkCollisons();
    if (this.isAttacking) {
      this.checkAttackCollisons();
    }

    if (this.isNylaBlasting) {
      this.checkBlastCollison();
    }
    this.currentState.handleInput(keys);
    this.x += this.speed * (this.isInDash ? 20 : 1);
    if (keys.includes("ArrowRight")) {
      this.speed = this.maxSpeed;
      this.isBackwards = false;
    } else if (keys.includes("ArrowLeft")) {
      this.speed = -this.maxSpeed;
      this.isBackwards = true;
    } else this.speed = 0;

    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    // attacking
    if (keys.includes("c") || keys.includes("C")) {
      if (!this.isAttackOnCooldown) {
        this.isAttacking = true;
      }
    }

    // dash
    if (keys.includes("z") || keys.includes("Z")) {
      if (!this.isDashInCooldown && !this.isInDash) {
        this.isInDash = true;
      }
    }

    // nyla blast
    if (keys.includes("x") || keys.includes("X")) {
      if (this.canNylaBlast) {
        this.isNylaBlasting = true;
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

    if (this.damageCooldownTimer > this.damageCooldownDuration) {
      this.damageCooldownTimer = 0;
      if (this.isInDamageCooldown) {
        this.isInDamageCooldown = false;
        this.damageCooldownBlink = false;
      }
    } else {
      this.damageCooldownTimer += deltaTime;
    }

    // dash
    if (this.isInDash) {
      if (this.dashTimer > this.dashDuration) {
        this.dashTimer = 0;
        this.isInDash = false;
        this.isDashInCooldown = true;
        this.hasDashed = false;
      } else {
        this.dashTimer += deltaTime;
      }
    }

    if (this.isDashInCooldown) {
      if (this.dashCooldownTimer > this.dashCooldownDuration) {
        this.dashCooldownTimer = 0;
        this.isDashInCooldown = false;
      } else {
        this.dashCooldownTimer += deltaTime;
      }
    }

    // nyla blast
    if (!this.canNylaBlast) {
      if (this.nylaBlastTimer > this.nylaBlastMeter) {
        this.nylaBlastTimer = 0;
        this.canNylaBlast = true;
      } else if (deltaTime < this.nylaBlastMeter) {
        this.nylaBlastTimer += deltaTime;
      }
    }

    if (this.isNylaBlasting) {
      if (this.nylaBlastTimer > this.nylaBlastDuration) {
        this.nylaBlastTimer = 0;
        this.canNylaBlast = false;
        this.isNylaBlasting = false;
      } else {
        this.nylaBlastTimer += deltaTime;
      }

      if (this.nylaBlastPulseTimer > this.nylaBlastPulseInterval) {
        this.nylaBlastPulseTimer = 0;

        if (!this.canNylaBlastDamage) {
          this.canNylaBlastDamage = true;
        }
      } else {
        this.nylaBlastPulseTimer += deltaTime;
      }
    } else {
      this.canNylaBlastDamage = true;
    }

    this.y += this.vy;

    if (!this.onGround()) {
      this.vy += this.weight;
    } else this.vy = 0;

    // sprite
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;

      // cooldown
      if (this.isInDamageCooldown)
        this.damageCooldownBlink = !this.damageCooldownBlink;

      if (this.isInDash) this.dashFrame = this.dashFrame === 0 ? 1 : 0;

      if (this.isNylaBlasting)
        this.nylaBlastFrame = this.nylaBlastFrame === 0 ? 1 : 0;
    } else {
      this.frameTimer += deltaTime;
    }
    // if (this.vy != 0) console.log({ vy: this.vy, y: this.y });
    // console.log(this.nylaBlastTimer);
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

      // draw nyla blast hitbox

      if (this.isNylaBlasting) {
        ctx.strokeRect(
          this.x + (this.isBackwards ? -this.nylaBlastWidth : this.width),
          this.y,
          this.nylaBlastWidth,
          this.nylaBlastHeight
        );
      }
    } else {
      ctx.strokeStyle = "black";
    }

    if (Player.image && !this.damageCooldownBlink) {
      let frameX =
        (this.isAttacking
          ? this.currentAttackFrame + (this.isBackwards ? 2 : 0)
          : this.frameX) * this.width;
      let frameY = (this.isAttacking ? 4 : this.frameY) * this.height;

      if (this.isInDash) {
        frameY = (this.isBackwards ? 7 : 6) * this.height;
        frameX = this.dashFrame * this.width;
      }

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

    if (this.isNylaBlasting && Player.nylaBlastImage) {
      ctx.drawImage(
        Player.nylaBlastImage,
        this.nylaBlastFrame * this.nylaBlastWidth,
        (this.isBackwards ? 1 : 0) * this.nylaBlastHeight,
        this.nylaBlastWidth,
        this.nylaBlastHeight,
        this.x + (this.isBackwards ? -this.nylaBlastWidth : this.width),
        this.y,
        this.nylaBlastWidth,
        this.nylaBlastHeight
      );
    }
  }

  static async prepareAssets() {
    this.image = await loadImage("/images/nyla-spritesheet.png");
    this.attackImage = await loadImage("/images/slash.png");
    this.nylaBlastImage = await loadImage("/images/nyla-blast.png");
  }

  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  setState(state: PlayerState, speed: number) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter(this.isBackwards);
  }

  checkCollisons() {
    // this.game.enemies.forEach((enemy) => {
    //   if (
    //     enemy.x < this.x + this.width &&
    //     enemy.x + enemy.width > this.x &&
    //     enemy.y < this.y + this.height &&
    //     enemy.y + enemy.height > this.y
    //   ) {
    //     // collision
    //     if (this.currentHealth - 1 > 0) this.currentHealth--;
    //   } else {
    //   }
    // });
    if (
      this.game.boss.x < this.x + this.width &&
      this.game.boss.x + this.game.boss.width > this.x &&
      this.game.boss.y < this.y + this.height &&
      this.game.boss.y + this.game.boss.height > this.y
    ) {
      // collision
      if (this.currentHealth - 1 >= 0 && !this.isInDamageCooldown)
        this.currentHealth--;
      this.isInDamageCooldown = true;
    }

    // boss projectiles
    this.game.boss.projectiles.forEach((p) => {
      if (
        p.x - p.size < this.x + this.width &&
        p.x + p.size * 2 > this.x &&
        p.y - p.size < this.y + this.height &&
        p.y + p.size * 2 > this.y
      ) {
        // collision
        if (this.currentHealth - 1 >= 0 && !this.isInDamageCooldown)
          this.currentHealth--;
        this.isInDamageCooldown = true;
      }
    });
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
      this.game.boss.wasJustAttacked = true;

      if (this.game.boss.currentHealth - 1 > 0) {
        this.game.boss.currentHealth -= this.damage;
      } else {
        this.game.boss.currentHealth = 0;
      }
      for (let i = 0; i < 10; i++) {
        this.game.boss.particles.push(
          new Dust(
            this.game,
            this.game.boss.x + this.game.boss.width / 2,
            this.game.boss.y + this.game.boss.height / 2
          )
        );
      }
    }
  }

  checkBlastCollison() {
    // NYLA BLAST
    const isBossXBeforeBlastHitBoxEnd =
      this.game.boss.x <
      this.x + (this.isBackwards ? 0 : this.width + this.nylaBlastWidth);
    const isBossEndAfterBlastHitBoxX =
      this.game.boss.x + this.game.boss.width >
      this.x + (this.isBackwards ? -this.nylaBlastWidth : this.width);

    if (
      isBossXBeforeBlastHitBoxEnd &&
      isBossEndAfterBlastHitBoxX &&
      this.game.boss.y < this.y + this.height &&
      this.game.boss.y + this.game.boss.height > this.y &&
      this.isNylaBlasting &&
      this.canNylaBlastDamage
    ) {
      // collision
      this.game.boss.wasJustAttacked = true;
      this.canNylaBlastDamage = false;

      if (this.game.boss.currentHealth - this.nylaBlastDamage > 0) {
        console.log("DAMAGING BOSS", this.nylaBlastDamage);
        this.game.boss.currentHealth -= this.nylaBlastDamage;
      } else {
        this.game.boss.currentHealth = 0;
      }
      for (let i = 0; i < 1; i++) {
        this.game.boss.particles.push(
          new Dust(
            this.game,
            this.game.boss.x + this.game.boss.width / 2,
            this.game.boss.y + this.game.boss.height / 2
          )
        );
      }
    }
  }
}

export default Player;
