import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const reducer = (state, action) => {
  const type = action.type

  if (type === 'ADD') {
    return {
      ...state,
      num1: state.num1 + 1
    }
  } else if (type === 'SUB') {
    return {
      ...state,
      num2: state.num2 - 1
    }
  }

  return state 
}

const App = () => {
  const [state1, dispatch1] = React.useReducer(reducer, { num1: 1, num2: 100 })
  const [state2, dispatch2] = React.useReducer(reducer, { num1: 3, num2: 200 })

  const onAdd1 = () => {
    dispatch1({ type: 'ADD' })
  }

  const onSub1 = () => {
    dispatch1({ type: 'SUB' })
  }

  const onAdd2 = () => {
    dispatch2({ type: 'ADD' })
  }

  const onSub2 = () => {
    dispatch2({ type: 'SUB' })
  }

  return (
    <div>
      <div>state1</div>
      <div>{ state1.num1 }</div>
      <div>
        <button onClick={ onAdd1 }>+</button>
      </div>
      <div>{ state1.num2 }</div>
      <div>
        <button onClick={ onSub1 }>-</button>
      </div>
      <div>state2</div>
      <div>{ state2.num1 }</div>
      <div>
        <button onClick={ onAdd2 }>+</button>
      </div>
      <div>{ state2.num2 }</div>
      <div>
        <button onClick={ onSub2 }>-</button>
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
