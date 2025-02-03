let canvas = document.getElementById('board');
canvas.width = 800;
canvas.height = 600;
let context = canvas.getContext('2d');
let player = new Player();
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Event listeners pour les touches
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
    // Clear le canvas
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Update et dessin du player
    player.move(keys);
    player.draw(context);

    requestAnimationFrame(gameLoop);
}

// Démarrer le jeu
gameLoop();