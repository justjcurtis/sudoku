const Grid = require('../models/grid');
const { isValid } = require('./solver')
const { getRandomRow, getValueGrid } = require('./utils');

const getRandomGrid = () => {
    const grid = new Grid();
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            const arr = getRandomRow();
            const box = grid.getBox(i * 3, j * 3);
            for (const square of box) {
                square.value = arr.pop();
            }
        }
    }
    return grid
}

const bas = (grid, prevSorted, registered, x, y, col = false) => {
    const target = grid.getSquare(x, y);
    if (registered[`${target.value}`] === undefined) {
        registered[`${target.value}`] = { x, y }
        return true
    }
    const { x: dx, y: dy } = registered[`${target.value}`];
    const boxA = grid.getBox(x, y);
    for (const square of boxA) {
        if (col && square.x === x) continue
        if (!col && square.y === y) continue
        if (registered[`${square.value}`] !== undefined) continue
        const isPrevSorted = prevSorted[`${square.x},${square.y}`] || prevSorted[`${x},${y}`]
        if (isPrevSorted) {
            if (col && (square.x < x || square.y !== y)) continue
            if (!col && (square.y < y || square.x !== x)) continue
        }
        registered[`${square.value}`] = { x, y }
        const temp = target.value;
        grid.simpleSetSquare(x, y, square.value);
        grid.simpleSetSquare(square.x, square.y, temp);
        return true
    }

    const dupe = grid.getSquare(dx, dy);
    const boxB = grid.getBox(dx, dy);
    for (const square of boxB) {
        if (col && square.x === dx) continue
        if (!col && square.y === dy) continue
        if (registered[`${square.value}`] !== undefined) continue
        const isPrevSorted = prevSorted[`${square.x},${square.y}`] || prevSorted[`${dupe.x},${dupe.y}`]
        if (isPrevSorted) {
            if (col && (square.x < dx || square.y !== dy)) continue
            if (!col && (square.y < dy || square.x !== dx)) continue
        }
        registered[`${target.value}`] = { x, y }
        registered[`${square.value}`] = { x: dx, y: dy }
        const temp = dupe.value;
        grid.simpleSetSquare(dx, dy, square.value);
        grid.simpleSetSquare(square.x, square.y, temp);
        return true
    }
    return false
}

const pas = (grid, registered, i, j, col = false, depth = 0) => {
    if (depth > 18) return false
    const pre = grid.getSquare(i, j)
    const { x, y } = registered[`${pre.value}`]
    const dupe = grid.getSquare(x, y)
    let square;
    let isRegistered
    const canGet2 = col ? x % 3 == 0 : y % 3 == 0
    if (canGet2) {
        square = col ? grid.getSquare(x + 2, y) : grid.getSquare(x, y + 2)
        isRegistered = registered[`${square.value}`] !== undefined
        if (isRegistered) square = undefined
    }
    if (!square) {
        square = col ? grid.getSquare(x + 1, y) : grid.getSquare(x, y + 1)
        isRegistered = registered[`${square.value}`] !== undefined
    }
    const temp = dupe.value
    grid.simpleSetSquare(x, y, square.value)
    grid.simpleSetSquare(square.x, square.y, temp)
    registered[`${pre.value}`] = { x: i, y: j }
    const sorted = isRegistered ? pas(grid, registered, x, y, col, depth + 1) : true
    if (sorted || depth == 18) registered[`${dupe.value}`] = { x, y }
    return sorted
}

const shrinkingSquareSort = (grid) => {
    const prevSorted = {}
    let backtrack = -1
    for (let z = 0; z < 9; z++) {
        if (backtrack >= 0) backtrack--
        if (backtrack == 0) z -= 2
        if (z % 3 == 2) continue
        let registered = {};
        for (let x = 0; x < 9; x++) {
            let sorted = bas(grid, prevSorted, registered, x, z);
            if (!sorted) sorted = pas(grid, registered, x, z);
            if (sorted) prevSorted[`${x},${z}`] = true
            if (!sorted && backtrack < 0) {
                backtrack = 2
                continue
            }
        }
        registered = {};
        for (let y = 0; y < 9; y++) {
            let sorted = bas(grid, prevSorted, registered, z, y, true);
            if (!sorted) sorted = pas(grid, registered, z, y, true);
            if (sorted) prevSorted[`${z},${y}`] = true
            if (!sorted && backtrack < 0) {
                backtrack = 2
            }
        }
    }
    // if (!isValid(grid)) {
    //     const values = getValueGrid(og.grid)
    //     console.log(values.map(row => row.join(' ')).join('\n'));
    //     throw (new Error('Invalid grid'))
    // }
}

const getTestGrid = () => {
    const fs = require('fs');
    const gridRaw = fs.readFileSync('./tg2.txt', 'utf8').split('\n').map(line => line.split(' ').map(num => parseInt(num)));
    const grid = new Grid();
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            grid.simpleSetSquare(x, y, gridRaw[y][x]);
        }
    }
    return grid
}

let og;
const sudokuSort = () => {
    const grid = getRandomGrid();
    // const grid = getTestGrid();
    // og = grid.clone()
    shrinkingSquareSort(grid);
    return grid;
}

module.exports = { sudokuSort }
