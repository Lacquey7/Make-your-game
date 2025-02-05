import TileMap from './TileMap.js';
import Player from './player.js';
import Bot from './bot.js';
import Collision from './collision.js';
import { Bomb } from "./bomb.js";

export default class Game {
  constructor() {
    this.menu()
  }

  menu() {
    const divTileMap = document.querySelector('#tilemap');

    // Créer le conteneur principal du menu
    const menuContainer = document.createElement('div');
    menuContainer.style.display = 'flex';
    menuContainer.style.flexDirection = 'column';
    menuContainer.style.justifyContent = 'center';
    menuContainer.style.alignItems = 'center';
    menuContainer.style.height = '100%';
    menuContainer.style.backgroundImage = "url('assets/img/background/photo2pixel_download.png')"
    menuContainer.style.backgroundSize = "100% 100%"
    menuContainer.style.color = 'white';



    // Bouton Start
    const startButton = document.createElement('button');
    startButton.textContent = 'START';


    // Gérer l'événement du clic sur le bouton Start
    startButton.addEventListener('click', () => {
      this.startGame();
      // Tu peux lancer le jeu ici (exemple : this.startGame())
      menuContainer.style.display = 'none'; // Cacher le menu après le démarrage
    });

    // Zone d'affichage du score
    const scoreDisplay = document.createElement('button');
    scoreDisplay.style.marginTop = "20px"
    scoreDisplay.textContent = 'SCORE';

    scoreDisplay.addEventListener('click', () => {
      this.score()
    })


    // Ajouter les éléments au conteneur

    menuContainer.appendChild(startButton);
    menuContainer.appendChild(scoreDisplay);

    // Ajouter le menu dans l'élément tilemap
    divTileMap.appendChild(menuContainer);
  }

  async score() {
    const fetchScore = await fetch()
    const data = fetchScore.json()
  }

  startGame() {
    const divTileMap = document.querySelector('#tilemap')
    const player = document.createElement("div")
    player.id = "player"
    const bot  = document.createElement("div")
    bot.id = "bot"
    divTileMap.appendChild(player)
    divTileMap.appendChild(bot)
    this.init()
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

    // Initialisation de la carte
    this.tileMap.draw();

    // Création des objets de jeu
    this.player = new Player();
    this.bot = new Bot();

    // Gestion des touches (on ajoute ici la touche "Space" pour déposer la bombe)
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

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (this.keys.hasOwnProperty(e.code)) {
        this.keys[e.code] = true;
        // Si la barre d'espace est pressée, déposer la bombe
        if (e.code === "Space") {
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
    // Définition des dimensions d'une cellule dans la grille
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
      this.player.move(this.keys);
      this.bot.moveAutonomously();

      // Vérification de collision
      if (Collision.checkCollision(this.player, this.bot)) {
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