import {timerGlobal} from "./game.js";

export default class HUD {
    constructor(player, bot) {
        this.player = player;
        this.bot = bot;
        this.game = document.querySelector('body').__game;
        this.hudElement = null;
        this.topHudElement = null;
        this.timerInterval = null;
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
        scoreElement.textContent = '0';  // On commence à 0
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
            scoreElement.textContent = (currentScore + points).toString();
        }
    }

    updateFlame() {
        this.updatePower();
    }

    async gameOver() {
        // Arrêter immédiatement le jeu
        this.game.removeEventListeners();  // Retire tous les event listeners
        this.game.isPaused = true;  // Met le jeu en pause
        if (this.game.gameLoopId) {
            cancelAnimationFrame(this.game.gameLoopId);  // Arrête la boucle de jeu
            this.game.gameLoopId = null;
        }

        // Créer l'overlay de fin de jeu
        const gameOverOverlay = document.createElement('div');
        gameOverOverlay.className = 'game-over-overlay';

        const gameOverMessage = document.createElement('h2');
        gameOverMessage.className = 'game-over-message';
        gameOverMessage.textContent = this.player.life <= 0 ? 'Game Over - Bot Wins!' : 'Congratulations - You Win!';

        const currentScore = parseInt(document.getElementById('score').textContent);
        const currentTime = document.getElementById('timer').textContent;

        try {
            // Envoyer le nouveau score au serveur
            await fetch("http://localhost:8080/score", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.game.playerName,
                    score: currentScore,
                    time: currentTime
                })
            });

            // Récupérer tous les scores mis à jour
            const response = await fetch("http://localhost:8080/score");
            const scores = await response.json();
            scores.sort((a, b) => b.score - a.score);

            const table = document.createElement('table');
            table.className = 'scores-table';

            // En-tête du tableau
            const header = table.createTHead();
            const headerRow = header.insertRow();
            ['Rank', 'Name', 'Score', 'Time'].forEach(text => {
                const th = document.createElement('th');
                th.textContent = text;
                headerRow.appendChild(th);
            });

            // Corps du tableau
            const tbody = table.createTBody();

            // Trouver le rang du score actuel
            let currentRank = scores.findIndex(score => score.name === this.game.playerName && score.score === currentScore) + 1;
            if (currentRank === 0) currentRank = scores.length + 1;

            // Ajouter les 5 meilleurs scores
            for (let i = 0; i < 5 && i < scores.length; i++) {
                const row = tbody.insertRow();
                const rankCell = row.insertCell();
                const nameCell = row.insertCell();
                const scoreCell = row.insertCell();
                const timeCell = row.insertCell();

                let place = ["st", "nd", "rd"][i] || "th";
                rankCell.textContent = `${i + 1}${place}`;
                nameCell.textContent = scores[i].name;
                scoreCell.textContent = scores[i].score;
                timeCell.textContent = scores[i].time;

                // Mettre en surbrillance si c'est le score actuel
                if (scores[i].name === this.game.playerName &&
                    scores[i].score === currentScore &&
                    scores[i].time === currentTime) {
                    row.className = 'current-score-row';
                }
            }

            // Si le score actuel n'est pas dans le top 5, ajouter une ligne séparée
            if (currentRank > 5) {
                // Ajouter une ligne de séparation visuelle
                const separatorRow = tbody.insertRow();
                for (let i = 0; i < 4; i++) {
                    const cell = separatorRow.insertCell();
                    cell.textContent = '...';
                }

                const currentRow = tbody.insertRow();
                currentRow.className = 'current-score-row';
                [
                    `${currentRank}${["st", "nd", "rd"][currentRank - 1] || "th"}`,
                    this.game.playerName,
                    currentScore,
                    currentTime
                ].forEach(text => {
                    const cell = currentRow.insertCell();
                    cell.textContent = text;
                });
            }

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'scores-button-container';

            const menuButton = document.createElement('button');
            menuButton.textContent = 'Main Menu';
            menuButton.addEventListener('click', () => {
                document.querySelector('body').__game.returnToMainMenu();
            });

            buttonContainer.appendChild(menuButton);

            gameOverOverlay.appendChild(gameOverMessage);
            gameOverOverlay.appendChild(table);
            gameOverOverlay.appendChild(buttonContainer);

            document.getElementById('tilemap').appendChild(gameOverOverlay);

        } catch (error) {
            console.error('Erreur lors de la gestion des scores:', error);
        }
    }
}