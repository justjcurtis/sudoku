const { sudokuSort } = require('./lib/generator');
const { isValid } = require('./lib/solver');
const { getValueGrid } = require('./lib/utils');

const singleRun = () => {
    const start = Date.now();
    const grid = sudokuSort();
    const end = Date.now();
    const valid = isValid(grid)
    return { valid, duration: end - start }
}
const N = process.argv[2] * 1000 || 1
if (N == 1) {
    const start = Date.now();
    const grid = sudokuSort();
    const end = Date.now();
    const values = getValueGrid(grid.grid);
    console.log(values.map(row => row.join(' ')).join('\n'));
    console.log(`Duration: ${end - start}ms`)
    console.log(isValid(grid, true))
    process.exit(0)
}
let Valid = 0
let Duration = 0
console.log(`Running ${N} tests...`)
for (let i = 0; i < N; i++) {
    const { valid, duration } = singleRun();
    Valid += valid ? 1 : 0
    Duration += duration
    if (i % 1000 === 0) console.log(`${i}/${N}`)
}
console.log(`${N}/${N}`)
console.log()
console.log(`Valid: ${Math.round((Valid / N) * 10000) / 100}%`)
console.log(`Average Duration: ${Math.round((Duration / N) * 100) / 100}ms`)
