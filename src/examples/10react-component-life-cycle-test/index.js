import React from 'react'
import ReactDOM from 'react-dom'
import 'reset-css'

const root = document.getElementById('root')

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.name = 'home'
    console.log(this.name + ' constructor')
  }

  componentWillMount = () => {
    console.log(this.name + ' will mount')
  }

  componentDidMount = () => {
    console.log(this.name + ' did mount')
  }

  componentWillReceiveProps = (nextProps, nextState) => {
    console.log(this.name + ' will receive props', nextProps, nextState)
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    console.log(this.name + ' should update', nextProps, nextState)
    return true
  }

  componentWillUpdate = () => {
    console.log(this.name + ' will update')
  }

  componentDidUpdate = () => {
    console.log(this.name + ' did update')
  }

  componentWillUnmount = () => {
    console.log(this.name + ' will unmount')
  }

  render = () => {
    console.log(this.name + ' render')

    return (
      <div>
        Home
        <div>{ this.props.count }</div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { num: 1 }
    this.name = 'app'
    console.log(this.name + ' constructor')
  }

  componentWillMount = () => {
    console.log(this.name + ' will mount')
  }

  componentDidMount = () => {
    console.log(this.name + ' did mount')
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    console.log(this.name + ' should update', nextProps, nextState)
    return true
  }

  componentWillUpdate = () => {
    console.log(this.name + ' will update')
  }

  componentDidUpdate = () => {
    console.log(this.name + ' did update')
  }

  onClick = () => {
    this.setState({ num: this.state.num + 1 })
  }

  render = () => {
    console.log(this.name + ' render')
    return (
      <div>
        <div>App</div>
        <div>
          <span>{ this.state.num }</span>
          <button onClick={ this.onClick }>+</button>
        </div>
        {
          this.state.num <= 5
          &&
          <Home count={ this.state.num } />
        }
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
