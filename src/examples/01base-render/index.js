import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

/** @jsxRuntime classic */
/** @jsx React.createElement */
const element = (
  <div>
    <h1 className='title' style={{ fontSize: '24px', fontWeight: 'bold' }} >
      <span>Hello</span>
      <span> </span>
      <span>World</span>
    </h1>

    <p style={{ marginTop: '16px' }}>
      <span>content</span>
    </p>
  </div>
)
console.log(element)

ReactDOM.render(
  element,
  root
)
