import { getLevel } from './game.js';

export default class TileMap {
  constructor(map, Countbonus, bonus, totalBlockBreakable, cleCurrent, totalBlockHerbe) {
    this.map = map;
    this.Countbonus = Countbonus;
    this.bonus = bonus;
    this.cleCurrent = cleCurrent;
    this.totalBlockBreakable = totalBlockBreakable;

    // this.imageB1 = this.#image('back/b1.png');
    // this.imageB4 = this.#image('back/b4.png');
    // this.imageB9 = this.#image('back/b9.png');
    // this.imageB14 = this.#image('back/b14.png');
    // this.imageB10 = this.#image('back/b10.png');
    // this.imageB11 = this.#image('back/b11.png');
    // this.imageB3 = this.#image('back/b3.png');
    // this.imageB15 = this.#image('back/b15.png');
    // this.imageB16 = this.#image('back/b16.png');
    // this.imageB17 = this.#image('back/b17.png');
    // this.image5 = this.#image('back/b5.png');
    // this.imageB18 = this.#image('back/b18.png');
    // this.imageB19 = this.#image('back/b19.png');
    // this.imageB20 = this.#image('back/b20.png');
    // this.imgeB6 = this.#image('back/b6.png');
    // this.imageB8 = this.#image('back/b8.png');

    this.imageBordureLeftRight = this.#image('block.png');
    this.imageBordureBackFront = this.#image('bordureRelief.png');
    this.imageBlockUnbreakable = this.#image('bordureRelief.png');
    this.imageHerbe = this.#image(`herbe${1 + getLevel()}.png`);
    this.imageBlockBreakable = this.#image('block2.png');
    this.imageBonus1 = this.#image('speed.png');
    this.imageBonus2 = this.#image('power.png');
    this.imageBonus3 = this.#image('heart.png');
    this.imageKey = this.#image('keyOrigin.png');
    this.imagePorte = this.#image('t.png');

    this.tilesInitialized = false;
    this.randomBlockGetBonus = this.randomBlockGetBonus();
    this.randomBlockGetKey = this.randomBlockGetKey(this.randomBlockGetBonus);

    this.totalBlockHerbe = totalBlockHerbe;
    this.level = getLevel();
    this.currentBlock = 0;
    this.currentHerbe = 0;
  }

