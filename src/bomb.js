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

        // Vérifier si un conteneur existe déjà dans cette div
        let explosionContainer = targetDiv.querySelector('.explosion-container');
        if (explosionContainer) {
            console.log("Une bombe ou une flamme existe déjà ici. Impossible de poser une autre bombe.");
            return;
        }

        // Créer un conteneur global pour la bombe et les flammes
        explosionContainer = document.createElement('div');
        explosionContainer.classList.add('explosion-container');
        explosionContainer.style.position = 'relative';
        explosionContainer.style.width = '64px';
        explosionContainer.style.height = '64px';

        targetDiv.appendChild(explosionContainer);

        // Créer un élément div pour la bombe
        const bomb = document.createElement('div');
        bomb.classList.add('bomb');
        bomb.style.position = 'absolute';
        bomb.style.backgroundImage = "url('/assets/img/bomb/dynamite.png')";
        bomb.style.width = "32px";
        bomb.style.height = "32px";
        bomb.style.backgroundPosition = "0px 0px";
        bomb.style.transform = "scale(1.5)";
        bomb.style.margin = "auto";
        bomb.style.zIndex = "2";  // La bombe doit être au-dessus de la flamme
        bomb.style.left = '16px';  // Centrer dans le conteneur (32px de largeur, 64px de conteneur)
        bomb.style.top = '16px';

        explosionContainer.appendChild(bomb);
        this.bombElement = bomb;

        // Lancer l'animation
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
            { dx: 1, dy: 0, isActive: true },   // Droite
            { dx: -1, dy: 0, isActive: true },  // Gauche
            { dx: 0, dy: 1, isActive: true },   // Bas
            { dx: 0, dy: -1, isActive: true }   // Haut
        ];

        // Flamme centrale
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

                setTimeout(() => {
                    this.createFlame(targetDiv);
                }, i * 140);
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
                this.destroyBlock(targetDiv);  // Détruire le bloc cassable
                return true;  // Arrêter la propagation après avoir détruit le bloc
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
        targetDiv.style.backgroundImage = "url('/assets/img/map/herbe2.png')";  // Image de fond de l’herbe

        // Si un bonus est caché sous le bloc, l'afficher
        const bonusImage = targetDiv.querySelector('.bonus');
        if (bonusImage) {
            bonusImage.style.display = 'block';
        }
    }

    createFlame(targetDiv) {
        if (!targetDiv) return;

        // Vérifier s'il y a déjà un conteneur global, sinon le créer
        let explosionContainer = targetDiv.querySelector('.explosion-container');
        if (!explosionContainer) {
            explosionContainer = document.createElement('div');
            explosionContainer.classList.add('explosion-container');
            explosionContainer.style.position = 'relative';
            explosionContainer.style.width = '64px';
            explosionContainer.style.height = '64px';
            targetDiv.appendChild(explosionContainer);
        }

        // Supprimer l'ancienne flamme s'il y en a déjà une
        const existingFlame = explosionContainer.querySelector('.flame');
        if (existingFlame) {
            explosionContainer.removeChild(existingFlame);
        }

        // Créer une nouvelle flamme
        const flame = document.createElement('div');
        flame.classList.add('flame');
        flame.style.position = 'absolute';  // Position absolue pour gérer le z-index
        flame.style.backgroundImage = "url('/assets/img/bomb/explosion.png')";
        flame.style.width = "32px";
        flame.style.height = "32px";
        flame.style.backgroundPosition = "64px 64px";
        flame.style.margin = "auto";
        flame.style.scale = "1.3";
        flame.style.zIndex = "0";  // La flamme est en arrière-plan
        flame.style.left = '16px';  // Centrer la flamme
        flame.style.top = '16px';

        explosionContainer.appendChild(flame);

        setTimeout(() => {
            flame.style.opacity = "0";
        }, this.flameLength * 240);

        setTimeout(() => {
            flame.remove();  // Supprimer la flamme elle-même
            this.checkAndRemoveContainer(explosionContainer);  // Vérifier et supprimer le conteneur si nécessaire
        }, 900);
    }

    deleteBomb() {
        if (this.bombElement && this.bombElement.parentNode) {
            const explosionContainer = this.bombElement.parentNode;
            this.bombElement.remove();
            console.log("Bombe supprimée après l'animation");

            // Supprimer le conteneur global si toutes les flammes sont terminées
            this.checkAndRemoveContainer(explosionContainer);
        }
    }

    checkAndRemoveContainer(container) {
        // Vérifie s'il reste des flammes dans le conteneur
        const remainingFlames = container.querySelectorAll('.flame');
        if (remainingFlames.length === 0 && container.parentNode) {
            container.remove();  // Supprime le conteneur si aucune flamme n'est présente
            console.log("Conteneur global supprimé");
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

        const targetDiv = document.querySelector(`.grid-container > div:nth-child(${index})`);
        return targetDiv;
    }
}