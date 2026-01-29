// game.js - File utama game
import { Player, Inventory } from './player.js';
import { Universe, Planet } from './universe.js';
import { MissionManager } from './missions.js';
import { UIManager } from './ui.js';
import { SoundManager } from './sound.js';

class SpaceExplorerGame {
    constructor() {
        this.player = new Player("Kapten Astra", 1, 0, 1000);
        this.universe = new Universe(20, 15); // 20x15 grid
        this.missionManager = new MissionManager();
        this.uiManager = new UIManager();
        this.soundManager = new SoundManager();
        
        this.currentSector = { x: 7, y: 7 }; // Posisi awal di tengah
        this.currentPlanet = null;
        this.gameRunning = true;
        this.gameLog = [];
        
        this.init();
    }
    
    init() {
        console.log("Space Explorer Game Initializing...");
        
        // Inisialisasi UI
        this.uiManager.init(this);
        
        // Inisialisasi universe
        this.universe.generateGalaxy();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load game state dari localStorage jika ada
        this.loadGame();
        
        // Update tampilan awal
        this.updateUI();
        
        // Tambah log awal
        this.addLog("Selamat datang di Space Explorer! Pindai area untuk menemukan planet.");
        this.addLog("Gunakan tombol navigasi untuk menjelajahi galaksi.");
        
        console.log("Game Ready!");
    }
    
