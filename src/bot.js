export default class Bot {
    constructor() {
        this.element = document.getElementById('bot');
        this.x = 700;
        this.y = 505;
        this.speed = 0;
        this.mapWidth = 800;
        this.mapHeight = 600;

        // Animation
        this.frameX = 0;
        this.frameDelay = 10;
        this.frameCount = 0;
        this.maxFrames = 3;
        this.isMoving = false;
        this.direction = 'down';

        // Pour le mouvement autonome
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
        let sourceY;
        let sourceX;
        if (!this.isMoving || this.speed === 0) {
            sourceY = -50;
            sourceX = -this.frameX * 30.2 - 7.7;
            this.element.style.backgroundPosition = `${-205}px ${-15}px`;
        } else {

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

        if (newX >= 0 && newX <= this.mapWidth - 38) {
            this.x = newX;
        } else {
            this.currentMove = this.getRandomDirection();
        }
        if (newY >= 0 && newY <= this.mapHeight - 58) {
            this.y = newY;
        } else {
            this.currentMove = this.getRandomDirection();
        }

        this.updatePosition();
        this.updateSprite();
    }
}