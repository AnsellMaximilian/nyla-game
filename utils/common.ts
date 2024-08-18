import Game from "@/models/Game";

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = (err) => {
      reject(err);
    };
  });
};

export const getGameSpeed = (keys: string[]) => {
  if (keys.includes("ArrowRight")) return 1;
  else if (keys.includes("ArrowLeft")) return -1;
  else return 0;
};
