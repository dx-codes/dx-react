import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

class Hello extends React.Component {
  render() {
    return (
      <div style={ this.props.style }>
        <p>
          hello { this.props.name }
        </p>
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div style={ this.props.style }>
        <h1>{ this.props.title }</h1>
        <Hello name='class-component' style={{ fontSize: '18px', color: 'green' }}/>
      </div>
    )
  }
}

/** @jsxRuntime classic */
/** @jsx React.createElement */
const element = <App title='title' style={{ fontSize: '28px', color: 'red' }}/>
console.log(element)

ReactDOM.render(
  element,
  root
)
