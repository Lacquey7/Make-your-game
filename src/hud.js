export default class HUD {
    constructor(player, bot) {
        this.player = player;
        this.bot = bot;
        this.score = 0;
        this.timer = 0;
        this.hudElement = null;
        this.timerInterval = null;
        this.createHUD();
        this.startTimer();
    }

    createHUD() {
        // Création du conteneur principal du HUD
        this.hudElement = document.createElement('div');
        this.hudElement.className = 'game-hud';
        this.hudElement.style.width = '700px';
        this.hudElement.style.transform = 'translateX(-50%)';
        this.hudElement.style.position = 'absolute';
        this.hudElement.style.top = '20px';
        this.hudElement.style.left = '50%';
        this.hudElement.style.right = 'auto';
        this.hudElement.style.padding = '10px 5px';
        this.hudElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.hudElement.style.color = 'white';
        this.hudElement.style.fontFamily = 'MaPolicePerso, sans-serif';
        this.hudElement.style.zIndex = '1000';
        this.hudElement.style.display = 'flex';
        this.hudElement.style.alignItems = 'center';
        this.hudElement.style.gap = '15px';
        this.hudElement.style.fontSize = '10px';
        this.hudElement.style.justifyContent = 'center';

        // Création des éléments du HUD
        this.createPlayerDisplay();
        this.createBotDisplay();
        this.createPowerDisplay();
        this.createSpeedDisplay();
        this.createScoreDisplay();
        this.createTimerDisplay();

        // Ajout du HUD au tilemap
        const tilemap = document.getElementById('tilemap');
        tilemap.appendChild(this.hudElement);
    }

    createPlayerDisplay() {
        const playerContainer = document.createElement('div');
        playerContainer.style.display = 'flex';
        playerContainer.style.alignItems = 'center';
        playerContainer.style.gap = '5px';

        const playerLabel = document.createElement('span');
        playerLabel.textContent = 'Player:';

        const playerLife = document.createElement('span');
        playerLife.id = 'player-life';
        playerLife.textContent = this.player.life;

        const playerHeart = document.createElement('span');
        playerHeart.textContent = '❤️';
        playerHeart.style.transform = 'translateY(-1px)'; // Petit ajustement vertical

        playerContainer.appendChild(playerLabel);
        playerContainer.appendChild(playerLife);
        playerContainer.appendChild(playerHeart);
        this.hudElement.appendChild(playerContainer);
    }

    createBotDisplay() {
        const botContainer = document.createElement('div');
        botContainer.style.display = 'flex';
        botContainer.style.alignItems = 'center';
        botContainer.style.gap = '5px';

        const botLabel = document.createElement('span');
        botLabel.textContent = 'Bot:';

        const botLife = document.createElement('span');
        botLife.id = 'bot-life';
        botLife.textContent = this.bot.life;

        const botHeart = document.createElement('span');
        botHeart.textContent = '❤️';
        botHeart.style.transform = 'translateY(-1px)'; // Petit ajustement vertical

        botContainer.appendChild(botLabel);
        botContainer.appendChild(botLife);
        botContainer.appendChild(botHeart);
        this.hudElement.appendChild(botContainer);
    }

    createPowerDisplay() {
        const powerContainer = document.createElement('div');
        powerContainer.style.display = 'flex';
        powerContainer.style.alignItems = 'center';
        powerContainer.style.gap = '5px';

        const powerLabel = document.createElement('span');
        powerLabel.textContent = 'Power:';

        const powerValue = document.createElement('span');
        powerValue.id = 'flame-power';
        powerValue.textContent = this.player.flame;

        const powerIcon = document.createElement('span');
        powerIcon.textContent = '🔥';
        powerIcon.style.transform = 'translateY(-1px)'; // Petit ajustement vertical

        powerContainer.appendChild(powerLabel);
        powerContainer.appendChild(powerValue);
        powerContainer.appendChild(powerIcon);
        this.hudElement.appendChild(powerContainer);
    }

    createScoreDisplay() {
        const scoreContainer = document.createElement('div');
        scoreContainer.style.display = 'flex';
        scoreContainer.style.alignItems = 'center';
        scoreContainer.style.gap = '5px';

        const scoreLabel = document.createElement('span');
        scoreLabel.textContent = 'Score:';

        const scoreValue = document.createElement('span');
        scoreValue.id = 'score';
        scoreValue.textContent = this.score;

        scoreContainer.appendChild(scoreLabel);
        scoreContainer.appendChild(scoreValue);
        this.hudElement.appendChild(scoreContainer);
    }

    createSpeedDisplay() {
        const speedContainer = document.createElement('div');
        speedContainer.style.display = 'flex';
        speedContainer.style.alignItems = 'center';
        speedContainer.style.gap = '5px';

        const speedLabel = document.createElement('span');
        speedLabel.textContent = 'Speed:';

        const speedValue = document.createElement('span');
        speedValue.id = 'speed-value';
        speedValue.textContent = this.player.speed;

        const speedIcon = document.createElement('span');
        speedIcon.textContent = '⚡';
        speedIcon.style.transform = 'translateY(-1px)';

        speedContainer.appendChild(speedLabel);
        speedContainer.appendChild(speedValue);
        speedContainer.appendChild(speedIcon);
        this.hudElement.appendChild(speedContainer);
    }

    createTimerDisplay() {
        const timerContainer = document.createElement('div');
        timerContainer.id = 'timer';
        timerContainer.textContent = '00:00';
        this.hudElement.appendChild(timerContainer);
    }

    updateLife() {
        const playerLifeElement = document.getElementById('player-life');
        const botLifeElement = document.getElementById('bot-life');
        if (playerLifeElement) playerLifeElement.textContent = this.player.life;
        if (botLifeElement) botLifeElement.textContent = this.bot.life;

        if (this.player.life <= 0 || this.bot.life <= 0) {
            this.gameOver();
        }
    }

    updateSpeed() {
        const speedElement = document.getElementById('speed-value');
        if (speedElement) speedElement.textContent = this.player.speed;
    }

    updateScore(points) {
        this.score += points;
        const scoreElement = document.getElementById('score');
        if (scoreElement) scoreElement.textContent = this.score;
    }

    updateFlame() {
        const flameElement = document.getElementById('flame-power');
        if (flameElement) flameElement.textContent = this.player.flame;
    }

    startTimer() {
        const startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60);
            const seconds = elapsedTime % 60;

            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    gameOver() {
        this.stopTimer();

        // Création de l'overlay de fin de partie
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

        // Message de fin de partie
        const gameOverMessage = document.createElement('h2');
        gameOverMessage.style.color = 'white';
        gameOverMessage.style.fontFamily = 'MaPolicePerso, sans-serif';
        gameOverMessage.style.marginBottom = '20px';
        gameOverMessage.textContent = this.player.life <= 0 ? 'Game Over - Bot Wins!' : 'Congratulations - You Win!';

        // Score final
        const finalScore = document.createElement('div');
        finalScore.style.color = 'white';
        finalScore.style.fontFamily = 'MaPolicePerso, sans-serif';
        finalScore.style.marginBottom = '20px';
        finalScore.textContent = `Final Score: ${this.score}`;

        // Boutons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        // Bouton rejouer
        const replayButton = document.createElement('button');
        replayButton.textContent = 'Play Again';
        replayButton.addEventListener('click', () => {
            window.location.reload();
        });

        // Bouton menu principal
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

    destroy() {
        this.stopTimer();
        if (this.hudElement && this.hudElement.parentNode) {
            this.hudElement.parentNode.removeChild(this.hudElement);
        }
    }
}