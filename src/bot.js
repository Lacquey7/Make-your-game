import Collision from './collision.js';

export default class Bot {
    constructor() {
        this.element = document.getElementById('bot');
        this.x = 720;
        this.y = 540;
        this.speed = 4;
        this.mapWidth = 832;
        this.mapHeight = 704;

        // Animation properties
        this.frameX = 0;
        this.frameDelay = 10;
        this.frameCount = 0;
        this.maxFrames = 3;
        this.isMoving = false;
        this.direction = 'down';

        // Autonomous movement
        this.moveTimer = 0;
        this.moveDuration = 60;
        this.currentMove = this.getRandomDirection();

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

        const obstacles = document.querySelectorAll('.block-unbreakable, .border, .block-breakable');
        const size = {
            width: this.element.offsetWidth,
            height: this.element.offsetHeight
        };

        // Check horizontal movement
        const horizontalMove = {
            x: newX,
            y: this.y
        };

        if (!Collision.getCollisionWithObstacles(horizontalMove, size, obstacles)) {
            this.x = newX;
        }

        // Check vertical movement
        const verticalMove = {
            x: this.x,
            y: newY
        };

        if (!Collision.getCollisionWithObstacles(verticalMove, size, obstacles)) {
            this.y = newY;
        }

        // Apply map boundaries
        const mapSize = { width: this.mapWidth, height: this.mapHeight };
        const boundedPosition = Collision.checkMapBoundaries(
            { x: this.x, y: this.y },
            size,
            mapSize
        );

        this.x = boundedPosition.x;
        this.y = boundedPosition.y;

        this.updatePosition();
        this.updateSprite();
    }
}