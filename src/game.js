import TileMap from './TileMap.js';
import Player from './player.js';
import Bot from './bot.js';
import Collision from './collision.js';
import { Bomb } from "./bomb.js";

export default class Game {
  constructor() {
    this.isPaused = false;
    document.querySelector('body').__game = this;
    // Ne pas initialiser le jeu ici, juste le menu
    this.menu();
  }

  menu() {
    const divTileMap = document.querySelector('#tilemap');
    divTileMap.innerHTML = ''; // Nettoyer le contenu existant

    // Supprimer le bouton pause s'il existe
    const pauseContainer = document.querySelector('.pause-container');
    if (pauseContainer) {
      pauseContainer.remove();
    }

    // Créer le conteneur principal du menu
    const menuContainer = document.createElement('div');
    menuContainer.style.display = 'flex';
    menuContainer.style.flexDirection = 'column';
    menuContainer.style.justifyContent = 'center';
    menuContainer.style.alignItems = 'center';
    menuContainer.style.height = '100%';
    menuContainer.style.backgroundImage = "url('assets/img/background/photo2pixel_download.png')";
    menuContainer.style.backgroundSize = "100% 100%";
    menuContainer.style.color = 'white';

    // Bouton Start
    const startButton = document.createElement('button');
    startButton.textContent = 'START';
    startButton.addEventListener('click', () => {
      this.startGame();
      menuContainer.remove(); // Utiliser remove() au lieu de display none
    });

    // Zone d'affichage du score
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
    const divTileMap = document.querySelector('#tilemap');
    divTileMap.innerHTML = ''; // Nettoyer le contenu existant

    const player = document.createElement("div");
    player.id = "player";
    const bot = document.createElement("div");
    bot.id = "bot";
    divTileMap.appendChild(player);
    divTileMap.appendChild(bot);

    this.setupPauseButton(); // Ajouter le bouton pause uniquement au démarrage du jeu
    this.initGame(); // Renommer init() en initGame() pour plus de clarté
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

  setupPauseButton() {
    const existingContainer = document.querySelector('.pause-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    const uiContainer = document.createElement('div');
    uiContainer.classList.add('pause-container');

    const pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pause';
    pauseButton.classList.add('pause-button');

    pauseButton.addEventListener('click', () => {
      this.togglePause();
      pauseButton.textContent = this.isPaused ? 'Resume' : 'Pause';
      pauseButton.classList.toggle('pause-button--paused', this.isPaused);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        pauseButton.click();
      }
    });

    uiContainer.appendChild(pauseButton);
    document.body.appendChild(uiContainer);
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      const pauseMessage = document.createElement('div');
      pauseMessage.id = 'pause-message';
      pauseMessage.classList.add('pause-message');
      pauseMessage.textContent = 'GAME PAUSED';
      document.body.appendChild(pauseMessage);
    } else {
      const pauseMessage = document.getElementById('pause-message');
      if (pauseMessage) {
        pauseMessage.remove();
      }
    }
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (this.keys.hasOwnProperty(e.code)) {
        this.keys[e.code] = true;
        if (e.code === "Space" && !this.isPaused) {
          this.dropBomb();
        }
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

  dropBomb() {
    if (this.isPaused) return;

    const cellWidth = 64;


    // Calcul de la colonne et de la ligne en fonction de la position du joueur
    // On suppose que this.player.x et this.player.y indiquent la position en pixels du joueur.
    const col = Math.floor(this.player.x / cellWidth);
    const row = Math.floor(this.player.y / cellWidth);

    // Calcul de la position centrale de la cellule
    const bombX = col * cellWidth + cellWidth / 2;
    const bombY = row * cellWidth + cellWidth / 2;

    // Par exemple, la longueur de la flamme (rayon d'explosion) est de 2 cases.
    const flameLength = this.player.flame;

    // Création de la bombe en lui passant sa position et la longueur de l'explosion
    const bomb = new Bomb(bombX, bombY, flameLength);
    bomb.dropBomb();
  }

  startGameLoop() {
    const gameLoop = () => {
      this.player.move(this.keys, this.isPaused);
      this.bot.moveAutonomously(this.isPaused);

      if (!this.isPaused && Collision.checkCollision(this.player, this.bot)) {
        console.log('Collision detected!');
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }
}

// Lancement du jeu lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  new Game();
});