import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

class TextInput extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  getFocus = () => {
    this.ref.current.focus()
  }

  render() {
    return (
      <input ref={ this.ref } />
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
    this.ref.test = 1
  }

  getFocus = () => {
    this.ref.current.getFocus()
  }

  render() {
    return (
      <div>
        <TextInput ref={ this.ref } />
        <button onClick={ this.getFocus }>focus</button>
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
