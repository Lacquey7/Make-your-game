import TileMap from './TileMap.js';
import Player from './player.js';
import Bot from './bot.js';
import Collision from './collision.js';
import { Bomb } from "./bomb.js";
import { startHistory } from './history.js'; // Assurez-vous d’avoir exporté correctement la logique d’histoire




export default class Game {
  constructor() {
    this.isPaused = false;
    document.querySelector('body').__game = this;
    // Ne pas initialiser le jeu ici, juste le menu
    this.level = 1
    this.playerName = ''; // Stocke le nom du joueur
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
    menuContainer.style.borderRadius = "12px";

    // Bouton Start
    const startButton = document.createElement('button');
    startButton.textContent = 'START';
    startButton.style.margin = '10px';
    startButton.addEventListener('click', () => {
      // Démarrer l’histoire avec un callback vers `this.startGame`
      startHistory(this.level, (playerName) => {
        this.playerName = playerName; // Stocker le nom du joueur
        this.startGame(); // Lancer la méthode de la classe Game
      });
      menuContainer.remove(); // Supprimer le menu
    });

    // Zone d'affichage du score
    const scoreDisplay = document.createElement('button');
    scoreDisplay.textContent = 'SCORE';
    scoreDisplay.style.margin = '10px';
    scoreDisplay.addEventListener('click', () => {
      menuContainer.remove(); // Supprimer le menu
      this.score(); // Afficher les scores
    });

    menuContainer.appendChild(startButton);
    menuContainer.appendChild(scoreDisplay);
    divTileMap.appendChild(menuContainer);
  }


  async score() {
    const divTileMap = document.querySelector('#tilemap');
    divTileMap.innerHTML = ''; // Nettoyer le contenu existant

    try {
      const response = await fetch("http://localhost:8080/score", {
        method: "GET"
      });

      const scores = await response.json();
      scores.sort((a, b) => b.score - a.score);

      let currentPage = 0; // Page actuelle
      const scoresPerPage = 6; // Nombre de scores par page

      const renderScores = () => {
        divTileMap.innerHTML = ''; // Réinitialiser la divTileMap à chaque changement de page

        // Créer le tableau
        const table = document.createElement('table');
        table.style.width = '50%';
        table.style.borderCollapse = 'collapse';
        table.style.margin = '20px auto';
        table.style.color = 'white';
        table.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        table.style.padding = '10px';

        // Créer l'en-tête du tableau
        const headerRow = document.createElement('tr');
        ['Rank', 'Nom', 'Score', 'Time'].forEach(headerText => {
          const th = document.createElement('th');
          th.textContent = headerText;
          th.style.border = '1px solid white';
          th.style.padding = '8px';
          th.style.textAlign = 'center';
          headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Afficher uniquement les scores de la page actuelle
        const startIndex = currentPage * scoresPerPage;
        const endIndex = Math.min(startIndex + scoresPerPage, scores.length);

        let rank = startIndex + 1; // Ajuster le rang pour chaque page

        for (let i = startIndex; i < endIndex; i++) {
          const scoreEntry = scores[i];
          const row = document.createElement('tr');

          // Colonne du rang
          const rankCell = document.createElement('td');
          let place = ["st", "nd", "rd"][rank - 1] || "th"; // Gestion du suffixe
          rankCell.textContent = `${rank}${place}`;
          rankCell.style.border = '1px solid white';
          rankCell.style.padding = '8px';
          rankCell.style.textAlign = 'center';
          row.appendChild(rankCell);

          // Colonne du nom
          const nameCell = document.createElement('td');
          nameCell.textContent = scoreEntry.name;
          nameCell.style.border = '1px solid white';
          nameCell.style.padding = '8px';
          nameCell.style.textAlign = 'center';
          row.appendChild(nameCell);

          // Colonne du score
          const scoreCell = document.createElement('td');
          scoreCell.textContent = scoreEntry.score;
          scoreCell.style.border = '1px solid white';
          scoreCell.style.padding = '8px';
          scoreCell.style.textAlign = 'center';
          row.appendChild(scoreCell);

          // Colonne du temps
          const timeCell = document.createElement('td');
          timeCell.textContent = scoreEntry.time;
          timeCell.style.border = '1px solid white';
          timeCell.style.padding = '8px';
          timeCell.style.textAlign = 'center';
          row.appendChild(timeCell);

          table.appendChild(row);
          rank++;
        }

        // Conteneur du tableau et du bouton
        const divTable = document.createElement("div");
        divTable.style.position = "absolute";
        divTable.style.top = "50%";
        divTable.style.left = "50%";
        divTable.style.transform = "translate(-50%, -50%)";
        divTable.style.display = "flex";
        divTable.style.flexDirection = "column";
        divTable.style.alignItems = "center";

        // Bouton Retour au Menu
        const backButton = document.createElement('button');
        backButton.textContent = 'Retour au Menu';
        backButton.style.marginTop = '20px';
        backButton.style.padding = '10px 20px';
        backButton.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        backButton.style.border = 'none';
        backButton.style.cursor = 'pointer';
        backButton.style.fontSize = '16px';
        backButton.style.color = 'black';
        backButton.addEventListener('click', () => {
          this.menu(); // Revenir au menu principal
        });

        if (currentPage > 0) {
          // Flèche précédente
          const prevButton = document.createElement('button');
          prevButton.textContent = '← Page Précédente';
          prevButton.style.marginTop = '10px';
          prevButton.style.padding = '10px 15px';
          prevButton.style.cursor = 'pointer';
          prevButton.disabled = currentPage === 0; // Désactiver si première page
          prevButton.addEventListener('click', () => {
            currentPage = Math.max(0, currentPage - 1);
            renderScores();
          });
          divTable.appendChild(prevButton)
        }

        // Flèche suivante
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Page Suivante →';
        nextButton.style.marginTop = '10px';
        nextButton.style.padding = '10px 15px';
        nextButton.style.cursor = 'pointer';
        nextButton.disabled = endIndex >= scores.length; // Désactiver si dernière page
        nextButton.addEventListener('click', () => {
          currentPage = Math.min(Math.ceil(scores.length / scoresPerPage) - 1, currentPage + 1);
          renderScores();
        });

        // Ajouter les éléments
        divTable.appendChild(table);

        divTable.appendChild(nextButton);
        divTable.appendChild(backButton);
        divTileMap.appendChild(divTable);
      };

      // Rendre la première page
      renderScores();

    } catch (error) {
      console.error('Erreur lors du chargement des scores :', error);
    }
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
    const bomb = new Bomb(bombX, bombY, flameLength, this.player, this.bot);
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