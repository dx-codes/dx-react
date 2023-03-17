import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const App = () => {
  const [num, setNum] = React.useState(0)
  
  React.useEffect(() => {
    console.log('callback')

    return () => {
      console.log('destroy')
    }
  }, [num])

  const onClick = () => {
    setNum(num + 1)
  }

  return (
    <div>
      <div>{ num }</div>
      <div>
        <button onClick={ onClick } >+</button>
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
