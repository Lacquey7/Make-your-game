class Player {
    constructor() {
        this.element = document.getElementById('player');
        this.x = 50;
        this.y = 50;
        this.speed = 2;

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
            this.element.style.backgroundPosition = '-12px 0';
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
                    sourceY = -98;
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
        this.isMoving = false;

        if (keys.ArrowLeft) {
            this.x -= this.speed;
            this.direction = 'left';
            this.isMoving = true;
        }
        if (keys.ArrowRight) {
            this.x += this.speed;
            this.direction = 'right';
            this.isMoving = true;
        }
        if (keys.ArrowUp) {
            this.y -= this.speed;
            this.direction = 'up';
            this.isMoving = true;
        }
        if (keys.ArrowDown) {
            this.y += this.speed;
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

        this.updatePosition();
        this.updateSprite();
    }
}