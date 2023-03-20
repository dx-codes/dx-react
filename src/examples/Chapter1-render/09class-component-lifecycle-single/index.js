import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { num: 1 }
    console.log('constructor')
  }

  componentWillMount() {
    console.log('will mount')
  }

  componentDidMount() {
    console.log('did mount')
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('should update', nextProps, nextState)
    return nextState.num % 2 === 0
  }

  componentWillUpdate() {
    console.log('will update')
  }

  componentDidUpdate() {
    console.log('did update')
  }

  onClick = () => {
    this.setState({
      num: this.state.num + 1
    })
  }

  render() {
    console.log('render')
    return (
      <div>
        <div>{ this.state.num }</div>
        <button onClick={ this.onClick }>+</button>
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
