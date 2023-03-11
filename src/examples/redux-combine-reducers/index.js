import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from './redux'
import 'reset-css'

const root = document.getElementById('root')

const counterReducer = (state = { num: 1 }, action) => {
  const type = action.type
  const payload = action.payload

  if (type === 'ADD') {
    return {
      ...state,
      num: state.num + (payload || 1)
    }
  } else if (type === 'SUB') {
    return {
      ...state,
      num: state.num - (payload || 1)
    }
  }

  return state
}

const userReducer = (state = { login: false, userInfo: null }, action) => {
  const type = action.type

  if (type === 'LOGIN') {
    return {
      ...state,
      login: true,
      userInfo: {
        name: '123',
        age: 15
      }
    }
  } else if (type === 'LOGOUT') {
    return {
      ...state,
      login: false,
      userInfo: null,
    }
  }

  return state
}

const reducers = combineReducers({
  user: userReducer,
  counter: counterReducer,
})

const store = createStore(reducers, { counter: { num: 1 }, user: { userInfo: null, login: false }})

// const actionCreators = {
//   add: (payload) => {
//     return { type: 'ADD', payload }
//   },

//   sub: (payload) => {
//     return { type: 'SUB', payload }
//   }
// }
// const bindActions = bindActionCreators(actionCreators, store.dispatch)
// console.log(bindActions)

const App = () => {
  const [num, setNum] = useState(store.getState().counter.num)
  const [userInfo, setUserInfo] = useState(store.getState().user.userInfo)


  useEffect(() => {
    store.subscribe(() => {
      setNum(store.getState().counter.num)
      setUserInfo(store.getState().user.userInfo)
    })
  }, [])

  return (
    <div>
      <div>App</div>

      <div>
        <div>{ num }</div>
        <button onClick={ () => store.dispatch({ type: 'ADD' }) }>+</button>
        <button onClick={ () => store.dispatch({ type: 'SUB' }) }>-</button>
      </div>

      <div>
        <div>{ userInfo ? userInfo.name + ' : ' + userInfo.age : 'null' }</div>
        <button onClick={ () => store.dispatch({ type: 'LOGIN'}) }>login</button>
        <button onClick={ () => store.dispatch({ type: 'LOGOUT'}) }>login</button>
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

