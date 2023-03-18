import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const Input = (props, ref) => {
  const inputRef = React.useRef()

  React.useImperativeHandle(ref, () => {
    return {
      focus: () => {
        inputRef.current.focus()
      }
    }
  }, [props.num])

  return (
    <div>
      <input ref={ inputRef }/>
    </div>
  )
}

const InputF = React.forwardRef(Input)

const App = () => {
  const ref = React.useRef()
  const [num, setNum] = React.useState(0)

  React.useEffect(() => {
    ref.current.focus()
  }, [num])

  return (
    <div>
      <div>App</div>
      <InputF num={ num } ref={ ref }/>
      <div>{ num }</div>
      <div>
        <button onClick={ () => setNum(num + 1) }>test</button>
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
