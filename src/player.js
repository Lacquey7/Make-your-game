export default class Player {
    constructor() {
        this.element = document.getElementById('player');
        this.x = 60;
        this.y = 60;
        this.speed = 5;
        this.mapWidth = 800;
        this.mapHeight = 600;

        // Animation
        this.frameX = 0;
        this.frameDelay = 10;
        this.frameCount = 0;
        this.maxFrames = 3;
        this.isMoving = false;
        this.direction = 'down';

        // Position initiale
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    updateSprite() {
        if (!this.isMoving) {
            // Position statique
            this.element.style.backgroundPosition = '0px 0';
        } else {
            // Position selon la direction
            let sourceY;
            switch(this.direction) {
                case 'down':
                    sourceY = -0;
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
            }

            this.element.style.backgroundPosition =
                `${-this.frameX * 56}px ${sourceY}px`;
        }
    }

    move(keys) {
        let newX = this.x;
        let newY = this.y;
        this.isMoving = false;

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

        if (this.isMoving) {
            this.frameCount++;
            if (this.frameCount >= this.frameDelay) {
                this.frameCount = 0;
                this.frameX = (this.frameX + 1) % this.maxFrames;
            }
        } else {
            this.frameX = 0;
        }

        // Collisions avec les bords de la map
        if (newX >= 0 && newX <= this.mapWidth - 32) {
            this.x = newX;
        }
        if (newY >= 0 && newY <= this.mapHeight - 58) {
            this.y = newY;
        }

        this.updatePosition();
        this.updateSprite();
    }
}