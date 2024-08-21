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

  {
    id: "LAST_VERDANT_ESSENCE_OF_FELINIA",
    name: "Last Verdant Essence of Felinia",
    description:
      " This bundle of catnip is no ordinary herb—it is the final harvest from the sacred Groves of Felinia, a hidden paradise believed to be the birthplace of all felinekind. The groves, once lush and vibrant, were said to be the source of endless vitality for the cats that roamed them. But when the ancient homeland of Felinia was lost to time, this bundle became the last remnant of that paradise. \nMiraculously, these leaves never wither, their fragrance as potent as the day they were plucked. Legends tell that the spirits of Felinia's first guardians infused this catnip with their eternal essence, ensuring it would endure forever. When Nyla inhales the timeless aroma of this sacred herb, she feels an unparalleled surge of energy and clarity, as if the very soul of Felinia is guiding her.",
    effect:
      "Temporarily boosts attack speed and enhances focus, allowing Nyla to strike with the precision and swiftness of her ancestors. The effects of this trinket are everlasting, ensuring that the strength of Felinia’s final gift remains with Nyla in every battle.",
    available: true,
    boostedStat: "ATTACK_SPEED",
    boostType: "INCREASE",
    image: "/images/trinkets/last-verdant-essence-of-felinia.png",
    boostValue: 4,
  },
  {
    id: "ETERNAL_YARN_BALL",
    name: "Eternal Yarn Ball",
    description:
      "A vibrant red yarn ball that never unravels, no matter how much it is played with. This yarn ball symbolizes the playful yet determined nature of modern cats, who can entertain themselves endlessly with the simplest of objects. Enchanted with a spell of infinite energy, this yarn ball grants Nyla boundless stamina and unwavering focus. No matter how long or fierce the battle, Nyla's strength never wanes, and her resolve remains unshaken.",
    effect:
      "Increases stamina regeneration and reduces the stamina cost of abilities, allowing Nyla to maintain her energy and focus for longer periods during combat.",
    available: true,
    boostedStat: "SPEED",
    boostType: "INCREASE",
    image: "/images/trinkets/eternal-yarn-ball.png",
    boostValue: 4,
  },
  {
    id: "SUNBEAM_SCEPTER",
    name: "Sunbeam Scepter",
    description:
      "Crafted by the ancient and powerful mythical apes who once sought to harness the might of Nyla's ancestors, the Sunbeam Scepter is a relic of their long-lost civilization. This scepter, forged from obsidian and adorned with a radiant crystal, was used to emit a concentrated beam of pure sunlight, capable of captivating and controlling even the fiercest of feline warriors. Now, Nyla channels its potent energy not as a tool of subjugation, but as a weapon of liberation, amplifying her Nyla Blast to devastating levels.",
    effect:
      "Significantly boosts Nyla Blast damage, allowing her to unleash a beam of pure, focused energy that obliterates enemies with the burning intensity of the sun.",
    available: true,
    boostedStat: "NYLA_BLAST_DAMAGE",
    boostType: "INCREASE",
    image: "/images/trinkets/sunbeam-scepter.png",
    boostValue: 4,
  },
];
