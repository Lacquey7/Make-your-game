export default class Tilemap {
  constructor(map) {
    this.map = map;
    this.imageCol = this.#image('block.png');
    this.imageBackFront = this.#image('bordureRelief.png');
    this.imageBlock = this.#image('blockRelief.png');
    this.imageHerbe = this.#image('herbe.png');
    this.imageBlockBreakable = this.#image('blockBreakable.png');
    this.tilesInitialized = false; // Pour éviter de recréer en boucle
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
      tileDiv.classList.add('tile', `tile-${tile}`);
      let image = null;
      switch (tile) {
        case 1:
          image = this.imageCol;
          tileDiv.style.backgroundImage = `url(${image.src})`;
          break;
        case 2:
          image = this.imageCol;
          tileDiv.style.backgroundImage = `url(${image.src})`;
          break;
        case 3:
          image = this.imageBackFront;
          tileDiv.style.backgroundImage = `url(${image.src})`;
          break;
        case 4:
          image = this.imageHerbe;
          tileDiv.style.backgroundImage = `url(${image.src})`;
          break;
        case 5:
          tileDiv.dataset.breakable = 'true';
          image = this.imageBlockBreakable;
          tileDiv.style.backgroundImage = `url(${image.src})`;
          break;
      }
      tilemapElement.appendChild(tileDiv);
    }
    this.tilesInitialized = true;
  }
}
