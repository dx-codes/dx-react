import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

class Child extends React.Component {
  render() {
    return (
      <div>child { this.props.num }</div>
    )
  }
}

const Parent = (props) => {
  return (
    <div>
      <div>parent</div>
      <Child { ...props } />
    </div>
  )
}

const ParentForward = React.forwardRef(Parent)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { num: 1 }
  }

  onClick = () => {
    this.setState({
      num: this.state.num + 1
    })
  }

  render() {
    return (
      <div>
        <div>app</div>
        <ParentForward num={ this.state.num }/>
        <button onClick={ this.onClick } >+</button>
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
