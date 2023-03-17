import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const App = () => {
  const [num1, setNum1] = React.useState(0)
  const [num2, setNum2] = React.useState(100)

  const onAdd = () => {
    setNum1(num1 + 1)
  }

  const onSub = () => {
    setNum2(num2 - 1)
  }

  return (
    <div>
      <div>App</div>
      <div>{ num1 }</div>
      <div>
        <button onClick={ onAdd }>+</button>
      </div>
      <div>{ num2 }</div>
      <div>
        <button onClick={ onSub }>-</button>
      </div>
    </div>
  )
}

/** @jsxRuntime classic */
/** @jsx React.createElement */
const element = (<App />)
console.log(element)

ReactDOM.render(
  element,
  root
)
