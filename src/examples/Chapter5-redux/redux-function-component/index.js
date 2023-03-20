import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { createStore } from './redux'
import 'reset-css'

const root = document.getElementById('root')

const reducer = (state, action) => {
  const type = action.type

  if (type === 'ADD') {
    return {
      ...state,
      num: state.num + 1
    }
  } else if (type === 'SUB') {
    return {
      ...state,
      num: state.num - 1
    }
  }

  return state
}

const store = createStore(reducer, { num: 1 })


const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [_, setState] = useState(store.getState())

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setState(store.getState()))
    
    return () => {
      unsubscribe()
    }
  }, [])

  const onClick = (action) => {
    store.dispatch(action)
  }

  return (
    <div>
      <div>App</div>
      <div>{ store.getState().num }</div>
      <button onClick={ () => onClick({ type: 'ADD' }) } >+</button>
      <button onClick={ () => onClick({ type: 'SUB' })} >-</button>
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

