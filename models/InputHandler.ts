import Game from "./Game";

export class InputHandler {
  game: Game;
  keys: string[];

  constructor(game: Game) {
    this.keys = [];
    this.game = game;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  handleKeyDown(e: KeyboardEvent) {
    const key = e.key;

    if (
      (key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "c" ||
        key === "C" ||
        key === "z" ||
        key === "Z" ||
        key === "x" ||
        key === "X" ||
        key === "Enter") &&
      this.keys.indexOf(e.key) === -1
    ) {
      this.keys.push(key);
    } else if (e.key === "d") this.game.debug = !this.game.debug;
  }

  handleKeyUp(e: KeyboardEvent) {
    const key = e.key;

    if (
      key === "ArrowDown" ||
      key === "ArrowUp" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "c" ||
      key === "C" ||
      key === "z" ||
      key === "Z" ||
      key === "x" ||
      key === "X" ||
      key === "Enter"
    ) {
      this.keys.splice(this.keys.indexOf(key), 1);
    }
  }

  cleanUp() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }
}
