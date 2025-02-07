import {timerGlobal} from "./game.js";

export default class HUD {
    constructor(player, bot) {
        this.player = player;
        this.bot = bot;
        this.game = document.querySelector('body').__game;
        this.hudElement = null;
        this.topHudElement = null;
        this.timerInterval = null; // Ajout de cette ligne
        this.createHUD();
    }

    createHUD() {
        // Création des deux HUDs (haut et bas)
        this.createTopHUD();
        this.createBottomHUD();

        const tilemap = document.getElementById('tilemap');
        tilemap.appendChild(this.topHudElement);
        tilemap.appendChild(this.hudElement);
    }

    createTopHUD() {
        this.topHudElement = document.createElement('div');
        this.topHudElement.style.position = 'absolute';
        this.topHudElement.style.top = '-40px';
        this.topHudElement.style.left = '0';
        this.topHudElement.style.right = '0';
        this.topHudElement.style.display = 'flex';
        this.topHudElement.style.justifyContent = 'space-between';
        this.topHudElement.style.padding = '5px 20px';
        this.topHudElement.style.zIndex = '1000';

        // Container gauche pour les cœurs
        const heartsContainer = document.createElement('div');
        heartsContainer.id = 'hearts-container';
        heartsContainer.style.display = 'flex';
        heartsContainer.style.gap = '5px';
        this.updateHearts(heartsContainer);

        // Container central pour la vitesse
        const speedContainer = document.createElement('div');
        speedContainer.id = 'speed-container';
        speedContainer.style.display = 'flex';
        speedContainer.style.gap = '5px';
        this.updateSpeed(speedContainer);

        // Container droite pour la puissance
        const powerContainer = document.createElement('div');
        powerContainer.id = 'power-container';
        powerContainer.style.display = 'flex';
        powerContainer.style.gap = '5px';
        this.updatePower(powerContainer);

        // Ajout des containers
        this.topHudElement.appendChild(heartsContainer);
        this.topHudElement.appendChild(speedContainer);
        this.topHudElement.appendChild(powerContainer);
    }

    createBottomHUD() {
        this.hudElement = document.createElement('div');
        this.hudElement.className = 'game-hud';
        this.hudElement.style.position = 'absolute';
        this.hudElement.style.bottom = '10px';
        this.hudElement.style.left = '0';
        this.hudElement.style.right = '0';
        this.hudElement.style.display = 'flex';
        this.hudElement.style.justifyContent = 'space-between';
        this.hudElement.style.padding = '0 20px';
        this.hudElement.style.color = 'white';
        this.hudElement.style.fontFamily = 'MaPolicePerso, sans-serif';
        this.hudElement.style.fontSize = '16px';

        // Container pour le score (à gauche)
        const scoreContainer = document.createElement('div');
        scoreContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        scoreContainer.style.padding = '5px 15px';
        scoreContainer.style.borderRadius = '20px';

        const scoreElement = document.createElement('div');
        scoreElement.id = 'score';
        scoreElement.textContent = '0';
        scoreContainer.appendChild(scoreElement);

        // Container pour le timer (à droite)
        const timerContainer = document.createElement('div');
        timerContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        timerContainer.style.padding = '5px 15px';
        timerContainer.style.borderRadius = '20px';

        const timerElement = document.createElement('div');
        timerElement.id = 'timer';
        timerElement.textContent = '00:00';
        timerContainer.appendChild(timerElement);

        this.hudElement.appendChild(scoreContainer);
        this.hudElement.appendChild(timerContainer);
        this.startTimer();
    }

    startTimer() {
        const startTime = Date.now();
        this.timerInterval = setInterval(() => {
            if (!this.game?.isPaused) {
                const currentTime = Date.now();
                const elapsedTime = Math.floor((currentTime - startTime) / 1000);
                const minutes = Math.floor(elapsedTime / 60);
                const seconds = elapsedTime % 60;
                const timerElement = document.getElementById('timer');
                if (timerElement) {
                    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                }
            }
        }, 1000);
    }

