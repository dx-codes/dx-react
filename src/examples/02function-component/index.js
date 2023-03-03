import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const Hello = (props) => {
  return (
    <div style={ props.style }>
      <p>hello { props.name }</p>
    </div>
  )
}

const App = (props) => {
  return (
    <div style={ props?.style }>
      <h1>{ props?.title }</h1>
      <Hello name='world' style={{ color: 'green' }}/>
    </div>
  )
}

/** @jsxRuntime classic */
/** @jsx React.createElement */
const element = <App title='FC' style={{ fontSize: '24px', color: 'red' }} />
console.log(element)

ReactDOM.render(
  element,
  root
)
