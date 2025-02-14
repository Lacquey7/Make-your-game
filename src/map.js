export let map = (rows, cols) => {
  let mapper = [];

  for (let row = 0; row < rows; row++) {
    let newRow = [];

    for (let col = 0; col < cols; col++) {
      // Première ligne : 1 sur les bords, 3 au centre
      if (row === 0) {
        newRow.push(col === 0 || col === cols - 1 ? 1 : 3);
      }
      // Dernière ligne : uniquement des 3
      else if (row === rows - 1) {
        newRow.push(3);
      }
      // Côtés verticaux indestructibles
      else if (col === 0 || col === cols - 1) {
        newRow.push(1);
      }
      // Murs fixes internes
      else if (row % 2 === 0 && col % 2 === 0) {
        newRow.push(3);
      }
      // Zones semi-aléatoires
      else {
        newRow.push(Math.random() < 0.6 ? 5 : 4); // Boîte ou herbe
      }
    }

    mapper.push(newRow);
  }

  // Libérer les coins pour les joueurs
  mapper[1][1] = 4; // Coin en haut à gauche
  mapper[1][2] = 4;
  mapper[2][1] = 4;
  mapper[rows - 2][cols - 2] = 4; // Coin en bas à droite
  mapper[rows - 2][cols - 3] = 4;
  mapper[rows - 3][cols - 2] = 4;

  return mapper;
};
