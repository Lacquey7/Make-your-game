class Bot {
    constructor() {
        this.element = document.getElementById('bot');
        this.x = 500;
        this.y = 200;
        this.speed = 6;

        // Animation
        this.frameX = 0;
        this.frameDelay = 10;
        this.frameCount = 0;
        this.maxFrames = 3;
        this.isMoving = false;
        this.direction = 'down';

        this.map = document.getElementById('map');
        this.mapWidth = 800;
        this.mapHeight = 600;

        // Pour le mouvement autonome
        this.moveTimer = 0;
        this.moveDuration = 60; // Durée d'un mouvement
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
            // Position statique
            this.element.style.backgroundPosition = '35.2px -988';
        } else {
            // Position selon la direction
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

            this.element.style.backgroundPosition =
                `${sourceX}px ${sourceY}px`;
        }
    }
        moveAutonomously()
        {
            let newX = this.x;
            let newY = this.y;
            this.isMoving = true;

            // Change de direction périodiquement
            this.moveTimer++;
            if (this.moveTimer >= this.moveDuration) {
                this.moveTimer = 0;
                this.currentMove = this.getRandomDirection();
            }

            // Sauvegarde la position actuelle
            const oldX = this.x;
            const oldY = this.y;

            // Applique le mouvement selon la direction actuelle
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

            // Animation
            this.frameCount++;
            if (this.frameCount >= this.frameDelay) {
                this.frameCount = 0;
                this.frameX = (this.frameX + 1) % this.maxFrames;
            }

            // Vérifie la collision avant de bouger
            const player = document.querySelector('#player');
            const playerPos = {
                x: parseInt(player.style.left),
                y: parseInt(player.style.top)
            };

            // Si il y a collision avec le joueur, on ne bouge pas
            if (Collision.checkCollision({x: newX, y: newY}, playerPos)) {
                // Revient à l'ancienne position
                newX = oldX;
                newY = oldY;
                // Change de direction
                this.currentMove = this.getRandomDirection();
            }

            // Collisions avec les bords de la map
            if (newX >= 0 && newX <= this.mapWidth - 38) {
                this.x = newX;
            } else {
                // Change de direction si un mur est touché
                this.currentMove = this.getRandomDirection();
            }
            if (newY >= 0 && newY <= this.mapHeight - 58) {
                this.y = newY;
            } else {
                // Change de direction si un mur est touché
                this.currentMove = this.getRandomDirection();
            }

            this.updatePosition();
            this.updateSprite();
        }

}