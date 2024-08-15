import { PlayerState } from "@/const/states";
import Player from "./Player";

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
    this.player.maxFrame = 6;

    this.player.frameY = 1;
  }

  handleInput(keys: string[]) {
    if (keys.includes("ArrowLeft") || keys.includes("ArrowRight")) {
      this.player.setState(PlayerState.RUNNING);
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
    this.player.maxFrame = 4;

    this.player.frameY = 0;
  }

  handleInput(keys: string[]) {
    if (keys.includes("ArrowDown")) {
      this.player.setState(PlayerState.SITTING);
    } else if (keys.includes("ArrowUp")) {
      this.player.setState(PlayerState.JUMPING);
    }
  }
}

export class Jumping extends State {
  player: Player;
  constructor(player: Player) {
    super(PlayerState.JUMPING);
    this.player = player;
  }

  enter() {
    if (this.player.onGround()) this.player.vy -= 20;
    this.player.maxFrame = 7;

    this.player.frameY = 2;
  }

  handleInput(keys: string[]) {
    if (this.player.vy > this.player.weight) {
      this.player.setState(PlayerState.FALLING);
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
    if (this.player.onGround()) this.player.vy -= 30;
    this.player.maxFrame = 7;
    this.player.frameY = 2;
  }

  handleInput(keys: string[]) {
    if (this.player.onGround()) {
      this.player.setState(PlayerState.RUNNING);
    }
  }
}
