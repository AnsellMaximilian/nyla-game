import { Trinket } from "@/type";

export const DEFAULT_TRIKET_IMAGE = "/images/trinkets/default.png";

export const TRINKETS: Trinket[] = [
  {
    id: "PURR_TRINITY_COLLAR",
    name: "Purr Trinity Collar",
    description:
      "A relic of a bygone era, the Purr Trinity Collar is adorned with three intricately engraved golden tags, each radiating a warm, protective aura. Legend speaks of an ancient trinity of feline guardians, The Purr Trinity, who, in their quest to protect their kingdom, forged this collar with their combined life force. The harmonious jingle of the tags resonates with the power of the trinity, bestowing upon its wearer unparalleled vitality. The collar is said to have the essence of these three legendary protectors, each tag symbolizing their undying strength, courage, and wisdom.",
    effect:
      "Significantly boosts health, imbuing the wearer with the resilience of the ancient trinity, allowing them to endure the fiercest of battles.",
    available: true,
    boostedStat: "HEALTH",
    boostType: "INCREASE",
    image: "/images/trinkets/purr-trinity-collar.png",
    boostValue: 4,
  },

  {
    id: "CLAWS_OF_LIONESSA",
    name: "Claws of Lionessa",
    description:
      "These ancient, gleaming claws are the remnants of Lionessa, a legendary figure revered as the first of the intelligent big cats and an ancestor to all felines. According to myth, Lionessa was not only a fearsome warrior but also a wise leader who united the wilds in a time of chaos. Her intelligence and strength were unmatched, and she was said to possess the wisdom of the ages, guiding her kin through countless generations. \nForged from the very essence of her being, these claws pulse with the power and knowledge that Lionessa once wielded. When Nyla dons these claws, she channels the primal fury and sharp intellect of her ancient ancestor. Every strike carries the weight of Lionessa's legacy, as if the great cat herself is fighting alongside Nyla.",
    effect:
      "Increases attack damage, empowering Nyla to strike with the ferocity and precision of Lionessa, allowing her to deliver devastating blows to her enemies.",
    available: true,
    boostedStat: "DAMAGE",
    boostType: "INCREASE",
    image: "/images/trinkets/claws-of-lionessa.png",
    boostValue: 4,
  },
];
