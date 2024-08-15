import { loadImage } from "@/utils/common";
import Game from "./Game";

export class Layer {
  game: Game;
  width: number;
  height: number;
  speedModifier: number;
  image: CanvasImageSource;

  x: number;
  y: number;

  constructor(
    game: Game,
    width: number,
    height: number,
    speedModifier: number,
    image: CanvasImageSource
  ) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image = image;
    this.x = 0;
    this.y = 0;
  }

  update() {
    if (this.x < -this.width) this.x = 0;
    else this.x -= this.game.speed * this.speedModifier;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

export class Background {
  game: Game;
  width: number;
  height: number;
  layer1Image: CanvasImageSource | null = null;
  layer2Image: CanvasImageSource | null = null;
  layer3Image: CanvasImageSource | null = null;
  layer4Image: CanvasImageSource | null = null;
  layer5Image: CanvasImageSource | null = null;
  layer1: Layer | null = null;
  layer2: Layer | null = null;
  layer3: Layer | null = null;
  layer4: Layer | null = null;
  layer5: Layer | null = null;
  backgroundLayers: Layer[] = [];

  constructor(game: Game) {
    this.game = game;
    this.width = 1667;
    this.height = 500;
  }

  async prepareAssets() {
    this.layer1Image = await loadImage("/images/layer-1.png");
    this.layer2Image = await loadImage("/images/layer-2.png");
    this.layer3Image = await loadImage("/images/layer-3.png");
    this.layer4Image = await loadImage("/images/layer-4.png");
    this.layer5Image = await loadImage("/images/layer-5.png");
    this.layer1 = new Layer(
      this.game,
      this.width,
      this.height,
      0,
      this.layer1Image
    );
    this.layer2 = new Layer(
      this.game,
      this.width,
      this.height,
      0.2,
      this.layer2Image
    );
    this.layer3 = new Layer(
      this.game,
      this.width,
      this.height,
      0.4,
      this.layer3Image
    );
    this.layer4 = new Layer(
      this.game,
      this.width,
      this.height,
      0.8,
      this.layer4Image
    );
    this.layer5 = new Layer(
      this.game,
      this.width,
      this.height,
      1,
      this.layer5Image
    );
    this.backgroundLayers = [
      this.layer1,
      this.layer2,
      this.layer3,
      this.layer4,
      this.layer5,
    ];
  }

  update() {
    this.backgroundLayers.forEach((layer) => {
      layer.update();
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.backgroundLayers.forEach((layer) => {
      layer.draw(ctx);
    });
  }
}
