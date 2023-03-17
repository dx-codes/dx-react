import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

/**
 * 1、React.memo包裹对应函数组件
 * 2、React.useMemo包裹对应数据
 * 3、React.useCallback包裹对应setState方法
 */
const Counter = ({ num, onClick }) => {
  console.log('render') // 使用memo时，改变input的值，这里不会触发
  return (
    <div>
      <div>{ num }</div>
      <div>
        <button onClick={ onClick }>+</button>
      </div>
    </div>
  )
}
const CounterMemo = React.memo(Counter)

const App = () => {
  const [num, setNum] = React.useState(0)
  const [name, setName] = React.useState('name1')

  const onChange = (event) => {
    setName(event.target.value)
  }

  const onClick = React.useCallback(() => {
    setNum(num + 1)
  }, [num])

  const numMemo = React.useMemo(() => num, [num])

  return (
    <div>
      <div>
        <div>{ name }</div>
        <input value={ name } onChange={ onChange }/>
      </div>

      <CounterMemo num={ numMemo } onClick={ onClick }/>
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
