// universe.js - Generator galaksi dan planet
export class Universe {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.planets = [];
        this.sectors = [];
    }
    
    generateGalaxy() {
        console.log(`Generating galaxy ${this.width}x${this.height}...`);
        
        // Generate stars
        this.generateStars();
        
        // Generate planets (sekitar 20% dari sektor)
        const numPlanets = Math.floor(this.width * this.height * 0.2);
        
        for (let i = 0; i < numPlanets; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            
            // Pastikan tidak ada planet di posisi awal pemain (tengah)
            if (x === 7 && y === 7) continue;
            
            const planet = new Planet(x, y);
            this.planets.push(planet);
        }
        
        console.log(`Generated ${this.planets.length} planets.`);
    }
    
    generateStars() {
        this.sectors = [];
        
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                // Tambah bintang acak di setiap sektor
                const numStars = Math.floor(Math.random() * 5) + 1;
                const sectorStars = [];
                
                for (let i = 0; i < numStars; i++) {
                    sectorStars.push({
                        x: Math.random(),
                        y: Math.random(),
                        size: Math.random() * 2 + 1,
                        brightness: Math.random() * 0.5 + 0.5
                    });
                }
                
                this.sectors.push({
                    x, y,
                    stars: sectorStars
                });
            }
        }
    }
    
    getPlanetAt(x, y) {
        return this.planets.find(planet => planet.x === x && planet.y === y);
    }
    
    getPlanetsInRadius(centerX, centerY, radius) {
        return this.planets.filter(planet => {
            const distance = Math.sqrt(
                Math.pow(planet.x - centerX, 2) + Math.pow(planet.y - centerY, 2)
            );
            return distance <= radius;
        });
    }
    
    getSectorStars(x, y) {
        return this.sectors.find(sector => sector.x === x && sector.y === y)?.stars || [];
    }
}

export class Planet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.name = this.generatePlanetName();
        this.type = this.generatePlanetType();
        this.resources = this.generateResources();
        this.explored = false;
        this.icon = this.getPlanetIcon();
        this.color = this.getPlanetColor();
    }
    
    generatePlanetName() {
        const prefixes = ['New', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Nova', 'Hyper', 'Mega'];
        const suffixes = ['Prime', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'VI', 'VII', 'VIII', 'IX', 'X'];
        const names = ['Terra', 'Luna', 'Mars', 'Jupiter', 'Saturn', 'Neptune', 'Uranus', 'Pluto', 'Venus', 'Mercury'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        
        return `${prefix} ${name} ${suffix}`;
    }
    
    generatePlanetType() {
        const types = [
            'Planet Batuan', 'Planet Gas', 'Planet Es', 'Planet Gurun',
            'Planet Laut', 'Planet Vulkanik', 'Planet Berhutan', 'Planet Radioaktif'
        ];
        return types[Math.floor(Math.random() * types.length)];
    }
    
    generateResources() {
        const allResources = [
            { name: 'Besi', rarity: 0.7 },
            { name: 'Emas', rarity: 0.4 },
            { name: 'Kristal', rarity: 0.3 },
            { name: 'Helium-3', rarity: 0.2 },
            { name: 'Teknologi Alien', rarity: 0.1 }
        ];
        
        // Planet dapat memiliki 1-3 jenis sumber daya
        const numResources = Math.floor(Math.random() * 3) + 1;
        const availableResources = allResources.filter(res => Math.random() < res.rarity);
        
        // Ambil beberapa sumber daya secara acak
        const selectedResources = [];
        for (let i = 0; i < Math.min(numResources, availableResources.length); i++) {
            const resource = availableResources[i];
            selectedResources.push({
                name: resource.name,
                amount: Math.floor(Math.random() * 5) + 1
            });
        }
        
        return selectedResources;
    }
    
    getPlanetIcon() {
        const icons = {
            'Planet Batuan': 'fas fa-globe-americas',
            'Planet Gas': 'fas fa-cloud',
            'Planet Es': 'fas fa-snowflake',
            'Planet Gurun': 'fas fa-sun',
            'Planet Laut': 'fas fa-water',
            'Planet Vulkanik': 'fas fa-fire',
            'Planet Berhutan': 'fas fa-tree',
            'Planet Radioaktif': 'fas fa-radiation'
        };
        
        return icons[this.type] || 'fas fa-globe';
    }
    
    getPlanetColor() {
        const colors = {
            'Planet Batuan': '#8B7355',
            'Planet Gas': '#87CEEB',
            'Planet Es': '#ADD8E6',
            'Planet Gurun': '#D2B48C',
            'Planet Laut': '#1E90FF',
            'Planet Vulkanik': '#FF4500',
            'Planet Berhutan': '#228B22',
            'Planet Radioaktif': '#32CD32'
        };
        
        return colors[this.type] || '#888';
    }
    
    explore() {
        if (this.explored) {
            return [{ name: 'Sampah', amount: 1 }]; // Kurang hasil jika sudah dijelajahi
        }
        
        this.explored = true;
        return this.resources;
    }
    
    mine() {
        if (this.resources.length === 0) return null;
        
        // Ambil sumber daya acak dari planet
        const randomResource = this.resources[Math.floor(Math.random() * this.resources.length)];
        
        // Kurangi jumlah (tapi jangan sampai habis)
        randomResource.amount = Math.max(1, randomResource.amount - 1);
        
        return {
            name: randomResource.name,
            amount: 1
        };
    }
}