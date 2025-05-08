export const generateCrosswordLayout = (words: string[]) => {
    const gridSize = 10;
    let grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));
    let placedWords: any[] = [];
    let wordNumber = 1;

    words.forEach((word, index) => {
        let direction = index % 2 === 0 ? "H" : "V";
        let maxAttempts = 10; // Try different positions up to 10 times
        let placed = false;

        while (maxAttempts > 0 && !placed) {
            let row = Math.floor(Math.random() * gridSize);
            let col = Math.floor(Math.random() * gridSize);

            if (direction === "H" && col + word.length > gridSize) continue; // Prevent overflow
            if (direction === "V" && row + word.length > gridSize) continue; // Prevent overflow

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
                let isNewNumber = true;

                for (let i = 0; i < word.length; i++) {
                    let r = direction === "H" ? row : row + i;
                    let c = direction === "H" ? col + i : col;

                    if (isNewNumber) {
                        placedWords.push({ word, row, col, direction, number: wordNumber });
                        wordNumber++;
                        isNewNumber = false;
                    }

                    grid[r][c] = word[i];
                }
                placed = true; // Word placed successfully
            }

            maxAttempts--; // Reduce attempts
        }
    });

    return { grid, placedWords };
};