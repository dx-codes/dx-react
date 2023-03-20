import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const reducer = (state, action) => {
  const type = action.type
  if (type === 'ADD') {
    return {
      num: state.num + 1
    }
  }

  return state
}

const App = () => {
  const [num1, setNum1] = React.useState(0)
  const [num2, setNum2] = React.useState(100)
  const [num3, setNum3] = React.useState(50)
  const [data, setData] = React.useState({ num: 4 })
  const [state, dispatch] = React.useReducer(reducer, { num: 5 })

  const onAdd = () => {
    setNum1(num1 + 1)
  }

  const onSub = () => {
    setNum2(num2 - 1)
  }

  const onAdd3 = () => {
    setNum3(num => num + 1)
  }

  const onAdd4 = () => {
    setData({ num: data.num + 1 })
  }

  const onAdd5 = () => {
    dispatch({ type: 'ADD' })
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
      <div>{ num3 }</div>
      <div>
        <button onClick={ onAdd3 }>+</button>
      </div>
      <div>{ data.num }</div>
      <div>
        <button onClick={ onAdd4 }>+</button>
      </div>
      <div>{ state.num }</div>
      <div>
        <button onClick={ onAdd5 }>+</button>
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
