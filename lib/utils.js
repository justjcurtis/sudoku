const fisherYates = (arr, n = 3) => {
    const newArr = [...arr];
    for (let x = 0; x < n; x++) {
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
    }
    return newArr;
};

const getRandomInt = (min = 1, max = 9) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomRow = () => fisherYates(new Array(9).fill(0).map((_, i) => i + 1))
const getValueGrid = (grid) => grid.map(row => row.map(square => square.value));

module.exports = { getRandomInt, getRandomRow, getValueGrid, fisherYates };