    destroy() {
        if (this.hudElement && this.hudElement.parentNode) {
            this.hudElement.parentNode.removeChild(this.hudElement);
        }
        if (this.topHudElement && this.topHudElement.parentNode) {
            this.topHudElement.parentNode.removeChild(this.topHudElement);
        }
        if (this.timerInterval) {  // Ajout de cette ligne
            clearInterval(this.timerInterval);  // Ajout de cette ligne
        }
    }

    createHeartIcon() {
        const heart = document.createElement('div');
        heart.style.width = '30px';
        heart.style.height = '30px';
        heart.style.backgroundImage = "url('/assets/img/map/heart.png')";
        heart.style.backgroundSize = 'contain';
        heart.style.backgroundRepeat = 'no-repeat';
        return heart;
    }

    createPowerIcon() {
        const power = document.createElement('div');
        power.style.width = '30px';
        power.style.height = '30px';
        power.style.backgroundImage = "url('/assets/img/map/power.png')";
        power.style.backgroundSize = 'contain';
        power.style.backgroundRepeat = 'no-repeat';
        return power;
    }
    createSpeedIcon() {
        const speed = document.createElement('div');
        speed.style.width = '30px';
        speed.style.height = '30px';
        speed.style.backgroundImage = "url('/assets/img/map/speed.png')";
        speed.style.backgroundSize = 'contain';
        speed.style.backgroundRepeat = 'no-repeat';
        return speed;
    }

    updateHearts(container = document.getElementById('hearts-container')) {
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < this.player.life; i++) {
            container.appendChild(this.createHeartIcon());
        }
    }
    // Ajouter la méthode updateSpeed
    updateSpeed(container = document.getElementById('speed-container')) {
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < this.player.speed; i++) {
            container.appendChild(this.createSpeedIcon());
        }
    }

    updatePower(container = document.getElementById('power-container')) {
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < this.player.flame; i++) {
            container.appendChild(this.createPowerIcon());
        }
    }

    updateLife() {
        this.updateHearts();
        if (this.player.life <= 0 || this.bot.life <= 0) {
            this.gameOver();
        }
    }

    updateScore(points) {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            const currentScore = parseInt(scoreElement.textContent);
            scoreElement.textContent = currentScore + points;
        }
    }

    updateFlame() {
        this.updatePower();
    }

    gameOver() {
        const gameOverOverlay = document.createElement('div');
        gameOverOverlay.className = 'game-over-overlay';
        gameOverOverlay.style.position = 'absolute';
        gameOverOverlay.style.top = '0';
        gameOverOverlay.style.left = '0';
        gameOverOverlay.style.width = '100%';
        gameOverOverlay.style.height = '100%';
        gameOverOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        gameOverOverlay.style.display = 'flex';
        gameOverOverlay.style.flexDirection = 'column';
        gameOverOverlay.style.justifyContent = 'center';
        gameOverOverlay.style.alignItems = 'center';
        gameOverOverlay.style.zIndex = '2000';

        const gameOverMessage = document.createElement('h2');
        gameOverMessage.style.color = 'white';
        gameOverMessage.style.fontFamily = 'MaPolicePerso, sans-serif';
        gameOverMessage.style.marginBottom = '20px';
        gameOverMessage.textContent = this.player.life <= 0 ? 'Game Over - Bot Wins!' : 'Congratulations - You Win!';

        const finalScore = document.createElement('div');
        finalScore.style.color = 'white';
        finalScore.style.fontFamily = 'MaPolicePerso, sans-serif';
        finalScore.style.marginBottom = '20px';
        finalScore.textContent = `Final Score: ${document.getElementById('score').textContent}`;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        const replayButton = document.createElement('button');
        replayButton.textContent = 'Play Again';
        replayButton.addEventListener('click', () => window.location.reload());

        const menuButton = document.createElement('button');
        menuButton.textContent = 'Main Menu';
        menuButton.addEventListener('click', () => {
            document.querySelector('body').__game.returnToMainMenu();
        });

        buttonContainer.appendChild(replayButton);
        buttonContainer.appendChild(menuButton);

        gameOverOverlay.appendChild(gameOverMessage);
        gameOverOverlay.appendChild(finalScore);
        gameOverOverlay.appendChild(buttonContainer);

        document.getElementById('tilemap').appendChild(gameOverOverlay);
    }
}