export class Bomb {
    constructor(x, y, flameLength) {
        this.x = x;
        this.y = y;
        this.bombElement = null;
        this.flameLength = flameLength;
        this.tileSize = 64;
        this.game = document.querySelector('body').__game; // Accès à l'instance du jeu
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
        let lastTimestamp = 0;
        let accumulatedTime = 0;

        const animate = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = timestamp - lastTimestamp;

            if (!this.game.isPaused) {
                accumulatedTime += deltaTime;

                if (accumulatedTime >= frameDelay) {
                    if (alternationCount > 0) {
                        frame = (frame === 1) ? 0 : 1;
                        const xOffset = frame * -64;
                        this.bombElement.style.backgroundPosition = `${xOffset}px 0px`;
                        alternationCount--;
                        accumulatedTime = 0;
                    } else {
                        this.bombElement.style.backgroundPosition = "0px 0px";
                        setTimeout(() => {
                            if (!this.game.isPaused) {
                                this.deleteBomb();
                                this.flame();
                            } else {
                                // Si le jeu est en pause, on attend la reprise
                                const checkPause = setInterval(() => {
                                    if (!this.game.isPaused) {
                                        this.deleteBomb();
                                        this.flame();
                                        clearInterval(checkPause);
                                    }
                                }, 100);
                            }
                        }, frameDelay);
                        return;
                    }
                }
            }

            lastTimestamp = timestamp;
            requestAnimationFrame(animate);
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

                // Ajout d'une vérification de pause pour la propagation des flammes
                const createFlameWithPauseCheck = () => {
                    if (!this.game.isPaused) {
                        this.createFlame(targetDiv);
                    } else {
                        setTimeout(createFlameWithPauseCheck, 100);
                    }
                };

                setTimeout(createFlameWithPauseCheck, i * 140);
            }
        }
    }

    checkFlame(targetDiv) {
        if (targetDiv) {
            if (targetDiv.classList.contains("block-unbreakable")) {
                return true;
            }
            if (targetDiv.classList.contains("block-breakable")) {
                this.destroyBlock(targetDiv);
                return true;
            }
            if (targetDiv.classList.contains("border")) {
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

        this.checkCollisionWithPlayerOrBot(flame);

        const removeFlame = () => {
            if (!this.game.isPaused) {
                flame.style.opacity = "0";
                setTimeout(() => {
                    if (!this.game.isPaused) {
                        flame.remove();
                        this.checkAndRemoveContainer(explosionContainer);
                    } else {
                        setTimeout(removeFlame, 100);
                    }
                }, 900);
            } else {
                setTimeout(removeFlame, 100);
            }
        };

        setTimeout(removeFlame, this.flameLength * 240);
    }

    // Reste des méthodes inchangées...
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
    }

    removeBotLife() {
        console.log("Vie du bot -1");
    }

    checkAndRemoveContainer(container) {
        const remainingFlames = container.querySelectorAll('.flame');
        if (remainingFlames.length === 0 && container.parentNode) {
            container.remove();
        }
    }

    deleteBomb() {
        if (this.bombElement && this.bombElement.parentNode) {
            const explosionContainer = this.bombElement.parentNode;
            this.checkCollisionWithPlayerOrBot(explosionContainer);
            this.bombElement.remove();
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