  #image(filename) {
    const img = new Image();
    img.src = 'assets/img/map/' + filename;
    return img;
  }

  draw() {
    const tilemapElement = document.getElementById('tilemap');

    const playerElement = document.getElementById('player');
    const botElement = document.getElementById('bot');

    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');

    if (this.tilesInitialized) return;
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        const tile = this.map[row][col];
        const tileDiv = document.createElement('div');
        let image = null;
        switch (tile) {
          case 1:
            image = this.imageBordureLeftRight;
            this.getTileAtBordure(tileDiv, image);
            break;
          case 2:
            image = this.imageBordureBackFront;
            this.getTileAtBordure(tileDiv, image);
            break;
          case 3:
            image = this.imageBlockUnbreakable;
            this.getTileBlockUnbreakable(tileDiv, image);
            break;
          case 4:
            this.currentHerbe++;
            if (this.currentHerbe === this.totalBlockHerbe - 1) {
              image = this.imageHerbe;
              this.getTileAtHerbe(tileDiv, image);
              image = this.imagePorte;
              this.createPorte(tileDiv, image);
            } else {
              image = this.imageHerbe;
              this.getTileAtHerbe(tileDiv, image);
            }
            break;

          case 5:
            image = this.imageBlockBreakable;
            this.currentBlock++;
            if (this.randomBlockGetBonus.includes(this.currentBlock)) {
              this.getTileBlockBreakable(tileDiv, image, this.#addRandomBonus(tileDiv));
              tileDiv.addEventListener('click', () => this.destroyBlock(tileDiv));
            } else if (this.randomBlockGetKey.includes(this.currentBlock)) {
              this.getTileBlockBreakable(tileDiv, image, this.#addRandomKey(tileDiv));
              tileDiv.addEventListener('click', () => this.destroyBlock(tileDiv));
            } else {
              this.getTileBlockBreakable(tileDiv, image);
              tileDiv.addEventListener('click', () => this.destroyBlock(tileDiv));
            }
            break;
        }
        gridContainer.appendChild(tileDiv);
      }
    }

    // Vider le tilemap
    tilemapElement.innerHTML = '';

    // Ajouter la grille
    tilemapElement.appendChild(gridContainer);

    // Réajouter les éléments player et bot
    if (playerElement) tilemapElement.appendChild(playerElement);
    if (botElement) tilemapElement.appendChild(botElement);

    this.tilesInitialized = true;
  }

  randomBlockGetBonus() {
    let tab = [];
    for (let i = 0; i < this.Countbonus; i++) {
      let r = Math.floor(Math.random() * this.totalBlockBreakable) + 1;
      if (!tab.includes(r)) {
        tab.push(r);
      } else {
        i--;
      }
    }
    return tab;
  }

  randomBlockGetKey(tabBonus) {
    let tab = [];
    let r;
    do {
      r = Math.floor(Math.random() * this.totalBlockBreakable) + 1;
    } while (tabBonus.includes(r) || tab.includes(r));
    tab.push(r);
    return tab;
  }

  #addRandomKey(tileDiv) {
    let image = this.imageKey;
    const keyImage = document.createElement('div');
    keyImage.style.backgroundImage = `url(${image.src})`;
    keyImage.classList.add('key');
    tileDiv.style.position = 'relative';

    keyImage.style.display = 'none';
    tileDiv.appendChild(keyImage);
  }

  #addRandomBonus(tileDiv) {
    let r = Math.floor(Math.random() * this.bonus.length);
    const bonusImage = document.createElement('div');

    bonusImage.classList.add('bonus', this.bonus[r]);
    bonusImage.style.display = 'none';

    tileDiv.style.position = 'relative';
    tileDiv.appendChild(bonusImage);
  }

  destroyBlock(tileDiv) {
    let image = this.imageHerbe;
    tileDiv.style.backgroundImage = `url(${image.src})`;
    tileDiv.dataset.breakable = 'false';
    tileDiv.classList.remove('block-breakable');
    tileDiv.classList.add('herbe');
    const bonusImage = tileDiv.querySelector('.bonus');
    const keyImage = tileDiv.querySelector('.key');
    if (bonusImage) {
      tileDiv.classList.remove('block-breakable');
      bonusImage.style.display = 'block';
    } else if (keyImage) {
      tileDiv.classList.remove('block-breakable');
      keyImage.style.display = 'block';
    }
  }

  getTileAtBordure(tileDiv, image) {
    tileDiv.classList.add('border');
    tileDiv.style.backgroundImage = `url(${image.src})`;
  }

  getTileAtHerbe(tileDiv, image) {
    tileDiv.classList.add('herbe');
    tileDiv.style.backgroundImage = `url(${image.src})`;
  }
  getTileBlockBreakable(tileDiv, image) {
    tileDiv.classList.add('block-breakable');
    tileDiv.dataset.breakable = 'true';
    tileDiv.style.backgroundImage = `url(${image.src})`;
  }

  getTileBlockUnbreakable(tileDiv, image) {
    tileDiv.classList.add('block-unbreakable');
    tileDiv.style.backgroundImage = `url(${image.src})`;
  }
  createPorte(tileDiv, image) {
    const porteDiv = document.createElement('div');
    porteDiv.classList.add('porte');
    tileDiv.style.position = 'relative';
    porteDiv.style.backgroundImage = `url(${image.src})`;
    tileDiv.appendChild(porteDiv);
    porteDiv.style.backgroundPosition = '-145px -95px';
    // porteDiv.style.backgroundPosition = '-200px -156px';

    //porteDiv.style.backgroundPosition = '-145px -159px';
    //porteDiv.style.backgroundPosition = '-145px -223px';
    //porteDiv.style.backgroundPosition = '-100px -220px';
  }
}
