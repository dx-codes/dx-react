import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

const AppContext = React.createContext()

const Counter = () => {
  const { num, setNum } = React.useContext(AppContext)

  return (
    <div>
      <div>{ num }</div>
      <div>
        <button onClick={ () => setNum(num + 1) }>+</button>
      </div>
    </div>
  )
}

const App = () => {
  const [num, setNum] = React.useState(0)

  return (
    <div>
      <div>App</div>
      <AppContext.Provider value={{ num, setNum }}>
        <Counter/>
      </AppContext.Provider>
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
