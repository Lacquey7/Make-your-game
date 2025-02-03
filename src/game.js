//1 bordure gauche et droite
//2 block pas cassable
//3 bordure du haut et du bas
//4 herbe
//5 block cassable

import TileMap from './TileMap.js';

const Countbonus = 6;
const bonus = ['bonus1', 'bonus2', 'bonus3'];
const map = [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 4, 4, 4, 4, 5, 5, 4, 4, 4, 4, 4, 1, 1, 4, 4, 2, 3, 4, 2, 3, 3, 4, 4, 4, 1, 1, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 1, 1, 4, 4, 2, 4, 4, 2, 4, 4, 4, 4, 4, 1, 1, 4, 4, 3, 4, 4, 3, 3, 3, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 4, 4, 4, 3, 3, 3, 3, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];

const tileMap = new TileMap(map);
tileMap.draw();

addEventListener('click', () => {
  tileMap.destroyBlock();
});

function randomBonus() {
  return Math.floor(Math.random() * 3);
}

function destroyBlock() {
  const tile = document.getElementsByClassName('tile tile-5');
  console.log('laaa');
  //const randomTile = breakableTiles[Math.floor(Math.random() * breakableTiles.length)];
  randomTile.style.backgroundImage = `url(assets/img/map/${bonus[randomBonus()]}.png)`;
  randomTile.dataset.breakable = 'false';
}
