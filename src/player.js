export default class Player {
  constructor() {
    this.element = document.getElementById('player');
    this.x = 80;
    this.y = 80;
    this.speed = 5;

    // Animation
    this.frameX = 0;
    this.frameDelay = 10;
    this.frameCount = 0;
    this.maxFrames = 3;
    this.isMoving = false;
    this.direction = 'down';

    // Définir des limites pour la carte (adapter ces valeurs selon votre layout)
    this.mapWidth = 800; // exemple
    this.mapHeight = 600; // exemple

    // Position initiale
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  updateSprite() {
    if (!this.isMoving) {
      // Position statique (image par défaut)
      this.element.style.backgroundPosition = '0px 0';
    } else {
      // Position selon la direction
      let sourceY;
      switch (this.direction) {
        case 'down':
          sourceY = 0;
          break;
        case 'right':
          sourceY = -250;
          break;
        case 'left':
          sourceY = -100;
          break;
        case 'up':
          sourceY = -50;
          break;
        default:
          sourceY = 0;
      }

      this.element.style.backgroundPosition = `${-this.frameX * 56}px ${sourceY}px`;
    }
  }

  // Fonction d'aide pour vérifier si deux rectangles se chevauchent
  isColliding(rect1, rect2) {
    return !(rect1.x + rect1.width <= rect2.x || rect1.x >= rect2.x + rect2.width || rect1.y + rect1.height <= rect2.y || rect1.y >= rect2.y + rect2.height);
  }

  move(keys) {
    let newX = this.x;
    let newY = this.y;
    this.isMoving = false;

    // Calcul du déplacement selon les touches pressées
    if (keys.ArrowLeft) {
      newX -= this.speed;
      this.direction = 'left';
      this.isMoving = true;
    }
    if (keys.ArrowRight) {
      newX += this.speed;
      this.direction = 'right';
      this.isMoving = true;
    }
    if (keys.ArrowUp) {
      newY -= this.speed;
      this.direction = 'up';
      this.isMoving = true;
    }
    if (keys.ArrowDown) {
      newY += this.speed;
      this.direction = 'down';
      this.isMoving = true;
    }

    // Gestion de l'animation
    if (this.isMoving) {
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        this.frameX = (this.frameX + 1) % this.maxFrames;
      }
    } else {
      this.frameX = 0;
    }

    // Récupérer les dimensions du joueur (taille de l'élément)
    const playerWidth = this.element.offsetWidth;
    const playerHeight = this.element.offsetHeight;

    // Récupérer tous les obstacles (div avec class 'unbeakable' et 'box')
    const obstacles = document.querySelectorAll('.block-unbreakable, .border, .block-breakable ');

    // Vérification du déplacement horizontal (pour permettre le glissement le long des obstacles)
    let proposedX = newX;
    const horizontalRect = {
      x: proposedX,
      y: this.y,
      width: playerWidth,
      height: playerHeight,
    };

    for (const obstacle of obstacles) {
      const obstacleRect = {
        x: obstacle.offsetLeft,
        y: obstacle.offsetTop,
        width: obstacle.offsetWidth,
        height: obstacle.offsetHeight,
      };
      if (this.isColliding(horizontalRect, obstacleRect)) {
        // Annule le déplacement horizontal en cas de collision
        proposedX = this.x;
        break;
      }
    }

    // Vérification du déplacement vertical
    let proposedY = newY;
    const verticalRect = {
      x: proposedX, // utiliser la position horizontale déjà validée
      y: proposedY,
      width: playerWidth,
      height: playerHeight,
    };

    for (const obstacle of obstacles) {
      const obstacleRect = {
        x: obstacle.offsetLeft,
        y: obstacle.offsetTop,
        width: obstacle.offsetWidth,
        height: obstacle.offsetHeight,
      };
      if (this.isColliding(verticalRect, obstacleRect)) {
        // Annule le déplacement vertical en cas de collision
        proposedY = this.y;
        break;
      }
    }

    // Appliquer les limites de la carte
    if (proposedX >= 0 && proposedX <= this.mapWidth - playerWidth) {
      this.x = proposedX;
    }
    if (proposedY >= 0 && proposedY <= this.mapHeight - playerHeight) {
      this.y = proposedY;
    }

    this.updatePosition();
    this.updateSprite();
  }
}
