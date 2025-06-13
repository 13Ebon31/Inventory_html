// Start items
            const inventoryItems = [
    { id: 1, name: "Old sword", icon:  `<img src="images/sword.png" style="width:40px;height:40px;margin-top:5px;">`, count: 1, rarity: "normal", stats: "Damage: 7-12", stackable: false },
    { id: 2, name: "Battered Shield", icon: "🛡️", count: 1, rarity: "normal", stats: "Defense: +8\nBlock: 10% damage", stackable: false },
    { id: 3, name: "Potion", icon: "🧪", count: 3, rarity: "normal", stats: "Heal 25 HP\nYou can pour it on your weapon", stackable: true, maxStack: 5 },
    { id: 4, name: "Flask of water", icon: "🍶", count: 1, rarity: "normal", stats: "You can have drink (+10 HP)\nOr used in crafting", stackable: false },
    { id: 5, name: "Lighter", icon: "🔥", count: 1, rarity: "epic", stats: "Lights a fire\nCan set an enemy on fire (1 time)", stackable: false },
    { id: 13, name: "Ключ", icon: "🔑", count: 1, rarity: "epic", stats: "Opens ancient doors", stackable: false },
    { id: 14, name: "Артефакт", icon: "💎", count: 1, rarity: "legendary", stats: "+10 to all stats\nCannot be lost", stackable: false },
];

const storageItems = [
    { id: 6, name: "Broom", icon: "🧹", count: 1, rarity: "normal", stats: "Can be used as a stick", stackable: false },
    { id: 7, name: "Iron ore", icon: "🪨", count: 1, rarity: "normal", stats: "Quite a strong  material", stackable: false },
    { id: 8, name: "Нитки", icon: "🧵", count: 2, rarity: "normal", stats: "Wool threads used for crafting", stackable: true, maxStack: 999 },
    { id: 9, name: "Странный гриб", icon: "🍄", count: 1, rarity: "normal", stats: "Effect when eaten:\n+15 HP or poisoned (-5 HP/sec, 5 sec)", stackable: false },
    { id: 10, name: "Сломанный компас", icon: "🧭", count: 1, rarity: "epic", stats: "Sometimes shakes near loot chests\nRequires repair \n(Still in development)", stackable: false },
    { id: 11, name: "Ресурсы", icon: "📦", count: 10, rarity: "normal", stats: "Various materials for crafting", stackable: true, maxStack: 100 },
    { id: 12, name: "Древний свиток", icon: "📜", count: 1, rarity: "epic", stats: "You can learn a new skill", stackable: false },
    { id: 15, name: "Золото", icon: "💰", count: 150, rarity: "normal", stats: "Currency for trading", stackable: true, maxStack: 9999 },
    { id: 15, name: "Золото", icon: "💰", count: 130, rarity: "normal", stats: "Currency for trading", stackable: true, maxStack: 9999 }
];
