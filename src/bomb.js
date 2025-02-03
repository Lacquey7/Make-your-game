export class Bomb {
    constructor(x, y, flameLength) {
        this.x = x;
        this.y = y;
        this.bombElement = null;  // Référence au div de la bombe
        this.flameLength = flameLength;  // Utilisation correcte de flameLength
    }

    dropBomb() {
        const divId = document.getElementById("app");

        // Créer un élément div pour la bombe
        const bomb = document.createElement('div');
        bomb.id = "bomb";
        bomb.style.position = 'absolute';
        bomb.style.left = `${this.x - 15}px`;
        bomb.style.top = `${this.y - 15}px`;

        // Image de fond
        bomb.style.backgroundImage = "url('/assets/img/bomb/dynamite.png')";
        bomb.style.width = "32px";
        bomb.style.height = "32px";
        bomb.style.backgroundPosition = "0px 0px";

        bomb.style.transform = "scale(1)";
        bomb.style.transformOrigin = "top left";

        divId.appendChild(bomb);

        this.bombElement = bomb;

        // Lancer l’animation
        this.animateBomb();
    }

    animateBomb() {
        let frame = 2;  // Commence à la troisième image
        const frameDelay = 400;  // Délai entre chaque frame
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
            { dx: 1, dy: 0 },   // Droite
            { dx: -1, dy: 0 },  // Gauche
            { dx: 0, dy: 1 },   // Bas
            { dx: 0, dy: -1 }   // Haut
        ];

        // Créer les flammes dans chaque direction avec des délais progressifs selon la distance
        for (const { dx, dy } of directions) {
            for (let i = 1; i <= this.flameLength; i++) {
                const flameX = this.x + dx * i * 32;
                const flameY = this.y + dy * i * 32;
                const delay =  i* 140;  // Plus la distance est grande, plus le délai est long
                this.createFlame(divId, flameX, flameY);
            }
        }
    }

    createFlame(parent, x, y) {
        const flame = document.createElement('div');
        flame.style.position = 'absolute';
        flame.style.left = `${x - 16}px`;  // Centrer la flamme
        flame.style.top = `${y - 16}px`;

        flame.style.backgroundImage = "url('/assets/img/bomb/explosion.png')";
        flame.style.width = "32px";
        flame.style.height = "32px";
        flame.style.backgroundPosition = "64px 64px";  // Début de l'animation

        parent.appendChild(flame);

        // Lancer l'animation de disparition
        setTimeout(() => {
            flame.style.opacity = "0";
        }, this.flameLength * 240);

        // Supprimer la flamme après la transition
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