export default class Bonus {
  constructor(player, playerElement) {
    this.playerElement = playerElement; // Référence à l'élément du joueur
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
        break;
    }
  }
}
