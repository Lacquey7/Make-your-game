import Game from './game.js';

export default class Bonus {
  constructor(player, playerElement, obstacles) {
    this.playerElement = playerElement; // Référence à l'élément du joueur
    this.player = player; // Référence à l'élément du joueur
    this.playerInstance = document.querySelector('body').__game.player; // Instance du joueur
    this.hud = document.querySelector('body').__game.HUD; // Instance du HUD
    this.items = document.querySelectorAll('.bonus, .key, .porte');
    this.key = document.querySelectorAll('.key');
    this.obstacles = obstacles;
  }

  checkCollisions() {
    const playerRect = this.player.getBoundingClientRect();

    for (const item of this.items) {
      let itemRect = item.getBoundingClientRect();

      const playerCollisionRect = {
        x: playerRect.left + playerRect.width * 0.2,
        y: playerRect.top + playerRect.height * 0.2,
        width: playerRect.width * 0.6,
        height: playerRect.height * 0.6,
      };

      if (this.isCollidingBonus(playerCollisionRect, itemRect)) {
        const bonusType = item.classList[1];
        const key = item.className;
        const porte = item.className;
        if (key === 'key') {
          this.activateBonus(key);
          item.remove();
        } else if (porte === 'porte') {
          if (this.playerInstance.getKey === 1) {
            this.animatePorte();
            new Game().nextLevel();
          } else {
            console.log('verrouiller');
          }
        } else {
          this.activateBonus(bonusType);
          item.remove();
        }
        // Mettre à jour le score
        this.hud.updateScore(100);
      }
    }
  }

  isCollidingBonus(playerRect, bonusRect) {
    return !(playerRect.x + playerRect.width < bonusRect.x || playerRect.x > bonusRect.x + bonusRect.width || playerRect.y + playerRect.height < bonusRect.y || playerRect.y > bonusRect.y + bonusRect.height);
  }

  activateBonus(bonusType) {
    switch (bonusType) {
      case 'Bonus1': // Bonus vie
        this.playerInstance.speed = Math.min(this.playerInstance.speed + 0.5, 8);
        this.hud.updateSpeed();
        break;

      case 'Bonus2': // Bonus flamme
        this.playerInstance.flame = Math.min(this.playerInstance.flame + 1, 6);
        this.hud.updateFlame();
        break;

      case 'Bonus3': // Bonus vitesse
        this.playerInstance.life = Math.min(this.playerInstance.life + 1, 4);
        this.hud.updateLife();
        break;
      case 'key':
        this.playerInstance.getKey++;
        this.hud.updateKey();
        break;
    }
  }

  setPorteStyles(porteDiv) {
    Object.assign(porteDiv.style, {
      width: '32px',
      height: '32px',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    });
  }

  animatePorte() {
    const porte = document.querySelector('.porte');
    const images = ['assets/img/map/porte1.png', 'assets/img/map/porte2.png', 'assets/img/map/porte3.png', 'assets/img/map/porte4.png'];
    this.animateP(porte, images);
  }

  animateP(porte, images) {
    this.setPorteStyles(porte);
    let index = 0;
    const interval = setInterval(() => {
      porte.style.backgroundImage = `url(${images[index]})`;
      index++;
      if (index >= images.length) {
        clearInterval(interval);
      }
    }, 150);
  }
}
