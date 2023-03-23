

function compilePath(path) {
  const paramNames = []

  let regexpSource = '^' + path.replace(/:(\w+)/g, (_, paramName) => {
    console.log(paramName)
    paramNames.push(paramName)
    return "([^\\/]+)"
  })
  regexpSource += '$'
  const matcher = new RegExp(regexpSource)
  return [matcher, paramNames]
}

const path = '/user/:id/:age'
const [matcher, paramNames] = compilePath(path)
console.log(matcher)

const url = '/user'
const match = url.match(matcher)
console.log(match)
const values = match.slice(1)
const res = paramNames.reduce((prev, paramName, index) => {
  prev[paramName] = values[index]
  return prev
}, {})
console.log(res)