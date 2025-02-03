//1 bordure gauche et droite
//2 bordure du haut et du bas
//3 block pas cassable
//4 herbe
//5 block cassable

export default class Tilemap {
  constructor(map, Countbonus, bonus, totalBlockBreakable) {
    this.map = map;
    this.Countbonus = Countbonus;
    this.bonus = bonus;
    this.totalBlockBreakable = totalBlockBreakable;
    this.imageBordureLeftRight = this.#image('block.png');
    this.imageBordureBackFront = this.#image('bordureRelief.png');
    this.imageBlockUnbreakable = this.#image('bordureRelief.png');
    this.imageHerbe = this.#image('herbe2.png');
    this.imageBlockBreakable = this.#image('block2.png');
    this.imageBonus1 = this.#image('bonus1.png');
    this.imageBonus2 = this.#image('bonus2.png');
    this.imageBonus3 = this.#image('bonus3.png');

    this.tilesInitialized = false;
    this.randomBlockGetBonus = this.randomBlockGetBonus();
    this.currentBlock = 0;
  }

  #image(filename) {
    const img = new Image();
    img.src = 'assets/img/map/' + filename;
    return img;
  }

  draw() {
    const tilemapElement = document.getElementById('tilemap');
    tilemapElement.innerHTML = '';

    if (this.tilesInitialized) return;
    for (let row = 0; row < this.map.length; row++) {
      const tile = this.map[row];
      const tileDiv = document.createElement('div');
      let image = null;
      switch (tile) {
        case 1:
          tileDiv.classList.add('border');
          image = this.imageBordureLeftRight;
          tileDiv.style.backgroundImage = `url(${image.src})`;
          break;
        case 2:
          tileDiv.classList.add('border');
          image = this.imageBordureBackFront;
          tileDiv.style.backgroundImage = `url(${image.src})`;
          break;
        case 3:
          tileDiv.classList.add('block-unbreakable');
          image = this.imageBlockUnbreakable;
          tileDiv.style.backgroundImage = `url(${image.src})`;
          break;
        case 4:
          tileDiv.classList.add('herbe');
          image = this.imageHerbe;
          tileDiv.style.backgroundImage = `url(${image.src})`;
          break;
        case 5:
          tileDiv.classList.add('block-breakable');
          this.currentBlock++;

          console.log(this.randomBlockGetBonus, row, this.currentBlock);

          if (this.randomBlockGetBonus.includes(this.currentBlock)) {
            console.log('bonus', this.currentBlock);
            tileDiv.dataset.breakable = 'true';
            image = this.imageBlockBreakable;
            tileDiv.style.backgroundImage = `url(${image.src})`;
            this.#addRandomBonus(tileDiv);
            tileDiv.addEventListener('click', () => this.destroyBlock(tileDiv));
          } else {
            tileDiv.dataset.breakable = 'true';
            image = this.imageBlockBreakable;
            tileDiv.style.backgroundImage = `url(${image.src})`;
            tileDiv.addEventListener('click', () => this.destroyBlock(tileDiv));
          }
          break;
      }
      tilemapElement.appendChild(tileDiv);
    }
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

  #addRandomBonus(tileDiv) {
    let r = Math.floor(Math.random() * this.bonus.length);
    const bonusImage = document.createElement('img');
    bonusImage.src = 'assets/img/map/' + this.bonus[r] + '.png';
    bonusImage.classList.add('bonus');
    bonusImage.style.display = 'none';
    tileDiv.appendChild(bonusImage);
  }

  destroyBlock(tileDiv) {
    let image = this.imageHerbe;
    tileDiv.style.backgroundImage = `url(${image.src})`;
    tileDiv.dataset.breakable = 'false';
    const bonusImage = tileDiv.querySelector('.bonus');
    console.log(bonusImage);
    if (bonusImage) {
      tileDiv.classList.add('bonus');
      bonusImage.style.display = 'block';
    }
  }
}
