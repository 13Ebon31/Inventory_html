// Crafting Recipes
const craftingRecipes = {
    "1,3": { id: 41, name: "Acid Sword", icon: `<img src="images/viper-sword.png" style="width:80px;height:80px;margin-top:5px;">`, count: 1, rarity: "epic", stats: "Damage: 20-25\nAcid damage: +5", stackable: false, consumes: "3" },
    "2,3": { id: 42, name: "Acid shield", icon: `<img src="images/viper-shield.png" style="width:80px;height:80px;margin-top:5px;">`, count: 1, rarity: "epic", stats: "Defense: +30\nBlock: 35%\nAcid resist", stackable: false, consumes: "3" },
    "3,3": { id: 43, name: "Enhanced Potion", icon: "⚗️", count: 1, rarity: "epic", stats: "Heal 100 HP", stackable: true, maxStack: 5, consumes: "3" },
    "4,9": { id: 3, name: "Potion", icon: "🧪", count: 1, rarity: "normal", stats: "Heal 25 HP\nYou can pour it on your weapon", stackable: true, maxStack: 5, consumes: "3" },
    "41,42": { id: 44, name: "Acid Two-Handed Sword", icon: `<img src="images/Poison-Twohandle.png" style="width:90px;height:90px;margin-top:5px;">`, count: 1, rarity: "rare", stats: "Damage: 40-45\nAcid damage: +10", stackable: false, consumes: "1" },
    "43,5": { id: 45, name: "Fire mixture", icon: "🪔", count: 1, rarity: "rare", stats: "Very hot, burns well", stackable: true, maxStack: 5, consumes: "5" },
    "44,45": { id: 46, name: "Doom-Sword", icon: `<img src="images/Flame-Sword.png" style="width:80px;height:80px;margin-top:5px;">`, count: 1, rarity: "legendary", stats: "Damage: 40-45\nFire damage: +15", stackable: false, consumes: "7" },
    "6,8": { id: 47, name: "Bow", icon: "🏹", count: 1, rarity: "epic", stats: "Damage: 18-24", stackable: false, consumes: "3" },
    "7,8": { id: 48, name: "Chain", icon: "⛓️‍💥", count: 1, rarity: "epic", stats: "Strong metal chain", stackable: false, consumes: "3" },
    "47,48": { id: 49, name: "Crossbow", icon: `<img src="images/crossbow.png" style="width:80px;height:80px;margin-top:5px;">`, count: 1, rarity: "legendary", stats: "Damage: 60-65", stackable: false, consumes: "3" },
    "46,49": { id: 50, name: "Two-Handed Crossbow of the Underworld", icon: `<img src="images/Flame-Crossbow.png" style="width:80px;height:80px;margin-top:5px;">`, count: 1, rarity: "legendary", stats: "Damage: 80-85\nFire damage: +15", stackable: false, consumes: "3" },
};
