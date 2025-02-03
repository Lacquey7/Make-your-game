class Player {
    constructor() {
        this.x = 50;
        this.y = 50;
        this.sprite = new Image();
        this.sprite.src = './assets/img/player/888.png';
        this.speed = 3;

        // Animation
        this.frameX = 0;
        this.frameY = 0;       // Pour gérer les lignes de direction
        this.frameDelay = 10;
        this.frameCount = 0;
        this.maxFrames = 3;
        this.isMoving = false;
        this.direction = 'down'; // Direction par défaut
    }

    draw(context) {
        if (!this.isMoving) {
            // Position statique
            context.drawImage(
                this.sprite,
                12, 0,
                50, 65,
                this.x, this.y,
                32, 32
            );
        } else {
            // Position selon la direction
            let sourceY;
            switch(this.direction) {
                case 'down':
                    sourceY = 0;  // Première ligne d'animation
                    break;
                case 'right':
                    sourceY = 320; // Deuxième ligne
                    break;
                case 'left':
                    sourceY = 127; // Troisième ligne
                    break;
                case 'up':
                    sourceY = 63; // Quatrième ligne
                    break;
            }

            context.drawImage(
                this.sprite,
                this.frameX * 72, sourceY,   // 72 pixels entre chaque frame
                50, 65,
                this.x, this.y,
                32, 32
            );
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
    }
}