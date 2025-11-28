import "dotenv/config";
import { db } from "./db";
import { characters } from "@shared/schema";

const sampleCharacters = [
  // 5 Stars Characters
  {
    name: "Rover (Havoc)",
    imageUrl: "https://ui-avatars.com/api/?name=Rover+Havoc&size=256&background=8b5cf6&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Sword",
    element: "Havoc",
    description: "Le protagoniste de Wuthering Waves. Un Resonator mystérieux avec le pouvoir de contrôler l'élément Havoc.",
  },
  {
    name: "Rover (Spectro)",
    imageUrl: "https://ui-avatars.com/api/?name=Rover+Spectro&size=256&background=fbbf24&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Sword",
    element: "Spectro",
    description: "Le protagoniste de Wuthering Waves dans sa forme Spectro, maîtrisant l'énergie lumineuse.",
  },
  {
    name: "Jiyan",
    imageUrl: "https://ui-avatars.com/api/?name=Jiyan&size=256&background=10b981&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Broadblade",
    element: "Aero",
    description: "Général de l'Armée Midnight Rangers, Jiyan est un guerrier redoutable maîtrisant le vent.",
  },
  {
    name: "Yinlin",
    imageUrl: "https://ui-avatars.com/api/?name=Yinlin&size=256&background=eab308&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Rectifier",
    element: "Electro",
    description: "Agent de la Patroller Association, Yinlin utilise ses pouvoirs électriques pour combattre les Tacet Discords.",
  },
  {
    name: "Calcharo",
    imageUrl: "https://ui-avatars.com/api/?name=Calcharo&size=256&background=eab308&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Broadblade",
    element: "Electro",
    description: "Leader des Ghost Hounds, un mercenaire solitaire avec une force électrique dévastatrice.",
  },
  {
    name: "Jinhsi",
    imageUrl: "https://ui-avatars.com/api/?name=Jinhsi&size=256&background=fbbf24&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Broadblade",
    element: "Spectro",
    description: "Magistrate de Jinzhou, Jinhsi possède une sagesse profonde et des pouvoirs Spectro uniques.",
  },
  {
    name: "Changli",
    imageUrl: "https://ui-avatars.com/api/?name=Changli&size=256&background=ef4444&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Sword",
    element: "Fusion",
    description: "Conseillère expérimentée avec la capacité de manipuler les flammes avec grâce et précision.",
  },
  {
    name: "Encore",
    imageUrl: "https://ui-avatars.com/api/?name=Encore&size=256&background=ef4444&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Rectifier",
    element: "Fusion",
    description: "Une jeune Resonator pleine d'énergie avec des pouvoirs de feu explosifs.",
  },
  {
    name: "Verina",
    imageUrl: "https://ui-avatars.com/api/?name=Verina&size=256&background=fbbf24&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Rectifier",
    element: "Spectro",
    description: "Botaniste talentueuse avec des capacités de soin et de support exceptionnelles.",
  },
  {
    name: "Lingyang",
    imageUrl: "https://ui-avatars.com/api/?name=Lingyang&size=256&background=3b82f6&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Gauntlets",
    element: "Glacio",
    description: "Danseur de lion énergique avec des attaques de glace rapides et acrobatiques.",
  },
  {
    name: "Shorekeeper",
    imageUrl: "https://ui-avatars.com/api/?name=Shorekeeper&size=256&background=fbbf24&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Rectifier",
    element: "Spectro",
    description: "Gardienne mystérieuse du Black Shores avec des pouvoirs de soin Spectro exceptionnels.",
  },
  {
    name: "Xiangli Yao",
    imageUrl: "https://ui-avatars.com/api/?name=Xiangli+Yao&size=256&background=eab308&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Gauntlets",
    element: "Electro",
    description: "Scientifique brillant de l'Académie Huaxu spécialisé dans les technologies électriques.",
  },
  {
    name: "Zhezhi",
    imageUrl: "https://ui-avatars.com/api/?name=Zhezhi&size=256&background=3b82f6&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Rectifier",
    element: "Glacio",
    description: "Artiste peintre talentueuse qui donne vie à ses créations avec des pouvoirs de glace.",
  },
  {
    name: "Camellya",
    imageUrl: "https://ui-avatars.com/api/?name=Camellya&size=256&background=8b5cf6&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Sword",
    element: "Havoc",
    description: "Membre des Fractisidus avec des pouvoirs Havoc sauvages et imprévisibles.",
  },
  {
    name: "Carlotta",
    imageUrl: "https://ui-avatars.com/api/?name=Carlotta&size=256&background=3b82f6&color=fff&bold=true&font-size=0.4",
    rarity: 5,
    weaponType: "Pistols",
    element: "Glacio",
    description: "Seconde fille de la prestigieuse famille Montelli, élégante et raffinée avec une maîtrise des armes à feu glaciales.",
  },
  
  // 4 Stars Characters
  {
    name: "Yuanwu",
    imageUrl: "https://ui-avatars.com/api/?name=Yuanwu&size=256&background=eab308&color=fff&bold=true&font-size=0.4",
    rarity: 4,
    weaponType: "Gauntlets",
    element: "Electro",
    description: "Maître d'arts martiaux utilisant l'électricité pour amplifier ses coups puissants.",
  },
  {
    name: "Mortefi",
    imageUrl: "https://ui-avatars.com/api/?name=Mortefi&size=256&background=ef4444&color=fff&bold=true&font-size=0.4",
    rarity: 4,
    weaponType: "Pistols",
    element: "Fusion",
    description: "Scientifique et inventeur talentueux maîtrisant les armes à feu et le feu.",
  },
  {
    name: "Aalto",
    imageUrl: "https://ui-avatars.com/api/?name=Aalto&size=256&background=10b981&color=fff&bold=true&font-size=0.4",
    rarity: 4,
    weaponType: "Pistols",
    element: "Aero",
    description: "Marchand d'informations rusé utilisant le vent et la tromperie au combat.",
  },
  {
    name: "Chixia",
    imageUrl: "https://ui-avatars.com/api/?name=Chixia&size=256&background=ef4444&color=fff&bold=true&font-size=0.4",
    rarity: 4,
    weaponType: "Pistols",
    element: "Fusion",
    description: "Patroller enthousiaste de Jinzhou avec un esprit de feu et des pistolets ardents.",
  },
  {
    name: "Danjin",
    imageUrl: "https://ui-avatars.com/api/?name=Danjin&size=256&background=8b5cf6&color=fff&bold=true&font-size=0.4",
    rarity: 4,
    weaponType: "Sword",
    element: "Havoc",
    description: "Combattante déterminée qui puise dans son pouvoir Havoc au prix de sa propre santé.",
  },
  {
    name: "Yangyang",
    imageUrl: "https://ui-avatars.com/api/?name=Yangyang&size=256&background=10b981&color=fff&bold=true&font-size=0.4",
    rarity: 4,
    weaponType: "Sword",
    element: "Aero",
    description: "Ranger douce et attentionnée avec des capacités de support basées sur le vent.",
  },
  {
    name: "Baizhi",
    imageUrl: "https://ui-avatars.com/api/?name=Baizhi&size=256&background=3b82f6&color=fff&bold=true&font-size=0.4",
    rarity: 4,
    weaponType: "Rectifier",
    element: "Glacio",
    description: "Chercheuse médicale calme avec des pouvoirs de soin basés sur la glace.",
  },
  {
    name: "Sanhua",
    imageUrl: "https://ui-avatars.com/api/?name=Sanhua&size=256&background=3b82f6&color=fff&bold=true&font-size=0.4",
    rarity: 4,
    weaponType: "Sword",
    element: "Glacio",
    description: "Garde du corps loyale avec des techniques de glace élégantes et mortelles.",
  },
  {
    name: "Taoqi",
    imageUrl: "https://ui-avatars.com/api/?name=Taoqi&size=256&background=8b5cf6&color=fff&bold=true&font-size=0.4",
    rarity: 4,
    weaponType: "Broadblade",
    element: "Havoc",
    description: "Responsable de la logistique avec des capacités défensives Havoc robustes.",
  },
  {
    name: "Youhu",
    imageUrl: "https://ui-avatars.com/api/?name=Youhu&size=256&background=3b82f6&color=fff&bold=true&font-size=0.4",
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
