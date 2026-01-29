// player.js - Sistem pemain dan inventaris
export class Player {
    constructor(name, level, xp, credits) {
        this.name = name;
        this.level = level;
        this.xp = xp;
        this.credits = credits;
        this.shipLevel = 1;
        this.inventory = new Inventory(10); // Kapasitas awal
        this.xpToNextLevel = 100;
    }
    
    gainXP(amount) {
        this.xp += amount;
        
        // Cek level up
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5); // XP needed increases
            console.log(`Level up! Sekarang level ${this.level}`);
            
            // Beri bonus kredit saat level up
            this.credits += 500;
        }
        
        return this.level;
    }
}

export class Inventory {
    constructor(maxCapacity) {
        this.maxCapacity = maxCapacity;
        this.items = [];
    }
    
    addItem(name, quantity = 1) {
        // Cek kapasitas
        if (this.getTotalItems() + quantity > this.maxCapacity) {
            return false;
        }
        
        // Cek jika item sudah ada
        const existingItem = this.items.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ name, quantity });
        }
        
        return true;
    }
    
    removeItem(name, quantity = 1) {
        const itemIndex = this.items.findIndex(item => item.name === name);
        
        if (itemIndex === -1) return false;
        
        const item = this.items[itemIndex];
        
        if (item.quantity > quantity) {
            item.quantity -= quantity;
        } else {
            this.items.splice(itemIndex, 1);
        }
        
        return true;
    }
    
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    clear() {
        this.items = [];
    }
    
    hasItem(name, quantity = 1) {
        const item = this.items.find(item => item.name === name);
        return item && item.quantity >= quantity;
    }
}