let playerName = null;

export function startHistory(level, startGameCallback) {
    if (level === 1) {
        phase1(startGameCallback);
    }
}

function phase1(startGameCallback) {
    const divTile = document.querySelector("#tilemap");
    divTile.innerHTML = ''; // Nettoyer l’écran précédent

    const divHistory = document.createElement("div");
    divHistory.style.backgroundColor = "black";
    divHistory.style.color = "white";
    divHistory.style.padding = "10px";
    divTile.appendChild(divHistory);

    const storyPhase1 = "L’histoire commence dans la paisible ville de Crystal Town...\n" +
        "Mais aujourd’hui, un cri retentit : Les diamants de la ville ont été volés !\n" +
        "Dark Blaster, le redoutable ennemi, a utilisé ces pierres précieuses \n" +
        "pour activer son arme ultime.\n\n" +
        "C’est à vous de le vaincre et de ramener les diamants.";

    let index = 0;
    const interval = 10; // Vitesse d'affichage des lettres

    const typeEffect = setInterval(() => {
        if (index < storyPhase1.length) {
            divHistory.textContent += storyPhase1[index];
            index++;
        } else {
            clearInterval(typeEffect);
            createInput(divTile, startGameCallback); // Crée l’input après l’histoire
        }
    }, interval);
}

function createInput(divTile, startGameCallback) {
    const inputContainer = document.createElement('div');
    inputContainer.style.marginTop = "20px";

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Entrez votre nom...';
    inputField.style.padding = '10px';
    inputField.style.fontSize = '16px';
    inputField.style.borderRadius = '5px';
    inputField.style.border = '1px solid #ccc';
    inputField.style.width = '200px';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Valider';
    submitButton.style.marginLeft = '10px';
    submitButton.style.padding = '10px';
    submitButton.style.fontSize = '16px';
    submitButton.style.borderRadius = '5px';
    submitButton.style.border = 'none';
    submitButton.style.cursor = 'pointer';

    submitButton.addEventListener('click', () => {
        playerName = inputField.value.trim();
        if (playerName) {
            divTile.innerHTML = ''; // Nettoyer la zone pour démarrer le jeu
            startGameCallback(playerName); // Passer le nom du joueur à `startGame`
        } else {
            alert("Veuillez entrer un nom valide.");
        }
    });

    inputContainer.appendChild(inputField);
    inputContainer.appendChild(submitButton);
    divTile.appendChild(inputContainer);
}