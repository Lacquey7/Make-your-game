export default class Bonus {
  constructor(player, playerElement) {
    this.playerElement = playerElement; // Référence à l'élément du joueur
    this.player = player; // Référence à l'élément du joueur
    this.bonuses = document.querySelectorAll('.bonus'); // Récupère tous les éléments bonus
    this.heart = new Heart(this.playerElement);
  }

  checkCollisions() {
    const playerRect = this.player.getBoundingClientRect();

    for (const bon of this.bonuses) {
      let bonRect = bon.getBoundingClientRect();

      const playerCollisionRect = {
        x: playerRect.left + playerRect.width * 0.2,
        y: playerRect.top + playerRect.height * 0.2,
        width: playerRect.width * 0.6,
        height: playerRect.height * 0.6,
      };

      if (this.isCollidingBonus(playerCollisionRect, bonRect)) {
        console.log('bonus detecté:', bon.classList[1]);
        this.activateBonus(bon.classList[1]);
        bon.remove(); // Retire le bonus du jeu
      }
    }
  }

  isCollidingBonus(playerRect, bonusRect) {
    return !(playerRect.x + playerRect.width < bonusRect.x || playerRect.x > bonusRect.x + bonusRect.width || playerRect.y + playerRect.height < bonusRect.y || playerRect.y > bonusRect.y + bonusRect.height);
  }

  activateBonus(bonusType) {
    switch (bonusType) {
      case 'Bonus1':
        console.log('bonus-speed activé');
        console.log('vitesse actuelle:', this.playerElement.speed);
        this.playerElement.speed++;
        console.log('nouvelle vitesse:', this.playerElement.speed);
        break;
      case 'Bonus2':
        console.log('bonus-fire activé');
        console.log('nombre de bombes actuelles:', this.playerElement.flame);
        this.playerElement.flame++;
        console.log('nouveau nombre de bombes:', this.playerElement.flame);
        break;
      case 'Bonus3':
        console.log('bonus-heart activé');
        console.log('nombre de vies actuelles:', this.playerElement.life);
        this.playerElement.life++;
        console.log('nouveau nombre de vies:', this.playerElement.life);
        this.heart.addHeart();
        break;
    }
  }
}

export class Heart {
  constructor(playerElement) {
    this.playerElement = playerElement;
  }

  setHeartStyles(heartDiv) {
    Object.assign(heartDiv.style, {
      width: '64px',
      height: '64px',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    });
  }

  animateHeart(heartDiv, images) {
    this.setHeartStyles(heartDiv);
    let index = 0;
    const interval = setInterval(() => {
      heartDiv.style.backgroundImage = `url(${images[index]})`;
      index++;
      if (index >= images.length) clearInterval(interval);
    }, 150);
  }

  animateHeartRemove(heartDiv) {
    const images = ['assets/img/background/heart1.png', 'assets/img/background/heart2.png', 'assets/img/background/heart3.png', 'assets/img/background/heart4.png', 'assets/img/background/heart5.png'];
    this.animateHeart(heartDiv, images);
  }

  animateHeartAdd(heartDiv) {
    const images = ['assets/img/background/heart5.png', 'assets/img/background/heart4.png', 'assets/img/background/heart3.png', 'assets/img/background/heart2.png', 'assets/img/background/heart1.png'];
    this.animateHeart(heartDiv, images);
  }

  removeHeart() {
    const heartDiv = document.querySelector(`.heart-${this.playerElement.life}`);
    if (heartDiv) {
      heartDiv.style.backgroundImage = 'none';
      this.animateHeartRemove(heartDiv);
    }
  }

  addHeart() {
    let heartDiv = document.querySelector(`.heart-${this.playerElement.life}`);
    if (!heartDiv) {
      console.log('full life');
      heartDiv = document.createElement('div');
      heartDiv.classList.add(`heart-${this.playerElement.life}`);
      document.querySelector('.heart-body').appendChild(heartDiv);
    }
    heartDiv.style.backgroundImage = 'none';
    this.animateHeartAdd(heartDiv);
  }
}
