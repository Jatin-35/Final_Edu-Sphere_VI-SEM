export const generateCrosswordLayout = (words: string[]) => {
  const gridSize = 10;
  let grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(""));
  let cellNumbers = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(null));
  let placedWords: any[] = [];
  let wordNumber = 1;

  words.forEach((word, index) => {
    let direction = index % 2 === 0 ? "H" : "V";
    let maxAttempts = 10;
    let placed = false;

    while (maxAttempts > 0 && !placed) {
      let row = Math.floor(Math.random() * gridSize);
      let col = Math.floor(Math.random() * gridSize);

      if (direction === "H" && col + word.length > gridSize) continue;
      if (direction === "V" && row + word.length > gridSize) continue;

      let canPlace = true;

      for (let i = 0; i < word.length; i++) {
        let r = direction === "H" ? row : row + i;
        let c = direction === "H" ? col + i : col;

        if (grid[r][c] !== "" && grid[r][c] !== word[i]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        placedWords.push({ word, row, col, direction, number: wordNumber });
        cellNumbers[row][col] = wordNumber;

        for (let i = 0; i < word.length; i++) {
          let r = direction === "H" ? row : row + i;
          let c = direction === "H" ? col + i : col;
          grid[r][c] = word[i];
        }

        wordNumber++;
        placed = true;
      }

      maxAttempts--;
    }
  });

  return { grid, placedWords, cellNumbers };
};
