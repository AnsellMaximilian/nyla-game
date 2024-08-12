import Player from "./Player";

class Game {
  width: number;
  height: number;

  player: Player;

  context: CanvasRenderingContext2D;

  private animationFrameId: number | null;

  constructor(
    width: number,
    height: number,
    context: CanvasRenderingContext2D
  ) {
    this.width = width;
    this.height = height;

    this.context = context;

    this.animationFrameId = null;

    this.player = new Player(this);
  }

  update() {}

  draw() {
    this.player.draw(this.context);
  }

  animate() {
    if (this) {
      this.draw();
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  }

  stopAnimation() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }
}

export default Game;
