import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const TextInput = (_, ref) => {
  return <input ref={ ref }/>
}

const FTextInput = React.forwardRef(TextInput)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  getFocus = () => {
    this.ref.current.focus()
  }

  render() {
    return (
      <div>
        <FTextInput ref={ this.ref } />
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
