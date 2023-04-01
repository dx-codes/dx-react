const a = '/user'
const b = 'add/:id'

const res = [a, b].join('/').replace(/\/\/+/g, '/')
console.log(res)