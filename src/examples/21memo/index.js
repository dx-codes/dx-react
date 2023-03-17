import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const Counter = (props) => {
  console.log('render')
  return (
    <div>
      <div>counter</div>
      <div>{ props.num }</div>
    </div>
  )
}

const CounterMemo = React.memo(Counter)

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { num: 1 }
  }
  
  onClick = () => {
    // this.setState({
    //   num: this.state.num + 1
    // })
    this.setState(this.state)
  }

  render() {

    return (
      <div>
        <CounterMemo num={ this.state.num }/>
        <div>
          <button onClick={ this.onClick }>+</button>
        </div>
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
