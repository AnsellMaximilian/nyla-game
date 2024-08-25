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
    boostValue: 2,
  },

  {
    id: "CLAWS_OF_LIONESSA",
    name: "Claws of Lionessa",
    description:
      "These ancient, gleaming claws are the remnants of Lionessa, a legendary figure revered as the first of the intelligent big cats and an ancestor to all felines. According to myth, Lionessa was not only a fearsome warrior but also a wise leader who united the wilds in a time of chaos. Her intelligence and strength were unmatched, and she was said to possess the wisdom of the ages, guiding her kin through countless generations. \nForged from the very essence of her being, these claws pulse with the power and knowledge that Lionessa once wielded. When Nyla dons these claws, she channels the primal fury and sharp intellect of her ancient ancestor. Every strike carries the weight of Lionessa's legacy, as if the great cat herself is fighting alongside Nyla.",
    effect:
      "Increases attack damage, empowering Nyla to strike with the ferocity and precision of Lionessa, allowing her to deliver devastating blows to her enemies.",
    available: true,
    boostedStat: "ATTACK",
    boostType: "INCREASE",
    image: "/images/trinkets/claws-of-lionessa.png",
    boostValue: 100,
  },

  {
    id: "LAST_VERDANT_ESSENCE_OF_FELINIA",
    name: "Last Verdant Essence of Felinia",
    description:
      " This bundle of catnip is no ordinary herb—it is the final harvest from the sacred Groves of Felinia, a hidden paradise believed to be the birthplace of all felinekind. The groves, once lush and vibrant, were said to be the source of endless vitality for the cats that roamed them. But when the ancient homeland of Felinia was lost to time, this bundle became the last remnant of that paradise. \nMiraculously, these leaves never wither, their fragrance as potent as the day they were plucked. Legends tell that the spirits of Felinia's first guardians infused this catnip with their eternal essence, ensuring it would endure forever. When Nyla inhales the timeless aroma of this sacred herb, she feels an unparalleled surge of energy and clarity, as if the very soul of Felinia is guiding her.",
    effect:
      "Temporarily boosts speed and enhances focus, allowing Nyla to strike with the precision and swiftness of her ancestors. The effects of this trinket are everlasting, ensuring that the strength of Felinia’s final gift remains with Nyla in every battle.",
    available: true,
    boostedStat: "SPEED",
    boostType: "INCREASE",
    image: "/images/trinkets/last-verdant-essence-of-felinia.png",
    boostValue: 3,
  },
  {
    id: "ETERNAL_YARN_BALL",
    name: "Eternal Yarn Ball",
    description:
      "A vibrant red yarn ball that never unravels, no matter how much it is played with. This yarn ball symbolizes the playful yet determined nature of modern cats, who can entertain themselves endlessly with the simplest of objects. Enchanted with a spell of infinite energy, this yarn ball grants Nyla boundless stamina and unwavering focus. No matter how long or fierce the battle, Nyla's strength never wanes, and her resolve remains unshaken.",
    effect:
      "Decreases dash cooldown, allowing Nyla to dash more often to avoid attacks.",
    available: true,
    boostedStat: "DASH_COOLDOWN",
    boostType: "DECREASE",
    image: "/images/trinkets/eternal-yarn-ball.png",
    boostValue: 1500,
  },
  {
    id: "SUNBEAM_SCEPTER",
    name: "Sunbeam Scepter",
    description:
      "Crafted by the ancient and powerful mythical apes who once sought to harness the might of Nyla's ancestors, the Sunbeam Scepter is a relic of their long-lost civilization. This scepter, forged from obsidian and adorned with a radiant crystal, was used to emit a concentrated beam of pure sunlight, capable of captivating and controlling even the fiercest of feline warriors. Now, Nyla channels its potent energy not as a tool of subjugation, but as a weapon of liberation, amplifying her Nyla Blast to devastating levels.",
    effect:
      "Significantly boosts Nyla Blast damage, allowing her to unleash a beam of pure, focused energy that obliterates enemies with the burning intensity of the sun.",
    available: true,
    boostedStat: "NYLA_BLAST",
    boostType: "INCREASE",
    image: "/images/trinkets/sunbeam-scepter.png",
    boostValue: 300,
  },
  {
    id: "MIDNIGHT_PURRY_FISHBONE",
    name: "Midnight Purry Fishbone",
    description:
      "This ancient fishbone is a relic from the mythical Midnight Purry fish, a creature older than the feline species itself. Captured by the Prince of Purrsia and later studied by cat mages, the bone was found to harbor immense magical potential. A powerful gemstone has been embedded in its eye socket to channel its energy. When worn, the Midnight Purry Fishbone grants Nyla extraordinary mystical abilities, enhancing her spell power and increasing her mana regeneration.",
    effect:
      "Boosts spell power and enhances mana regeneration, allowing for more frequent use of magical abilities.",
    available: true,
    boostedStat: "NYLA_BLAST",
    boostType: "INCREASE",
    image: "/images/trinkets/midnight-purry-fishbone.png",
    boostValue: 5,
  },
  {
    id: "FANG_OF_RUFFUS_CEASAR",
    name: "Fang of Ruffus Caesar",
    description:
      "In an unprecedented moment of unity, ancient cats and dogs forged a brief but powerful alliance. This was made possible by the love between Ruffus Caesar and Cleopawtra. When Ruffus fell in battle, he gifted Cleopawtra one of his fangs. Cleopawtra, in her grief and love, forged this fang into a formidable blade. The Fang of Ruffus Caesar grants its feline wielder the strength of a canine, embodying the power and loyalty of the ancient alliance.",
    effect:
      "Grants a significant boost to strength and attack power, channeling the enduring spirit and might of the canine warrior.",
    available: true,
    boostedStat: "ATTACK",
    boostType: "INCREASE",
    image: "/images/trinkets/fang-of-ruffus-caesar.png",
    boostValue: 6,
  },
];
