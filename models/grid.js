const Square = require('./square');
class Grid {
    constructor() {
        this.grid = new Array(9).fill(0).map((_, i) => new Array(9).fill(0).map((_, j) => new Square(j, i)));
        this.history = [];
        this.redoHistory = [];
    }
    getSquare(x, y) {
        return this.grid[y][x];
    }
    getRow(y) {
        return this.grid[y];
    }
    getColumn(x) {
        return this.grid.map(row => row[x]);
    }
    getBox(x, y) {
        const boxX = Math.floor(x / 3);
        const boxY = Math.floor(y / 3);
        const box = [];
        for (let j = boxY * 3; j < (boxY * 3) + 3; j++) {
            for (let i = boxX * 3; i < (boxX * 3) + 3; i++) {
                box.push(this.getSquare(i, j));
            }
        }
        return box;
    }
    isValid() {
        return this.grid.every(row => row.every(square => square.isValid()));
    }
    isComplete() {
        return this.grid.every(row => row.every(square => square.hasValue() && square.isValid()));
    }
    simpleSetSquare(x, y, value) {
        const square = this.getSquare(x, y);
        square.value = value;
    }
    setSquare(x, y, value) {
        this.redoHistory = [];
        const square = this.getSquare(x, y);
        this.history.push({ x, y, value: square.value, pencilMarks: { ...square.pencilMarks } });
        if (square.hasValue() && square.value !== value) {
            square.value = value;
            return
        }
        square.value = 0;
    }
    markPencil(x, y, value) {
        const square = this.getSquare(x, y);
        square.pencilMarks[value] = !square.pencilMarks[value];
    }
    undo() {
        const { x, y, value, pencilMarks } = this.history.pop();
        const square = this.getSquare(x, y);
        this.redoHistory.push({ x, y, value: square.value, pencilMarks: { ...square.pencilMarks } });
        square.value = value;
        square.pencilMarks = pencilMarks;
    }
    redo() {
        const { x, y, value, pencilMarks } = this.redoHistory.pop();
        const square = this.getSquare(x, y);
        this.history.push({ x, y, value: square.value, pencilMarks: { ...square.pencilMarks } });
        square.value = value;
        square.pencilMarks = pencilMarks;
    }
    clear() {
        this.history = [];
        this.redoHistory = [];
        this.grid.forEach(row => row.forEach(square => {
            square.value = 0;
            square.pencilMarks = new Array(9).fill(0).reduce((acc, _, i) => {
                acc[i + 1] = false;
                return acc;
            }, {});
        }));
    }
    canUndo() {
        return this.history.length > 0;
    }
    canRedo() {
        return this.redoHistory.length > 0;
    }
    toJSON() {
        const grid = this.grid.map(row => row.map(square => square.toJSON()));
        const history = this.history;
        const redoHistory = this.redoHistory;
        return { grid, history, redoHistory };
    }
    clone() {
        return Grid.FromJSON(this.toJSON());
    }
    static FromJSON(json) {
        const grid = new Grid();
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                grid.grid[y][x] = Square.FromJSON(json.grid[y][x])
            }

        }
        grid.history = json.history;
        grid.redoHistory = json.redoHistory;
        return grid;
    }
}

module.exports = Grid;
