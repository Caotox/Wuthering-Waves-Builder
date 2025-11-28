import "dotenv/config";
import { db } from "./db";
import { characters } from "@shared/schema";

const sampleCharacters = [
  // 5 Stars Characters
  {
    name: "Rover (Havoc)",
    imageUrl: "https://www.prydwen.gg/static/4df0b8f46dfe9d8c93c45e15f06ce61d/b26e2/card_rover_havoc.webp",
    rarity: 5,
    weaponType: "Sword",
    element: "Havoc",
    description: "Le protagoniste de Wuthering Waves. Un Resonator mystérieux avec le pouvoir de contrôler l'élément Havoc.",
  },
  {
    name: "Rover (Spectro)",
    imageUrl: "https://www.prydwen.gg/static/5ea2075f4c3b20e02f64bfe12ee4c3e1/b26e2/card_rover_spectro.webp",
    rarity: 5,
    weaponType: "Sword",
    element: "Spectro",
    description: "Le protagoniste de Wuthering Waves dans sa forme Spectro, maîtrisant l'énergie lumineuse.",
  },
  {
    name: "Jiyan",
    imageUrl: "https://www.prydwen.gg/static/cb95e8ce1c4bc6aaa3e36698b13bcb35/b26e2/card_jiyan.webp",
    rarity: 5,
    weaponType: "Broadblade",
    element: "Aero",
    description: "Général de l'Armée Midnight Rangers, Jiyan est un guerrier redoutable maîtrisant le vent.",
  },
  {
    name: "Yinlin",
    imageUrl: "https://www.prydwen.gg/static/38b96bf4c4e869c3e87b5b6ef61c1f88/b26e2/card_yinlin.webp",
    rarity: 5,
    weaponType: "Rectifier",
    element: "Electro",
    description: "Agent de la Patroller Association, Yinlin utilise ses pouvoirs électriques pour combattre les Tacet Discords.",
  },
  {
    name: "Calcharo",
    imageUrl: "https://www.prydwen.gg/static/5b2c9eb4c8b4b63c51e1d90cbed2c7f7/b26e2/card_cal.webp",
    rarity: 5,
    weaponType: "Broadblade",
    element: "Electro",
    description: "Leader des Ghost Hounds, un mercenaire solitaire avec une force électrique dévastatrice.",
  },
  {
    name: "Jinhsi",
    imageUrl: "https://www.prydwen.gg/static/c8f01d2b23f86e33502a9aeb0d9be05e/b26e2/card_jinhsi.webp",
    rarity: 5,
    weaponType: "Broadblade",
    element: "Spectro",
    description: "Magistrate de Jinzhou, Jinhsi possède une sagesse profonde et des pouvoirs Spectro uniques.",
  },
  {
    name: "Changli",
    imageUrl: "https://www.prydwen.gg/static/e8a82e0edc0cde59fa29e23056ef26ad/b26e2/card_changli.webp",
    rarity: 5,
    weaponType: "Sword",
    element: "Fusion",
    description: "Conseillère expérimentée avec la capacité de manipuler les flammes avec grâce et précision.",
  },
  {
    name: "Encore",
    imageUrl: "https://www.prydwen.gg/static/4d7e2de76a32f80ad48f9c52ca91f4d6/b26e2/card_encore.webp",
    rarity: 5,
    weaponType: "Rectifier",
    element: "Fusion",
    description: "Une jeune Resonator pleine d'énergie avec des pouvoirs de feu explosifs.",
  },
  {
    name: "Verina",
    imageUrl: "https://www.prydwen.gg/static/e5b9e03a0cf5b3c2b5a52e3f868e40ca/b26e2/card_verina.webp",
    rarity: 5,
    weaponType: "Rectifier",
    element: "Spectro",
    description: "Botaniste talentueuse avec des capacités de soin et de support exceptionnelles.",
  },
  {
    name: "Lingyang",
    imageUrl: "https://www.prydwen.gg/static/ae5caa1b1bfd30a1d7e9b2ec8b6c9f3d/b26e2/card_ling.webp",
    rarity: 5,
    weaponType: "Gauntlets",
    element: "Glacio",
    description: "Danseur de lion énergique avec des attaques de glace rapides et acrobatiques.",
  },
  {
    name: "Shorekeeper",
    imageUrl: "https://www.prydwen.gg/static/a3b6666d0c8b8c7a8a3b8d2c0e4a4f3b/b26e2/card_shorekeeper.webp",
    rarity: 5,
    weaponType: "Rectifier",
    element: "Spectro",
    description: "Gardienne mystérieuse du Black Shores avec des pouvoirs de soin Spectro exceptionnels.",
  },
  {
    name: "Xiangli Yao",
    imageUrl: "https://www.prydwen.gg/static/698d0d5f2ba882de8f3d5494e622e940/b26e2/card_xiang.webp",
    rarity: 5,
    weaponType: "Gauntlets",
    element: "Electro",
    description: "Scientifique brillant de l'Académie Huaxu spécialisé dans les technologies électriques.",
  },
  {
    name: "Zhezhi",
    imageUrl: "https://www.prydwen.gg/static/50c9470f533efed9b28076e92230308b/b26e2/card_zhe.webp",
    rarity: 5,
    weaponType: "Rectifier",
    element: "Glacio",
    description: "Artiste peintre talentueuse qui donne vie à ses créations avec des pouvoirs de glace.",
  },
  {
    name: "Camellya",
    imageUrl: "https://www.prydwen.gg/static/fa50106c1d7d6d2f02033da9c00628f1/b26e2/card_cam.webp",
    rarity: 5,
    weaponType: "Sword",
    element: "Havoc",
    description: "Membre des Fractisidus avec des pouvoirs Havoc sauvages et imprévisibles.",
  },
  {
    name: "Carlotta",
    imageUrl: "https://www.prydwen.gg/static/72a394e25463af4c5b9c309f516c9d17/b26e2/card_carlotta.webp",
    rarity: 5,
    weaponType: "Pistols",
    element: "Glacio",
    description: "Seconde fille de la prestigieuse famille Montelli, élégante et raffinée avec une maîtrise des armes à feu glaciales.",
  },
  
  // 4 Stars Characters
  {
    name: "Yuanwu",
    imageUrl: "https://www.prydwen.gg/static/9b4f3e0c8d2e7f5a3c6b8d9a7e5f4c3b/b26e2/card_yuanwu.webp",
    rarity: 4,
    weaponType: "Gauntlets",
    element: "Electro",
    description: "Maître d'arts martiaux utilisant l'électricité pour amplifier ses coups puissants.",
  },
  {
    name: "Mortefi",
    imageUrl: "https://www.prydwen.gg/static/93c19caba0b2a96e4bd2c8a5f2e3d7c8/b26e2/card_mortefi.webp",
    rarity: 4,
    weaponType: "Pistols",
    element: "Fusion",
    description: "Scientifique et inventeur talentueux maîtrisant les armes à feu et le feu.",
  },
  {
    name: "Aalto",
    imageUrl: "https://www.prydwen.gg/static/0d7b8c5e4f3a9d2c8b6e7a5f4c3d2e1a/b26e2/card_aalto.webp",
    rarity: 4,
    weaponType: "Pistols",
    element: "Aero",
    description: "Marchand d'informations rusé utilisant le vent et la tromperie au combat.",
  },
  {
    name: "Chixia",
    imageUrl: "https://www.prydwen.gg/static/4a8b5c7e9f2d3a6c8e1b7d5f4c2a3e9b/b26e2/card_chixia.webp",
    rarity: 4,
    weaponType: "Pistols",
    element: "Fusion",
    description: "Patroller enthousiaste de Jinzhou avec un esprit de feu et des pistolets ardents.",
  },
  {
    name: "Danjin",
    imageUrl: "https://www.prydwen.gg/static/8c7b5e4f3a9d2c8b6e7a5f4c3d2e1b9a/b26e2/card_danjin.webp",
    rarity: 4,
    weaponType: "Sword",
    element: "Havoc",
    description: "Combattante déterminée qui puise dans son pouvoir Havoc au prix de sa propre santé.",
  },
  {
    name: "Yangyang",
    imageUrl: "https://www.prydwen.gg/static/2c7e4a9f5b3d8c6e7a5f4c3d2e1b9a8c/b26e2/card_yangyang.webp",
    rarity: 4,
    weaponType: "Sword",
    element: "Aero",
    description: "Ranger douce et attentionnée avec des capacités de support basées sur le vent.",
  },
  {
    name: "Baizhi",
    imageUrl: "https://www.prydwen.gg/static/1e7b3c9f5d8a4c6e7a5f4c3d2e1b9a8c/b26e2/card_baizhi.webp",
    rarity: 4,
    weaponType: "Rectifier",
    element: "Glacio",
    description: "Chercheuse médicale calme avec des pouvoirs de soin basés sur la glace.",
  },
  {
    name: "Sanhua",
    imageUrl: "https://www.prydwen.gg/static/5f8c7e4a9d2b3c6e7a5f4c3d2e1b9a8c/b26e2/card_sanhua.webp",
    rarity: 4,
    weaponType: "Sword",
    element: "Glacio",
    description: "Garde du corps loyale avec des techniques de glace élégantes et mortelles.",
  },
  {
    name: "Taoqi",
    imageUrl: "https://www.prydwen.gg/static/3d8c7e4a9f2b5c6e7a5f4c3d2e1b9a8c/b26e2/card_taoqi.webp",
    rarity: 4,
    weaponType: "Broadblade",
    element: "Havoc",
    description: "Responsable de la logistique avec des capacités défensives Havoc robustes.",
  },
  {
    name: "Youhu",
    imageUrl: "https://www.prydwen.gg/static/c4b47996ef9c20aa6c2fc04c9bd7cfa3/b26e2/card_youhu.webp",
    rarity: 4,
    weaponType: "Gauntlets",
    element: "Glacio",
    description: "Jeune prêtresse avec des pouvoirs de glace mystiques et protecteurs.",
  },
];

async function seed() {
  console.log("Seeding database with Wuthering Waves characters...");

  try {
    const existingCharacters = await db.select().from(characters);
    const existingNames = new Set(existingCharacters.map(c => c.name));
    
    const newCharacters = sampleCharacters.filter(c => !existingNames.has(c.name));
    
    if (newCharacters.length === 0) {
      console.log("All characters already exist in database.");
      return;
    }

    await db.insert(characters).values(newCharacters);

    console.log(`Successfully added ${newCharacters.length} new characters!`);
    console.log(`Total characters in database: ${existingCharacters.length + newCharacters.length}`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("Seed completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed:", error);
    process.exit(1);
  });
