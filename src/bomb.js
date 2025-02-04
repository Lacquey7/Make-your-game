export class Bomb {

    constructor(x, y, flameLength, grid) {
        this.x = x;
        this.y = y;
        this.bombElement = null;
        this.flameLength = flameLength;
        this.grid = grid;  // Utiliser la grille locale
    }

    dropBomb() {
        const divId = document.getElementById("app");

        // Créer un élément div pour la bombe
        const bomb = document.createElement('div');
        bomb.id = "bomb";
        bomb.style.position = 'absolute';
        bomb.style.left = `${this.x - 15}px`;
        bomb.style.top = `${this.y - 15}px`;

        bomb.style.backgroundImage = "url('/assets/img/bomb/dynamite.png')";
        bomb.style.width = "32px";
        bomb.style.height = "32px";
        bomb.style.backgroundPosition = "0px 0px";

        divId.appendChild(bomb);
        this.bombElement = bomb;

        // Lancer l’animation
        this.animateBomb();
    }

    animateBomb() {
        let frame = 2;
        const frameDelay = 400;
        let alternationCount = 6;

        const animate = () => {
            let xOffset;

            if (alternationCount > 0) {
                frame = (frame === 1) ? 0 : 1;
                xOffset = frame * -32;
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
        const divId = document.getElementById("app");

        // Créer la flamme centrale
        this.createFlame(divId, this.x, this.y);

        const directions = [
            { dx: 1, dy: 0, isActive: true },   // Droite
            { dx: -1, dy: 0, isActive: true },  // Gauche
            { dx: 0, dy: 1, isActive: true },   // Bas
            { dx: 0, dy: -1, isActive: true }   // Haut
        ];

        for (let direction of directions) {
            for (let i = 1; i <= this.flameLength; i++) {
                if (!direction.isActive) break;

                const flameX = this.x + direction.dx * i * 32;
                const flameY = this.y + direction.dy * i * 32;

                // Vérifier si la cellule suivante est un obstacle
                if (this.checkFlame(flameX, flameY)) {
                    direction.isActive = false;  // Arrêter la propagation avant l’obstacle
                    break;
                }

                // Créer la flamme si aucune cellule bloquante n’est rencontrée
                setTimeout(() => {
                    this.createFlame(divId, flameX, flameY);
                }, i * 140);
            }
        }
    }

    checkFlame(x, y) {
        const row = Math.floor(y / 32);  // Convertir la position en indices de grille
        const col = Math.floor(x / 32);

        if (row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[row].length) {
            //Détecte si une case unbreakable se trouve a cette coordonnée
            if (this.grid[row][col] === "unbreakable") {
                console.log(`Obstacle unbreakable détecté à (${row}, ${col})`);
                return true;
            }
            //Détecte si une box se trouve a cette coordonnée
            if (this.grid[row][col] === "box") {
                console.log(`Obstacle box détecté à (${row}, ${col})`);
                return true;
            }
            //Détecte si un player se trouve a cette coordonnée
            if (this.grid[row][col] === "player") {
                console.log(`Player détecter à (${row}, ${col}), retrait d'un point de vie`);
                return false;
            }
            //Détecte si un bot se trouve a cette coordonnée
            if (this.grid[row][col] === "bot") {
                console.log(`Bot détecter à (${row}, ${col}), retrait d'un point de vie`);
                return false;
            }

        }
        return false;
    }

    createFlame(parent, x, y) {
        const flame = document.createElement('div');
        flame.style.position = 'absolute';
        flame.style.left = `${x - 16}px`;  // Centrer la flamme sur la cellule
        flame.style.top = `${y - 16}px`;

        flame.style.backgroundImage = "url('/assets/img/bomb/explosion.png')";
        flame.style.width = "32px";
        flame.style.height = "32px";
        flame.style.backgroundPosition = "64px 64px";

        parent.appendChild(flame);

        // Animation de disparition
        setTimeout(() => {
            flame.style.opacity = "0";
        }, this.flameLength * 240);

        // Suppression de la flamme après la transition
        setTimeout(() => {
            if (flame.parentNode) {
                flame.parentNode.removeChild(flame);
            }
        }, 900);
    }

    deleteBomb() {
        if (this.bombElement && this.bombElement.parentNode) {
            this.bombElement.parentNode.removeChild(this.bombElement);
            console.log("Bombe supprimée après l’animation");
        }
    }
}