    setupEventListeners() {
        // Tombol navigasi
        document.getElementById('move-up').addEventListener('click', () => this.movePlayer(0, -1));
        document.getElementById('move-down').addEventListener('click', () => this.movePlayer(0, 1));
        document.getElementById('move-left').addEventListener('click', () => this.movePlayer(-1, 0));
        document.getElementById('move-right').addEventListener('click', () => this.movePlayer(1, 0));
        document.getElementById('scan-area').addEventListener('click', () => this.scanArea());
        
        // Tombol aksi
        document.getElementById('explore-planet').addEventListener('click', () => this.explorePlanet());
        document.getElementById('mine-resources').addEventListener('click', () => this.mineResources());
        document.getElementById('trade-resources').addEventListener('click', () => this.tradeResources());
        document.getElementById('upgrade-ship').addEventListener('click', () => this.upgradeShip());
        document.getElementById('new-mission').addEventListener('click', () => this.getNewMission());
        document.getElementById('save-game').addEventListener('click', () => this.saveGame());
        
        // Tombol kontrol game
        document.getElementById('toggle-sound').addEventListener('click', () => this.toggleSound());
        document.getElementById('help-btn').addEventListener('click', () => this.showHelp());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        
        // Modal close
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('help-modal').style.display = 'none';
        });
        
        // Close modal jika klik di luar
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('help-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    movePlayer(dx, dy) {
        const newX = this.currentSector.x + dx;
        const newY = this.currentSector.y + dy;
        
        // Cek batas galaksi
        if (newX >= 0 && newX < this.universe.width && newY >= 0 && newY < this.universe.height) {
            this.currentSector.x = newX;
            this.currentSector.y = newY;
            
            // Update posisi di UI
            this.uiManager.updatePlayerPosition(this.currentSector);
            
            // Cek jika ada planet di sektor ini
            this.currentPlanet = this.universe.getPlanetAt(newX, newY);
            
            if (this.currentPlanet) {
                this.uiManager.showPlanetInfo(this.currentPlanet);
                this.addLog(`Tiba di sektor ${this.getSectorName(newX, newY)}. Planet ${this.currentPlanet.name} terdeteksi!`);
            } else {
                this.uiManager.hidePlanetInfo();
                this.addLog(`Bergerak ke sektor ${this.getSectorName(newX, newY)}. Tidak ada planet di sini.`);
            }
            
            // Update misi perjalanan
            this.missionManager.updateTravelMission(1);
            this.updateUI();
            
            // Mainkan suara
            this.soundManager.play('move');
        } else {
            this.addLog("Tidak bisa bergerak ke arah itu - mencapai batas galaksi!");
        }
    }
    
    scanArea() {
        this.addLog("Memindai area sekitar...");
        
        // Tampilkan semua planet dalam radius 2 sektor
        const nearbyPlanets = this.universe.getPlanetsInRadius(this.currentSector.x, this.currentSector.y, 2);
        
        if (nearbyPlanets.length > 0) {
            this.addLog(`Ditemukan ${nearbyPlanets.length} planet di sekitar:`);
            nearbyPlanets.forEach(planet => {
                this.addLog(`- ${planet.name} (${planet.type}) di sektor ${this.getSectorName(planet.x, planet.y)}`);
            });
        } else {
            this.addLog("Tidak ada planet terdeteksi di area sekitar.");
        }
        
        // Update UI dengan planet terdekat
        this.uiManager.showNearbyPlanets(nearbyPlanets, this.currentSector);
        
        // Update misi
        this.missionManager.updateScanMission();
        this.updateUI();
        
        // Mainkan suara
        this.soundManager.play('scan');
    }
    
    explorePlanet() {
        if (!this.currentPlanet) {
            this.addLog("Tidak ada planet untuk dijelajahi di sektor ini!");
            return;
        }
        
        this.addLog(`Menjelajahi ${this.currentPlanet.name}...`);
        
        // Cari sumber daya
        const resources = this.currentPlanet.explore();
        let foundItems = [];
        
        resources.forEach(resource => {
            if (this.player.inventory.addItem(resource.name, resource.amount)) {
                foundItems.push(`${resource.amount} ${resource.name}`);
                this.addLog(`Ditemukan ${resource.amount} ${resource.name}!`);
            } else {
                this.addLog(`Inventaris penuh! Tidak bisa mengambil ${resource.name}.`);
            }
        });
        
        if (foundItems.length > 0) {
            this.addLog(`Eksplorasi selesai. Ditemukan: ${foundItems.join(', ')}`);
        } else {
            this.addLog("Tidak menemukan apa-apa yang berharga di planet ini.");
        }
        
        // Beri XP
        this.player.gainXP(10);
        
        // Update misi eksplorasi
        this.missionManager.updateExploreMission();
        
        // Update UI
        this.updateUI();
        
        // Mainkan suara
        this.soundManager.play('explore');
    }
    
    mineResources() {
        if (!this.currentPlanet) {
            this.addLog("Tidak ada planet untuk menambang di sektor ini!");
            return;
        }
        
        if (!this.currentPlanet.resources || this.currentPlanet.resources.length === 0) {
            this.addLog("Planet ini tidak memiliki sumber daya yang dapat ditambang!");
            return;
        }
        
        this.addLog(`Menambang sumber daya di ${this.currentPlanet.name}...`);
        
        // Dapatkan sumber daya dari planet
        const minedResource = this.currentPlanet.mine();
        
        if (minedResource && this.player.inventory.addItem(minedResource.name, minedResource.amount)) {
            this.addLog(`Berhasil menambang ${minedResource.amount} ${minedResource.name}!`);
            
            // Beri XP
            this.player.gainXP(5);
            
            // Update misi
            this.missionManager.updateMiningMission();
            
            // Mainkan suara
            this.soundManager.play('mine');
        } else {
            this.addLog("Gagal menambang atau inventaris penuh!");
        }
        
        this.updateUI();
    }
    
    tradeResources() {
        if (this.player.inventory.items.length === 0) {
            this.addLog("Tidak ada barang untuk diperdagangkan!");
            return;
        }
        
        this.addLog("Membuka pasar antarbintang...");
        
        // Harga acak untuk barang
        const itemValues = {
            'Besi': 50,
            'Emas': 150,
            'Kristal': 200,
            'Helium-3': 300,
            'Teknologi Alien': 500
        };
        
        // Jual semua barang
        let totalCredits = 0;
        const itemsToSell = [...this.player.inventory.items];
        
        itemsToSell.forEach(item => {
            const value = itemValues[item.name] || 50;
            const sellValue = value * item.quantity;
            totalCredits += sellValue;
            this.addLog(`Menjual ${item.quantity} ${item.name} seharga ${sellValue} kredit`);
        });
        
        // Kosongkan inventaris dan tambah kredit
        this.player.inventory.clear();
        this.player.credits += totalCredits;
        
        this.addLog(`Perdagangan selesai! Mendapatkan ${totalCredits} kredit.`);
        
        // Update misi
        this.missionManager.updateTradingMission(totalCredits);
        
        // Update UI
        this.updateUI();
        
        // Mainkan suara
        this.soundManager.play('trade');
    }
    
    upgradeShip() {
        const upgradeCost = this.player.level * 500;
        
        if (this.player.credits >= upgradeCost) {
            this.player.credits -= upgradeCost;
            this.player.shipLevel++;
            
            // Upgrade kapasitas inventaris
            this.player.inventory.maxCapacity += 5;
            
            this.addLog(`Kapal ditingkatkan ke level ${this.player.shipLevel}! Biaya: ${upgradeCost} kredit.`);
            this.addLog(`Kapasitas inventaris sekarang: ${this.player.inventory.maxCapacity}`);
            
            // Beri XP
            this.player.gainXP(25);
            
            // Update misi
            this.missionManager.updateUpgradeMission();
            
            // Mainkan suara
            this.soundManager.play('upgrade');
        } else {
            this.addLog(`Kredit tidak cukup! Diperlukan ${upgradeCost} kredit, Anda memiliki ${this.player.credits} kredit.`);
        }
        
        this.updateUI();
    }
    
    getNewMission() {
        const newMission = this.missionManager.generateRandomMission();
        
        if (newMission) {
            this.missionManager.addMission(newMission);
            this.addLog(`Misi baru diterima: ${newMission.name}`);
            this.addLog(`Hadiah: ${newMission.reward.xp} XP dan ${newMission.reward.credits} kredit`);
        } else {
            this.addLog("Tidak ada misi baru yang tersedia saat ini.");
        }
        
        this.updateUI();
    }
    
    getSectorName(x, y) {
        const sectors = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
        return `${sectors[x % sectors.length]}-${y + 1}`;
    }
    
    addLog(message) {
        const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        this.gameLog.unshift(`[${timestamp}] ${message}`);
        
        // Batasi log hingga 50 entri
        if (this.gameLog.length > 50) {
            this.gameLog.pop();
        }
        
        this.uiManager.updateGameLog(this.gameLog);
    }
    
    updateUI() {
        this.uiManager.updatePlayerInfo(this.player);
        this.uiManager.updateInventory(this.player.inventory);
        this.uiManager.updateMissions(this.missionManager.activeMissions);
        this.uiManager.updateAchievements(this.missionManager.achievements);
        
        // Periksa dan update misi yang selesai
        this.missionManager.checkMissionCompletion(this.player);
        
        // Update XP bar
        const xpPercent = (this.player.xp / this.player.xpToNextLevel) * 100;
        document.getElementById('xp-bar').style.width = `${xpPercent}%`;
    }
    
    toggleSound() {
        const soundBtn = document.getElementById('toggle-sound');
        if (this.soundManager.enabled) {
            this.soundManager.disable();
            soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Suara';
            this.addLog("Suara dimatikan.");
        } else {
            this.soundManager.enable();
            soundBtn.innerHTML = '<i class="fas fa-volume-up"></i> Suara';
            this.addLog("Suara dihidupkan.");
        }
    }
    
    showHelp() {
        document.getElementById('help-modal').style.display = 'flex';
    }
    
    saveGame() {
        const gameState = {
            player: {
                name: this.player.name,
                level: this.player.level,
                xp: this.player.xp,
                credits: this.player.credits,
                shipLevel: this.player.shipLevel,
                inventory: this.player.inventory.items,
                inventoryMax: this.player.inventory.maxCapacity
            },
            sector: this.currentSector,
            missions: this.missionManager.activeMissions,
            achievements: this.missionManager.achievements,
            gameLog: this.gameLog.slice(0, 10) // Simpan hanya 10 log terbaru
        };
        
        localStorage.setItem('spaceExplorerSave', JSON.stringify(gameState));
        this.addLog("Game disimpan!");
        
        // Tampilkan notifikasi
        this.uiManager.showNotification("Game berhasil disimpan!");
    }
    
    loadGame() {
        const savedGame = localStorage.getItem('spaceExplorerSave');
        
        if (savedGame) {
            try {
                const gameState = JSON.parse(savedGame);
                
                // Load player data
                this.player.name = gameState.player.name;
                this.player.level = gameState.player.level;
                this.player.xp = gameState.player.xp;
                this.player.credits = gameState.player.credits;
                this.player.shipLevel = gameState.player.shipLevel;
                this.player.inventory.items = gameState.player.inventory;
                this.player.inventory.maxCapacity = gameState.player.inventoryMax;
                
                // Load sector position
                this.currentSector = gameState.sector;
                
                // Load missions and achievements
                this.missionManager.activeMissions = gameState.missions;
                this.missionManager.achievements = gameState.achievements;
                
                // Load game log
                this.gameLog = gameState.gameLog || [];
                
                this.addLog("Game dimuat dari penyimpanan!");
                this.uiManager.showNotification("Game berhasil dimuat!");
                
            } catch (e) {
                console.error("Error loading game:", e);
                this.addLog("Gagal memuat game yang tersimpan.");
            }
        }
    }
    
    resetGame() {
        if (confirm("Apakah Anda yakin ingin mereset game? Semua kemajuan akan hilang.")) {
            localStorage.removeItem('spaceExplorerSave');
            
            // Reset game state
            this.player = new Player("Kapten Astra", 1, 0, 1000);
            this.currentSector = { x: 7, y: 7 };
            this.currentPlanet = null;
            this.missionManager = new MissionManager();
            this.gameLog = [];
            
            this.addLog("Game direset! Memulai petualangan baru.");
            this.updateUI();
            
            // Update UI planet
            this.uiManager.hidePlanetInfo();
            this.uiManager.updatePlayerPosition(this.currentSector);
        }
    }
}

// Inisialisasi game saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    const game = new SpaceExplorerGame();
    window.game = game; // Untuk debugging di console
});