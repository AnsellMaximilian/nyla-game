import { loadImage } from "@/utils/common";
import Game from "./Game";
import { InputHandler } from "./InputHandler";
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
  image: CanvasImageSource | null = null;
  states: State[];
  currentState: State;

  // animation
  frameX: number;
  frameY: number;
  maxFrame: number;

  constructor(game: Game) {
    this.game = game;
    this.width = 32;
    this.height = 32;
    this.x = 0;
    this.y = this.game.height - this.height;
    this.speed = 0;
    this.maxSpeed = 10;
    this.vy = 0;
    this.weight = 0.5;

    // state
    this.states = [
      new Sitting(this),
      new Running(this),
      new Jumping(this),
      new Falling(this),
    ];
    this.currentState = this.states[0];
    this.currentState.enter();

    // animation
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 5;
  }

  update(keys: string[]) {
    this.currentState.handleInput(keys);
    this.x += this.speed;
    if (keys.includes("ArrowRight")) this.speed = this.maxSpeed;
    else if (keys.includes("ArrowLeft")) this.speed = -this.maxSpeed;
    else this.speed = 0;

    if (this.x < 0) this.x = 0;
    if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;

    // jumping
    // if (keys.includes("ArrowUp") && this.onGround()) this.vy -= 20;

    this.y += this.vy;

    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;

    // sprite
    if (this.frameX < this.maxFrame) this.frameX++;
    else this.frameX = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
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
  }

  async prepareAssets() {
    this.image = await loadImage("/images/nyla-spritesheet.png");
  }

  onGround() {
    return this.y >= this.game.height - this.height;
  }

  setState(state: PlayerState) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }
}

export default Player;
