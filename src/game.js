import TileMap from './TileMap.js';
import Player from './player.js';
import Bot from './bot.js';
import Collision from './collision.js';
import { Bomb } from "./bomb.js";

export default class Game {
  constructor() {
    this.isPaused = false;
    document.querySelector('body').__game = this;
    this.keyDownHandler = this.handleKeyDown.bind(this);
    this.keyUpHandler = this.handleKeyUp.bind(this);
    this.pauseHandler = this.handlePause.bind(this);
    this.gameLoopId = null;
    this.menu();
  }

  handleKeyDown(e) {
    if (this.keys?.hasOwnProperty(e.code)) {
      this.keys[e.code] = true;
      if (e.code === "Space" && !this.isPaused) {
        this.dropBomb();
      }
    }
  }

  handleKeyUp(e) {
    if (this.keys?.hasOwnProperty(e.code)) {
      this.keys[e.code] = false;
    }
  }

  handlePause(e) {
    if (e.key === 'Escape') {
      this.togglePause();
    }
  }

  menu() {
    const divTileMap = document.querySelector('#tilemap');
    divTileMap.innerHTML = '';

    // Supprimer l'overlay de pause s'il existe
    const pauseOverlay = document.querySelector('.pause-overlay');
    if (pauseOverlay) {
      pauseOverlay.remove();
    }

    const menuContainer = document.createElement('div');
    menuContainer.style.display = 'flex';
    menuContainer.style.flexDirection = 'column';
    menuContainer.style.justifyContent = 'center';
    menuContainer.style.alignItems = 'center';
    menuContainer.style.height = '100%';
    menuContainer.style.backgroundImage = "url('assets/img/background/photo2pixel_download.png')";
    menuContainer.style.backgroundSize = "100% 100%";
    menuContainer.style.color = 'white';

    const startButton = document.createElement('button');
    startButton.textContent = 'START';
    startButton.addEventListener('click', () => {
      this.startGame();
      menuContainer.remove();
    });

    const scoreDisplay = document.createElement('button');
    scoreDisplay.style.marginTop = "20px";
    scoreDisplay.textContent = 'SCORE';
    scoreDisplay.addEventListener('click', () => {
      this.score();
    });

    menuContainer.appendChild(startButton);
    menuContainer.appendChild(scoreDisplay);
    divTileMap.appendChild(menuContainer);
  }

  startGame() {
    this.removeEventListeners();

    const divTileMap = document.querySelector('#tilemap');
    divTileMap.innerHTML = '';

    const player = document.createElement("div");
    player.id = "player";
    const bot = document.createElement("div");
    bot.id = "bot";
    divTileMap.appendChild(player);
    divTileMap.appendChild(bot);

    this.initGame();
    document.addEventListener('keydown', this.pauseHandler);
  }

  initGame() {
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
    this.tileMap.draw();

    this.player = new Player();
    this.bot = new Bot();

    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      Space: false,
    };

    this.setupEventListeners();
    this.startGameLoop();
  }

  removeEventListeners() {
    document.removeEventListener('keydown', this.keyDownHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
    document.removeEventListener('keydown', this.pauseHandler);
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
  }

  setupEventListeners() {
    document.addEventListener('keydown', this.keyDownHandler);
    document.addEventListener('keyup', this.keyUpHandler);
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    let pauseOverlay = document.querySelector('.pause-overlay');
    if (!pauseOverlay) {
      pauseOverlay = document.createElement('div');
      pauseOverlay.className = 'pause-overlay';

      const pauseMenu = document.createElement('div');
      pauseMenu.className = 'pause-menu';

      const title = document.createElement('h2');
      title.className = 'pause-title';
      title.textContent = 'PAUSE';

      const resumeButton = document.createElement('button');
      resumeButton.textContent = 'Resume';
      resumeButton.addEventListener('click', () => this.togglePause());

      const restartButton = document.createElement('button');
      restartButton.textContent = 'Restart Game';
      restartButton.addEventListener('click', () => {
        this.togglePause();
        this.restartGame();
      });

      const menuButton = document.createElement('button');
      menuButton.textContent = 'Main Menu';
      menuButton.addEventListener('click', () => {
        this.togglePause();
        this.returnToMainMenu();
      });

      pauseMenu.appendChild(title);
      pauseMenu.appendChild(resumeButton);
      pauseMenu.appendChild(restartButton);
      pauseMenu.appendChild(menuButton);
      pauseOverlay.appendChild(pauseMenu);
      document.body.appendChild(pauseOverlay);
    }

    if (this.isPaused) {
      pauseOverlay.style.display = 'flex';
      setTimeout(() => {
        pauseOverlay.classList.add('visible');
      }, 10);
    } else {
      pauseOverlay.classList.remove('visible');
      setTimeout(() => {
        pauseOverlay.style.display = 'none';
      }, 300);
    }
  }

  restartGame() {
    this.removeEventListeners();
    const divTileMap = document.querySelector('#tilemap');
    divTileMap.innerHTML = '';
    this.isPaused = false;
    this.startGame();
  }

  returnToMainMenu() {
    this.removeEventListeners();
    this.isPaused = false;
    const divTileMap = document.querySelector('#tilemap');
    divTileMap.innerHTML = '';

    const pauseOverlay = document.querySelector('.pause-overlay');
    if (pauseOverlay) {
      pauseOverlay.remove();
    }

    this.menu();
  }

  countBlockBreakable() {
    return this.map.reduce((count, row) => {
      return count + row.filter((cell) => cell === 5).length;
    }, 0);
  }

  dropBomb() {
    if (this.isPaused) return;

    const cellWidth = 64;
    const col = Math.floor(this.player.x / cellWidth);
    const row = Math.floor(this.player.y / cellWidth);
    const bombX = col * cellWidth + cellWidth / 2;
    const bombY = row * cellWidth + cellWidth / 2;
    const flameLength = this.player.flame;

    const bomb = new Bomb(bombX, bombY, flameLength);
    bomb.dropBomb();
  }

  startGameLoop() {
    const gameLoop = () => {
      if (this.player && this.bot) {
        this.player.move(this.keys, this.isPaused);
        this.bot.moveAutonomously(this.isPaused);

        if (!this.isPaused && Collision.checkCollision(this.player, this.bot)) {
          console.log('Collision detected!');
        }
      }
      this.gameLoopId = requestAnimationFrame(gameLoop);
    };

    this.gameLoopId = requestAnimationFrame(gameLoop);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Game();
});