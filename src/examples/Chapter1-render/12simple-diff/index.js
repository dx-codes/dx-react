import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const AnotherCounter = (props) => {
  return (
    <div>
      { props.num }
    </div>
  )
}

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.name = 'Counter'
  }

  componentWillMount = () => {
    console.log(this.name + ' will mount')
  }

  componentDidMount = () => {
    console.log(this.name + ' did mount')
  }

  componentWillReceiveProps = (nextProps) => {
    console.log(this.name + ' will receive props', nextProps)
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

  render() {
    return (
      <div>
        { this.props.num }
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.name = 'App'
    this.state = {
      test: true,
      num: 0,
    }
  }

  componentWillMount = () => {
    console.log(this.name + ' will mount')
  }

  componentDidMount = () => {
    console.log(this.name + ' did mount')
  }

  componentWillReceiveProps = (nextProps) => {
    console.log(this.name + ' will receive props', nextProps)
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

  onClick1 = () => {
    this.setState({
      test: !this.state.test,
    })
  }

  onClick2 = () => {
    this.setState({
      num: this.state.num + 1
    })
  }

  render() {
    return (
      <div>
        {
          this.state.test
          ?
          <p>
            <h2>h2</h2>
            <span>sapn-t</span>
          </p>
          :
          <p>
            <h1>h1</h1>
            <span>span-f</span>
          </p>
        }
        <button onClick={ this.onClick1 }>change</button>
        <div>{ this.state.num }</div>
        <button onClick={ this.onClick2 }>+</button>
        <Counter num={ this.state.num } />
        <AnotherCounter num={ this.state.num }/>
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
