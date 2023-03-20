import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num: this.props.num
    }
  }

  // mount和update时都会调用
  static getDerivedStateFromProps(nextProps, nextState) {
    console.log('getDerivedStateFromProps -> ', nextProps, nextState)
    nextState.num = nextProps.num
    return nextState
  }

  componentDidMount() {
    console.log('componentDidMount')
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate -> ', nextProps, nextState)
    return true
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getSnapshotBeforeUpdate -> ', prevProps, prevState)
    // return this.state
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate -> ', prevProps, prevState)
  }

  componentWillUnmount() {
    console.log('componentWillUnmount')
  }

  render() {
    return (
      <div>
        { this.state.num }
      </div>
    )
  }
}
 
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num: 0,
      test: true
    }
  }

  onAddClick = () => {
    this.setState({
      num: this.state.num + 1
    })
  }

  onChangeClick = () => {
    this.setState({
      test: !this.state.test
    })
  }

  render() {
    return (
      <div id='App'>
        {
          this.state.test 
          &&
          <div id='3'>
            <div>Counter</div>
            <Counter num={ this.state.num } />
          </div>
        }
        <div id='2'>
          <div>App</div>
          <div>{ this.state.num }</div>
        </div>
        <button onClick={ this.onAddClick }>+</button>
        <br></br>
        <button onClick={ this.onChangeClick }>change</button>
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
