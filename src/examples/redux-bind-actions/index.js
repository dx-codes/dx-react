import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators, createStore } from './redux'
import 'reset-css'

const root = document.getElementById('root')

const reducer = (state, action) => {
  const type = action.type
  const payload = action.payload

  if (type === 'ADD') {
    return {
      ...state,
      num: state.num + payload
    }
  } else if (type === 'SUB') {
    return {
      ...state,
      num: state.num - payload
    }
  }

  return state
}

const store = createStore(reducer, { num: 1 })

const actionCreators = {
  add: (payload) => {
    return { type: 'ADD', payload }
  },

  sub: (payload) => {
    return { type: 'SUB', payload }
  }
}
const bindActions = bindActionCreators(actionCreators, store.dispatch)
console.log(bindActions)

const App = () => {
  const [num, setNum] = useState(store.getState().num)
  useEffect(() => {
    store.subscribe(() => {
      setNum(store.getState().num)
    })
  }, [])

  return (
    <div>
      <div>App</div>
      <div>{ num }</div>
      <button onClick={ () => bindActions.add(2) }>+</button>
      <button onClick={ () => bindActions.sub(2) }>-</button>
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

