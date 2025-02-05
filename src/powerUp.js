export default class Bonus {
  constructor(player) {
    this.player = player; // Référence à l'élément du joueur
    this.bonuses = document.querySelectorAll('.bonus'); // Récupère tous les éléments bonus
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
    if (bonusType === 'Bonus1') {
      console.log('bonus-heart actif');
    } else if (bonusType === 'Bonus2') {
      console.log('bonus-flame actif');
    } else if (bonusType === 'Bonus3') {
      console.log('bonus-speed actif');
    }
  }
}
