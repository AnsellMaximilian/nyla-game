import sanitizeHtml from "sanitize-html";
import { differenceInHours, formatDistanceToNow } from "date-fns";

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

export const extractStringFromEmailBody = (htmlStr: string) => {
  return sanitizeHtml(htmlStr, {
    allowedTags: [], // No tags allowed
    allowedAttributes: {}, // No attributes allowed
  }).trim();
};

export function hasBeenADaySince(updatedAt: string): boolean {
  const currentDate = new Date();
  const updatedAtDate = new Date(updatedAt);

  return currentDate.getTime() - updatedAtDate.getTime() >= 24 * 60 * 60 * 1000;
}

export function timeSince(now: string): string {
  const nowDate = new Date(now);

  return formatDistanceToNow(nowDate, { addSuffix: true });
}

export function timeUntilNextSpin(lastSpin: string | null): string {
  if (lastSpin === null) return "Spin for Trinket";
  const now = new Date();
  const lastSpinDate = new Date(lastSpin);
  const hoursSinceLastSpin = differenceInHours(now, lastSpinDate);

  if (hoursSinceLastSpin >= 24) {
    return "Spin for Trinket";
  } else {
    const timeUntilNextSpin = 24 - hoursSinceLastSpin;
    return `Next spin in ${formatDistanceToNow(
      new Date(now.getTime() + timeUntilNextSpin * 60 * 60 * 1000)
    )}`;
  }
}

export function snakeCaseToTitleCase(input: string): string {
  return input
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
