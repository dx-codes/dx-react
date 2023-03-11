import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

class Counter extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      num: 100,
    }
  }

  onClick = () => {
    this.setState({
      num: this.state.num
    })
  }

  render() {
    console.log('render') // 当props和state没有变化时，不会触发render
    return (
      <div>
        <div>
          <div>{ this.props.num }</div>
          <div>
            <button onClick={ this.props.onChange } >+1</button>
          </div>
        </div>

        <div>
          <div>{ this.state.num }</div>
          <div>
            <button onClick={ this.onClick } >-1</button>
          </div>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { num: 0 }
  }

  onChange = () => {
    this.setState({
      num: this.state.num + 1
    })
  }
  
  render() {
    return (
      <div>
        <Counter onChange={ this.onChange } num={ this.state.num }/>
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
