const arrIsValid = arr => {
    if (arr.length < 2) return true;
    const seen = {}
    for (let i = 0; i < arr.length; i++) {
        if (seen[arr[i]] !== undefined) return false
        seen[arr[i]] = true
    }
    return true
}

const isValid = (grid, log = false) => {
    // check rows
    result = true
    for (let y = 0; y < 9; y++) {
        const row = grid.getRow(y);
        const values = row.filter(square => square.hasValue()).map(square => square.value);
        if (!arrIsValid(values)) {
            if (!log) return false
            console.log('row', y, 'is invalid')
            result = false;
        }
    }
    // check columns
    for (let x = 0; x < 9; x++) {
        const column = grid.getColumn(x);
        const values = column.filter(square => square.hasValue()).map(square => square.value);
        if (!arrIsValid(values)) {
            if (!log) return false
            console.log('column', x, 'is invalid')
            result = false;
        }
    }
    // check boxes
    for (let y = 0; y < 9; y += 3) {
        for (let x = 0; x < 9; x += 3) {
            const box = grid.getBox(x, y);
            const values = box.filter(square => square.hasValue()).map(square => square.value);
            if (!arrIsValid(values)) {
                if (!log) return false
                console.log('box', Math.floor(x / 3) + (3 * Math.floor(y / 3)), 'is invalid')
                result = false;
            }
        }
    }
    return result
}

module.exports = { isValid };
