import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const App = () => {

  const ref = React.useRef()
  const [num, setNum] = React.useState(0)

  React.useEffect(() => {
    setTimeout(() => {
      ref.current.style.transform = 'translate(500px)'
      ref.current.style.transition = 'all 3s'
    }, 1000)
  }, [])

  return (
    <div>
      <div>App</div>
      <div style={{ background: 'red', width: '40px', height: '40px', borderRadius: '50%' }} ref={ ref }></div>
    
      <div>{ num }</div>
      <div>
        <button onClick={ () => setNum(num + 1) } >+</button>
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
