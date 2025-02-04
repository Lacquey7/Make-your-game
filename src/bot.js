export default class Bot {
    constructor() {
        this.element = document.getElementById('bot');
        this.x = 720;
        this.y = 540;
        this.speed = 2;
        this.mapWidth = 832;
        this.mapHeight = 704;

        // Animation
        this.frameX = 0;
        this.frameDelay = 10;
        this.frameCount = 0;
        this.maxFrames = 3;
        this.isMoving = false;
        this.direction = 'down';

        // Mouvement autonome
        this.moveTimer = 0;
        this.moveDuration = 60;
        this.currentMove = this.getRandomDirection();

        // Position initiale
        this.updatePosition();
    }

    getRandomDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    updateSprite() {
        if (!this.isMoving) {
            this.element.style.backgroundPosition = '35.2px -988';
        } else {
            let sourceY;
            let sourceX;
            switch (this.direction) {
                case 'down':
                    sourceY = -988;
                    sourceX = -this.frameX * 30.2 - 7.7;
                    break;
                case 'right':
                    sourceY = -988;
                    sourceX = -this.frameX * 29.6 - 193.9;
                    break;
                case 'left':
                    sourceY = -300;
                    sourceX = -this.frameX * 29.9 - 147.9;
                    break;
                case 'up':
                    sourceY = -988;
                    sourceX = -this.frameX * 30.7 - 99;
                    break;
            }
            this.element.style.backgroundPosition = `${sourceX}px ${sourceY}px`;
        }
    }

    moveAutonomously() {
        let newX = this.x;
        let newY = this.y;
        this.isMoving = true;

        this.moveTimer++;
        if (this.moveTimer >= this.moveDuration) {
            this.moveTimer = 0;
            this.currentMove = this.getRandomDirection();
        }

        switch (this.currentMove) {
            case 'left':
                newX -= this.speed;
                this.direction = 'left';
                break;
            case 'right':
                newX += this.speed;
                this.direction = 'right';
                break;
            case 'up':
                newY -= this.speed;
                this.direction = 'up';
                break;
            case 'down':
                newY += this.speed;
                this.direction = 'down';
                break;
        }

        this.frameCount++;
        if (this.frameCount >= this.frameDelay) {
            this.frameCount = 0;
            this.frameX = (this.frameX + 1) % this.maxFrames;
        }

        // Vérification des collisions horizontales
        newX = this.checkCollisions(newX, this.y, this.element.offsetWidth, this.element.offsetHeight) ? this.x : newX;

        // Vérification des collisions verticales
        newY = this.checkCollisions(this.x, newY, this.element.offsetWidth, this.element.offsetHeight) ? this.y : newY;

        // Appliquer les nouvelles positions si elles sont dans les limites de la carte
        if (newX >= 0 && newX <= this.mapWidth - this.element.offsetWidth) {
            this.x = newX;
        }
        if (newY >= 0 && newY <= this.mapHeight - this.element.offsetHeight) {
            this.y = newY;
        }

        this.updatePosition();
        this.updateSprite();
    }

    checkCollisions(newX, newY, width, height) {
        const obstacles = document.querySelectorAll('.block-unbreakable, .border, .block-breakable');
        const botRect = { x: newX, y: newY, width: width, height: height };

        for (const obstacle of obstacles) {
            const obstacleRect = {
                x: obstacle.offsetLeft,
                y: obstacle.offsetTop,
                width: obstacle.offsetWidth,
                height: obstacle.offsetHeight,
            };
            if (this.isColliding(botRect, obstacleRect)) {
                return true; // Collision détectée
            }
        }
        return false; // Pas de collision
    }

    isColliding(rect1, rect2) {
        return !(
            rect1.x + rect1.width <= rect2.x ||
            rect1.x >= rect2.x + rect2.width ||
            rect1.y + rect1.height <= rect2.y ||
            rect1.y >= rect2.y + rect2.height
        );
    }
}