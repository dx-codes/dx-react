import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const swap = (arr, x, y) => {
  let temp = arr[x]
  arr[x] = arr[y]
  arr[y] = temp
}

const shuffle = (arr) => {
  const _arr = Array.from(arr)
  const n = arr.length

  if (n > 1) { 
    const max = n - 1
    for(let i = 0; i < n; i++) { 
      const min = i
      const range = max - min
      const index = min + Math.round(Math.random() * range)
      swap(_arr, i, index)
    }
  }

  return _arr
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  }

  onClick = () => {
    const newData = shuffle(this.state.data)
    this.setState({
      data: newData
    })
  }

  render() {
    return (
      <div>
        <ul>
          {
            this.state.data.map(num => {
              return (
                <li>{ num }</li>
              )
            })
          }
        </ul>
        <button onClick={ this.onClick }>change</button>
      </div>
    )
  }
}

/** @jsxRuntime classic */
/** @jsx React.createElement */
const element = (<App />)
console.log(element)

ReactDOM.render(
  element,
  root
)
