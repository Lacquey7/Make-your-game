export default class Bonus {
  constructor(player) {
    this.player = player; // Référence à l'élément du joueur
    this.playerInstance = document.querySelector('body').__game.player; // Instance du joueur
    this.hud = document.querySelector('body').__game.HUD; // Instance du HUD
    this.bonuses = document.querySelectorAll('.bonus');
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
        const bonusType = bon.classList[1];
        console.log('bonus detecté:', bonusType);
        this.activateBonus(bonusType);

        // Mettre à jour le score
        this.hud.updateScore(100);

        bon.remove();
      }
    }
  }

  isCollidingBonus(playerRect, bonusRect) {
    return !(
        playerRect.x + playerRect.width < bonusRect.x ||
        playerRect.x > bonusRect.x + bonusRect.width ||
        playerRect.y + playerRect.height < bonusRect.y ||
        playerRect.y > bonusRect.y + bonusRect.height
    );
  }

  activateBonus(bonusType) {
    switch(bonusType) {
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
    }
  }
}