import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.refA = React.createRef()
    this.refB = React.createRef()
    this.refResult = React.createRef()
  }

  onAddClick = () => {
    const a = parseFloat(this.refA.current.value) || 0
    const b = parseFloat(this.refB.current.value) || 0

    this.refResult.current.value = a + b + ''
  }

  render() {
    return (
      <div>
        <input ref={ this.refA } /> + <input ref={ this.refB } />
        <div>
          <button onClick={ this.onAddClick }>求和</button>
        </div>
        <input ref={ this.refResult } />
      </div>
    )
  }
}

/** @jsxRuntime classic */
/** @jsx React.createElement */
const element = <App />
console.log(element)

ReactDOM.render(
  element,
  root
)
