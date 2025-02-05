export class Bomb {
    constructor(x, y, flameLength) {
        this.x = x;
        this.y = y;
        this.bombElement = null;
        this.flameLength = flameLength;
        this.tileSize = 64;  // Taille d'une tuile
    }

    dropBomb() {
        const targetDiv = this.getDivAtPosition(this.x, this.y);

        if (!targetDiv) {
            console.log("Aucune div trouvée à la position spécifiée.");
            return;
        }

        let explosionContainer = targetDiv.querySelector('.explosion-container');
        if (explosionContainer) {
            console.log("Une bombe ou une flamme existe déjà ici. Impossible de poser une autre bombe.");
            return;
        }

        explosionContainer = document.createElement('div');
        explosionContainer.classList.add('explosion-container');
        explosionContainer.style.position = 'relative';
        explosionContainer.style.width = '64px';
        explosionContainer.style.height = '64px';

        targetDiv.appendChild(explosionContainer);

        const bomb = document.createElement('div');
        bomb.classList.add('bomb');
        bomb.style.position = 'absolute';
        bomb.style.backgroundImage = "url('/assets/img/bomb/dynamite.png')";
        bomb.style.width = "32px";
        bomb.style.height = "32px";
        bomb.style.backgroundPosition = "0px 0px";
        bomb.style.transform = "scale(1.5)";
        bomb.style.margin = "auto";
        bomb.style.zIndex = "2";
        bomb.style.left = '16px';
        bomb.style.top = '16px';

        explosionContainer.appendChild(bomb);
        this.bombElement = bomb;

        this.animateBomb();
    }

    animateBomb() {
        let frame = 2;
        const frameDelay = 400;
        let alternationCount = 6;

        const animate = () => {
            if (alternationCount > 0) {
                frame = (frame === 1) ? 0 : 1;
                const xOffset = frame * -64;
                this.bombElement.style.backgroundPosition = `${xOffset}px 0px`;
                alternationCount--;

                setTimeout(() => {
                    requestAnimationFrame(animate);
                }, frameDelay);
            } else {
                this.bombElement.style.backgroundPosition = "0px 0px";
                setTimeout(() => {
                    this.deleteBomb();
                    this.flame();
                }, frameDelay);
            }
        };

        requestAnimationFrame(animate);
    }

    flame() {
        const directions = [
            { dx: 1, dy: 0, isActive: true },
            { dx: -1, dy: 0, isActive: true },
            { dx: 0, dy: 1, isActive: true },
            { dx: 0, dy: -1, isActive: true }
        ];

        this.createFlame(this.getDivAtPosition(this.x, this.y));

        for (let direction of directions) {
            for (let i = 1; i <= this.flameLength; i++) {
                if (!direction.isActive) break;

                const flameX = this.x + direction.dx * i * this.tileSize;
                const flameY = this.y + direction.dy * i * this.tileSize;
                const targetDiv = this.getDivAtPosition(flameX, flameY);

                if (!targetDiv) {
                    direction.isActive = false;
                    break;
                }

                if (this.checkFlame(targetDiv)) {
                    direction.isActive = false;
                    break;
                }


                    this.createFlame(targetDiv);

            }
        }
    }

    checkFlame(targetDiv) {
        if (targetDiv) {
            if (targetDiv.classList.contains("block-unbreakable")) {
                console.log("Obstacle block-unbreakable détecté.");
                return true;
            }
            if (targetDiv.classList.contains("block-breakable")) {
                console.log("Obstacle block-breakable détecté. Destruction du bloc.");
                this.destroyBlock(targetDiv);
                return true;
            }
            if (targetDiv.classList.contains("border")) {
                console.log("Obstacle border détecté.");
                return true;
            }
        }
        return false;
    }

    destroyBlock(targetDiv) {
        targetDiv.classList.remove('block-breakable');
        targetDiv.classList.add('herbe');
        targetDiv.style.backgroundImage = "url('/assets/img/map/herbe2.png')";

        const bonusImage = targetDiv.querySelector('.bonus');
        if (bonusImage) {
            bonusImage.style.display = 'block';
        }
    }

    createFlame(targetDiv) {
        if (!targetDiv) return;

        let explosionContainer = targetDiv.querySelector('.explosion-container');
        if (!explosionContainer) {
            explosionContainer = document.createElement('div');
            explosionContainer.classList.add('explosion-container');
            explosionContainer.style.position = 'relative';
            explosionContainer.style.width = '64px';
            explosionContainer.style.height = '64px';
            targetDiv.appendChild(explosionContainer);
        }

        const existingFlame = explosionContainer.querySelector('.flame');
        if (existingFlame) {
            explosionContainer.removeChild(existingFlame);
        }

        const flame = document.createElement('div');
        flame.classList.add('flame');
        flame.style.position = 'absolute';
        flame.style.backgroundImage = "url('/assets/img/bomb/explosion.png')";
        flame.style.width = "32px";
        flame.style.height = "32px";
        flame.style.backgroundPosition = "64px 64px";
        flame.style.margin = "auto";
        flame.style.scale = "1.3";
        flame.style.zIndex = "0";
        flame.style.left = '16px';
        flame.style.top = '16px';

        explosionContainer.appendChild(flame);

        // Vérifier la collision
        this.checkCollisionWithPlayerOrBot(flame);

        setTimeout(() => {
            flame.style.opacity = "0";
        }, this.flameLength * 240);

        setTimeout(() => {
            flame.remove();
            this.checkAndRemoveContainer(explosionContainer);
        }, 900);
    }

    checkCollisionWithPlayerOrBot(element) {
        const flameRect = element.getBoundingClientRect();
        const player = document.querySelector('#player');
        const bot = document.querySelector('#bot');

        if (player && this.isColliding(flameRect, player.getBoundingClientRect())) {
            console.log("Collision détectée avec le joueur !");
            this.removePlayerLife();
        }

        if (bot && this.isColliding(flameRect, bot.getBoundingClientRect())) {
            console.log("Collision détectée avec le bot !");
            this.removeBotLife();
        }
    }

    isColliding(rect1, rect2) {
        return (
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top
        );
    }

    removePlayerLife() {
        console.log("Vie du joueur -1");
        // playerLives--; ou gestion spécifique de la vie
    }

    removeBotLife() {
        console.log("Vie du bot -1");
        // botLives--; ou gestion spécifique de la vie
    }

    checkAndRemoveContainer(container) {
        const remainingFlames = container.querySelectorAll('.flame');
        if (remainingFlames.length === 0 && container.parentNode) {
            container.remove();
            console.log("Conteneur global supprimé");
        }
    }

    deleteBomb() {
        if (this.bombElement && this.bombElement.parentNode) {
            const explosionContainer = this.bombElement.parentNode;
            this.checkCollisionWithPlayerOrBot(explosionContainer);
            this.bombElement.remove();
            console.log("Bombe supprimée après l'animation");
            this.checkAndRemoveContainer(explosionContainer);
        }
    }

    getDivAtPosition(x, y) {
        const row = Math.floor(y / this.tileSize);
        const col = Math.floor(x / this.tileSize);
        const index = row * 13 + col + 1;

        if (index <= 0) {
            console.log("Position hors de la grille");
            return null;
        }

        return document.querySelector(`.grid-container > div:nth-child(${index})`);
    }
}