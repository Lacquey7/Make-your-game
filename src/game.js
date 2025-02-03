//1 bordure gauche et droite
//2 bordure du haut et du bas
//3 block pas cassable
//4 herbe
//5 block cassable

import TileMap from './TileMap.js';

const Countbonus = 6;
const bonus = ['Bonus1', 'Bonus2', 'Bonus3'];
const map = [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 4, 4, 5, 4, 5, 4, 5, 4, 5, 4, 4, 1, 1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1, 1, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 1, 1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1, 1, 4, 4, 5, 4, 5, 4, 5, 4, 5, 4, 4, 1, 1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1, 1, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 1, 1, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 1, 1, 4, 4, 5, 4, 5, 4, 5, 4, 5, 4, 4, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
const totalBlockBreakable = countBlock();
console.log(totalBlockBreakable);
const tileMap = new TileMap(map, Countbonus, bonus, totalBlockBreakable);

tileMap.draw();

function countBlock() {
  let count = 0;
  for (let i = 0; i < map.length; i++) {
    if (map[i] === 5) {
      count++;
    }
  }
  return count;
}
