// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    const bot = new Bot();
    let player = new Player();
    let keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };

    document.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = true;
        }
    });
//1 bordure gauche et droite
//2 bordure du haut et du bas
//3 block pas cassable
//4 herbe
//5 block cassable

import TileMap from './TileMap.js';

const Countbonus = 6;
const bonus = ['Bonus1', 'Bonus2', 'Bonus3'];
const map = [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 4, 4, 5, 4, 5, 4, 5, 4, 5, 4, 4, 1, 1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1, 1, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 1, 1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1, 1, 4, 4, 5, 4, 5, 4, 5, 4, 5, 4, 4, 1, 1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1, 1, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 1, 1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1, 1, 4, 4, 5, 4, 5, 4, 5, 4, 5, 4, 4, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
const totalBlockBreakable = countBlockBreakable();
const tileMap = new TileMap(map, Countbonus, bonus, totalBlockBreakable);

tileMap.draw();

function countBlockBreakable() {
  let count = 0;
  for (let i = 0; i < map.length; i++) {
    if (map[i] === 5) {
      count++;
    }
  }
  return count;
}

    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = false;
        }
    });

    function gameLoop() {
        player.move(keys);
        bot.moveAutonomously();

        // Vérifier la collision
        if (Collision.checkCollision(player, bot)) {
            console.log("Collision détectée !");
            // Ajoutez ici ce qui doit se passer lors d'une collision
        }

        requestAnimationFrame(gameLoop);
    }

    // Démarrer le jeu
    gameLoop();
});