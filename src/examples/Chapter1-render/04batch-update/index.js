import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num: 0,
      id: 1
    }
  }

  onAddClick = () => {
    console.log('add')
    this.setState({
      num: this.state.num + 1
    })
    this.setState({
      num: this.state.num + 1
    })
    this.setState({
      num: this.state.num + 1
    })
    this.setState({
      num: this.state.num + 1
    }) // 只会执行一次

    setTimeout(() => {
      this.setState({ num: this.state.num + 1 })
      this.setState({ num: this.state.num + 1 })
      // 全部执行
    }, 1000)
  }

  onSubClick = () => {
    console.log('sub')
    this.setState({
      num: this.state.num - 1
    })
    this.setState({
      num: this.state.num - 1
    })
  }

  render() {
    return (
      <div>
        <div>num: { this.state.num }</div>
        <div>
          <button id='1' onClick={ this.onAddClick }>+</button>
          <button id='2' onClick={ this.onSubClick }>-</button>
        </div>
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
