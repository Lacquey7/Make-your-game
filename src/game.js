// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    const bot = new Bot();
    let player = new Player();
    let keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };

    document.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.code)) {
            keys[e.code] = false;
        }
    });

    function gameLoop() {
        player.move(keys);
        bot.moveAutonomously();
        requestAnimationFrame(gameLoop);
    }

    // Démarrer le jeu
    gameLoop();
});