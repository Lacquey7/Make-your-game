import TileMap from './TileMap.js';
import Player from './player.js';
import Bot from './bot.js';
import Collision from './collision.js';

export default class Game {
  constructor() {
    this.init();
  }

  init() {
    // Map configuration
    this.Countbonus = 6;
    this.bonus = ['Bonus1', 'Bonus2', 'Bonus3'];
    this.map = [
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 4, 4, 5, 4, 5, 4, 5, 4, 5, 4, 4, 1],
      [1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1],
      [1, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 1],
      [1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1],
      [1, 4, 4, 5, 4, 5, 4, 5, 4, 5, 4, 4, 1],
      [1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1],
      [1, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 1],
      [1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1],
      [1, 4, 4, 5, 4, 5, 4, 5, 4, 5, 4, 4, 1],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];

    this.totalBlockBreakable = this.countBlockBreakable();
    this.tileMap = new TileMap(this.map, this.Countbonus, this.bonus, this.totalBlockBreakable);

    // Initialize map
    this.tileMap.draw();

    // Initialize game objects
    this.player = new Player();
    this.bot = new Bot();

    // Set up controls
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    this.setupEventListeners();
    this.startGameLoop();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (this.keys.hasOwnProperty(e.code)) {
        this.keys[e.code] = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (this.keys.hasOwnProperty(e.code)) {
        this.keys[e.code] = false;
      }
    });
  }

  countBlockBreakable() {
    return this.map.reduce((count, row) => {
      return count + row.filter((cell) => cell === 5).length;
    }, 0);
  }

  startGameLoop() {
    const gameLoop = () => {
      this.player.move(this.keys);
      this.bot.moveAutonomously();

      // Check collision
      if (Collision.checkCollision(this.player, this.bot)) {
        console.log('Collision detected!');
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }
}

// Start game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Game();
});
