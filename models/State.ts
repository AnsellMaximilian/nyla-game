import { PlayerState } from "@/const/states";
import Player from "./Player";
import { getGameSpeed } from "@/utils/common";

export class State {
  state: PlayerState;
  constructor(state: PlayerState) {
    this.state = state;
  }
  enter() {}

  handleInput(keys: string[]) {}
}

export class Sitting extends State {
  player: Player;
  constructor(player: Player) {
    super(PlayerState.SITTING);
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 6;

    this.player.frameY = 2;
  }

  handleInput(keys: string[]) {
    if (keys.includes("ArrowLeft") || keys.includes("ArrowRight")) {
      this.player.setState(PlayerState.RUNNING, getGameSpeed(keys));
    } else if (keys.includes("ArrowUp")) {
      this.player.setState(PlayerState.JUMPING, getGameSpeed(keys));
    }
  }
}

export class Running extends State {
  player: Player;
  constructor(player: Player) {
    super(PlayerState.RUNNING);
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 4;
    this.player.frameY = 0;
  }

  handleInput(keys: string[]) {
    if (!(keys.includes("ArrowLeft") || keys.includes("ArrowRight"))) {
      this.player.setState(PlayerState.SITTING, 0);
    }
    if (keys.includes("ArrowUp")) {
      this.player.setState(PlayerState.JUMPING, getGameSpeed(keys));
    }

    if (keys.includes("ArrowRight")) this.player.frameY = 0;
    else if (keys.includes("ArrowLeft")) this.player.frameY = 1;
  }
}

export class Jumping extends State {
  player: Player;
  constructor(player: Player) {
    super(PlayerState.JUMPING);
    this.player = player;
  }

  enter() {
    if (this.player.onGround()) this.player.vy -= 25;

    this.player.frameX = 0;
    this.player.maxFrame = 7;
    this.player.frameY = 3;
  }

  handleInput(keys: string[]) {
    if (this.player.vy > this.player.weight) {
      this.player.setState(PlayerState.FALLING, getGameSpeed(keys));
    }
  }
}

export class Falling extends State {
  player: Player;
  constructor(player: Player) {
    super(PlayerState.FALLING);
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    if (this.player.onGround()) this.player.vy -= 30;
    this.player.maxFrame = 7;
    this.player.frameY = 3;
  }

  handleInput(keys: string[]) {
    if (this.player.onGround()) {
      this.player.setState(PlayerState.SITTING, 0);
    }
  }
}
