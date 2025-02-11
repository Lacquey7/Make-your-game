import Game from './game.js';

export default class Bonus {
  constructor(player, playerElement, obstacles) {
    const game = document.querySelector('body').__game;
    if (!game) {
      throw new Error('Game instance not found');
    }

    this.playerElement = playerElement; // Référence à l'élément du joueur
    if (!this.playerElement) {
      throw new Error('Player element not found');
    }

    this.player = player; // Référence à l'élément du joueur
    if (!this.player) {
      throw new Error('Player instance not found');
    }
    this.playerInstance = game.player; // Instance du joueur
    this.hud = game.HUD; // Instance du HUD
    this.items = document.querySelectorAll('.bonus, .key, .porte');
    this.key = document.querySelectorAll('.key');
    this.obstacles = obstacles;

    this.lastCollisionCheck = 0;
    this.collisionCooldown = 1000; // 1 second cooldown
    this.isProcessingCollision = false; // New flag
  }

  checkCollisions() {
    const now = Date.now();
    if (now - this.lastCollisionCheck < this.collisionCooldown || this.isProcessingCollision) {
      return; // Skip if cooldown not elapsed or already processing
    }

    this.lastCollisionCheck = now;
    this.isProcessingCollision = true;

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
        const itemToRemove = item;

        requestAnimationFrame(() => {
          if (key === 'key') {
            this.activateBonus(key);
            itemToRemove.remove();
            this.hud.updateScore(100);
          } else if (porte === 'porte') {
            console.log(this.playerInstance.getKey);
            if (this.playerInstance.getKey === 1) {
              this.animateCoffre(); // Start chest animation
              setTimeout(() => {
                document.querySelector('body').__game.nextLevel();
              }, 600); // Wait for animation to complete
            } else {
              this.showItemsLocked();
            }
          } else {
            this.activateBonus(bonusType);
            itemToRemove.remove();
            this.hud.updateScore(100);
          }

          setTimeout(() => {
            this.isProcessingCollision = false;
          }, this.collisionCooldown);
        });

        break;
      }
      if (!this.isCollidingBonus(playerCollisionRect, itemRect)) {
        this.isProcessingCollision = false;
      }
    }
  }

  isCollidingBonus(playerRect, bonusRect) {
    return !(playerRect.x + playerRect.width < bonusRect.x || playerRect.x > bonusRect.x + bonusRect.width || playerRect.y + playerRect.height < bonusRect.y || playerRect.y > bonusRect.y + bonusRect.height);
  }

  activateBonus(bonusType) {
    switch (bonusType) {
      case 'Bonus1': // Bonus speed ;
        this.playerInstance.speed = Math.min(this.playerInstance.speed + 0.5, 8);
        this.hud.updateSpeed();
        break;

      case 'Bonus2': // Bonus flamme
        this.playerInstance.flame = Math.min(this.playerInstance.flame + 1, 6);
        this.hud.updateFlame();
        break;

      case 'Bonus3': // Bonus life
        if (this.playerInstance.life === 4) {
          console.log('max life');
          this.showFullLifeMessage();
        }
        this.playerInstance.life = Math.min(this.playerInstance.life + 1, 4);
        console.log(this.playerInstance.life);
        this.hud.updateHearts();
        break;
      case 'key':
        this.playerInstance.getKey++;
        this.hud.updateKey();
        break;
    }
  }
  showFullLifeMessage() {
    // Créer l'élément du message
    const message = document.createElement('div');
    message.textContent = 'Full Life';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.fontSize = '24px';
    message.style.fontWeight = 'bold';
    message.style.color = 'red';
    message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    message.style.padding = '10px';
    message.style.borderRadius = '10px';
    message.style.zIndex = '1000';

    // Ajouter l'élément à la page
    document.body.appendChild(message);

    // Supprimer le message après 2 secondes
    setTimeout(() => {
      message.remove();
    }, 2000);
  }

  showItemsLocked() {
    // Créer l'élément du message
    const message = document.createElement('div');
    message.textContent = 'Pas de clé';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.fontSize = '24px';
    message.style.fontWeight = 'bold';
    message.style.color = 'red';
    message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    message.style.padding = '10px';
    message.style.borderRadius = '10px';
    message.style.zIndex = '1000';

    // Ajouter l'élément à la page
    document.body.appendChild(message);

    // Supprimer le message après 2 secondes
    setTimeout(() => {
      message.remove();
    }, 2000);
  }

  animateCoffre() {
    const porte = document.querySelector('.porte');
    if (!porte) return;

    // Chest sprite positions in the sprite sheet
    const frames = [
      '-145px -95px', // Frame 1
      '-145px -159px', // Frame 2
      '-145px -223px', // Frame 3
    ];

    let frameIndex = 0;
    const animationInterval = setInterval(() => {
      porte.style.backgroundPosition = frames[frameIndex];
      frameIndex++;

      if (frameIndex >= frames.length) {
        clearInterval(animationInterval);
      }
    }, 150); // Change frame every 150ms
  }
}

//   setPorteStyles(porteDiv) {
//     Object.assign(porteDiv.style, {
//       width: '32px',
//       height: '32px',
//       backgroundSize: 'cover',
//       backgroundRepeat: 'no-repeat',
//     });
//   }

//   animatePorte() {
//     const porte = document.querySelector('.porte');
//     const images = ['assets/img/map/porte1.png', 'assets/img/map/porte2.png', 'assets/img/map/porte3.png', 'assets/img/map/porte4.png'];
//     this.animateP(porte, images);
//   }

//   animateP(porte, images) {
//     this.setPorteStyles(porte);
//     let index = 0;
//     const interval = setInterval(() => {
//       porte.style.backgroundImage = `url(${images[index]})`;
//       index++;
//       if (index >= images.length) {
//         clearInterval(interval);
//       }
//     }, 150);
//   }
// }
