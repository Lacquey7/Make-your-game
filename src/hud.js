// hud.js
import { scoreGlobal, timerGlobal } from './game.js';

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
    this.hudContainer = document.createElement('div');
    this.hudContainer.className = 'hud-container';

    // Create sections
    const leftSection = this.createSection('left');
    const centerSection = this.createSection('center');
    const rightSection = this.createSection('right');

    // Left section (hearts, speed, power)
    this.createStatsSection(leftSection);

    // Center section (timer and score)
    this.createInfoSection(centerSection);

    // Right section (keys)
    this.createKeySection(rightSection);

    // Add all sections to HUD
    this.hudContainer.append(leftSection, centerSection, rightSection);

    // Add HUD to document
    const tilemap = document.getElementById('tilemap');
    tilemap.appendChild(this.hudContainer);
  }

  createSection(position) {
    const section = document.createElement('div');
    section.className = `hud-section ${position}`;
    return section;
  }

  createStatsSection(container) {
    const heartsContainer = this.createContainer('hearts-container');
    const speedContainer = this.createContainer('speed-container');
    const powerContainer = this.createContainer('power-container');

    this.updateHearts(heartsContainer);
    this.updateSpeed(speedContainer);
    this.updatePower(powerContainer);

    container.append(heartsContainer, speedContainer, powerContainer);
  }
  createInfoSection(container) {
    const timerElement = document.createElement('div');
    timerElement.id = 'timer';
    timerElement.className = 'hud-info';
    timerElement.textContent = '00:00';

    const scoreElement = document.createElement('div');
    scoreElement.id = 'score';
    scoreElement.className = 'hud-info';
    scoreElement.textContent = scoreGlobal.toString();

    container.append(timerElement, scoreElement);
    this.startTimer();
  }

  createKeySection(container) {
    const keyContainer = this.createContainer('key-container');
    this.updateKey(keyContainer);
    container.appendChild(keyContainer);
  }

  createContainer(id) {
    const container = document.createElement('div');
    container.id = id;
    container.className = 'hud-container-item';
    return container;
  }
  startTimer() {
    if (!timerGlobal.startTime) {
      timerGlobal.startTime = Date.now() - timerGlobal.elapsedTime;
    }

    this.timerInterval = setInterval(() => {
      if (!this.game?.isPaused) {
        const currentTime = Date.now();
        const totalElapsedTime = Math.floor((currentTime - timerGlobal.startTime) / 1000);
        const minutes = Math.floor(totalElapsedTime / 60);
        const seconds = totalElapsedTime % 60;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
          timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          timerGlobal.elapsedTime = currentTime - timerGlobal.startTime;
        }
      }
    }, 1000);
  }

  pauseTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
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

  createKeyIcon() {
    const key = document.createElement('div');
    key.style.width = '30px';
    key.style.height = '30px';
    key.style.backgroundImage = "url('/assets/img/map/keyOrigin.png')";
    key.style.backgroundSize = 'contain';
    key.style.backgroundRepeat = 'no-repeat';
    return key;
  }

  updateHearts(container = document.getElementById('hearts-container')) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < this.player.life; i++) {
      container.appendChild(this.createHeartIcon());
    }
  }

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

  updateKey(container = document.getElementById('key-container')) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < this.player.getKey; i++) {
      container.appendChild(this.createKeyIcon());
    }
  }

  updateLife() {
    this.updateHearts();
    if (this.player.life <= 0) {
      this.gameOver();
    }
  }

  updateScore(points) {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
      const currentScore = parseInt(scoreElement.textContent);
      const newScore = currentScore + points;
      scoreElement.textContent = newScore.toString();
      scoreGlobal = newScore;
    }
  }

  updateFlame() {
    this.updatePower();
  }

  destroy() {
    if (this.hudElement && this.hudElement.parentNode) {
      this.hudElement.parentNode.removeChild(this.hudElement);
    }
    if (this.topHudElement && this.topHudElement.parentNode) {
      this.topHudElement.parentNode.removeChild(this.topHudElement);
    }
    this.pauseTimer();
  }

  async gameOver() {
    this.pauseTimer();
    this.game.removeEventListeners();
    this.game.isPaused = true;
    if (this.game.gameLoopId) {
      cancelAnimationFrame(this.game.gameLoopId);
      this.game.gameLoopId = null;
    }

    const gameOverOverlay = document.createElement('div');
    gameOverOverlay.className = 'game-over-overlay';

    const gameOverMessage = document.createElement('h2');
    gameOverMessage.className = 'game-over-message';
    gameOverMessage.textContent = this.player.life <= 0 ? 'Game Over - Bot Wins!' : 'Congratulations - You Win!';

    const currentScore = parseInt(document.getElementById('score').textContent);
    const currentTime = document.getElementById('timer').textContent;

    try {
      await fetch('http://localhost:8080/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.game.playerName,
          score: currentScore,
          time: currentTime,
        }),
      });

      const response = await fetch('http://localhost:8080/score');
      const scores = await response.json();
      scores.sort((a, b) => b.score - a.score);

      const table = document.createElement('table');
      table.className = 'scores-table';

      const header = table.createTHead();
      const headerRow = header.insertRow();
      ['Rank', 'Name', 'Score', 'Time'].forEach((text) => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
      });

      const tbody = table.createTBody();
      let currentRank = scores.findIndex((score) => score.name === this.game.playerName && score.score === currentScore) + 1;
      if (currentRank === 0) currentRank = scores.length + 1;

      for (let i = 0; i < 5 && i < scores.length; i++) {
        const row = tbody.insertRow();
        const rankCell = row.insertCell();
        const nameCell = row.insertCell();
        const scoreCell = row.insertCell();
        const timeCell = row.insertCell();

        let place = ['st', 'nd', 'rd'][i] || 'th';
        rankCell.textContent = `${i + 1}${place}`;
        nameCell.textContent = scores[i].name;
        scoreCell.textContent = scores[i].score;
        timeCell.textContent = scores[i].time;

        if (scores[i].name === this.game.playerName && scores[i].score === currentScore && scores[i].time === currentTime) {
          row.className = 'current-score-row';
        }
      }

      if (currentRank > 5) {
        const separatorRow = tbody.insertRow();
        for (let i = 0; i < 4; i++) {
          const cell = separatorRow.insertCell();
          cell.textContent = '...';
        }

        const currentRow = tbody.insertRow();
        currentRow.className = 'current-score-row';
        [`${currentRank}${['st', 'nd', 'rd'][currentRank - 1] || 'th'}`, this.game.playerName, currentScore, currentTime].forEach((text) => {
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
