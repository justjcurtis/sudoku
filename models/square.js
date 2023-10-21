class Square {
    constructor(x, y, value = 0) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.answer = undefined;
        this.pencilMarks = new Array(9).fill(0).reduce((acc, _, i) => {
            acc[i + 1] = false;
            return acc;
        }, {});
    }
    hasValue() {
        return this.value !== 0;
    }
    isValid() {
        return !this.hasValue() || this.value === this.answer;
    }
    toJSON() {
        return {
            x: this.x,
            y: this.y,
            value: this.value,
            answer: this.answer,
            pencilMarks: this.pencilMarks
        };
    }
    static FromJSON(json) {
        const square = new Square(json.x, json.y, json.value);
        square.answer = json.answer;
        square.pencilMarks = json.pencilMarks;
        return square;
    }
}

module.exports = Square;
