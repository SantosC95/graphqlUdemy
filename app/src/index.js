import defaultSum, { doSum as mySum, doSubtract } from "./modules"

const a = 10
const b = 7

console.log('Suma por defecto', defaultSum(a, b))
console.log('Suma', mySum(a, b))
console.log('Resta', doSubtract(a, b))
