import React from 'react'
import ReactDOM from 'react-dom'
import 'reset-css'

const root = document.getElementById('root')


// 高阶组件属性1，属性复用
class Hello extends React.Component {
  render() {
    return (
      <div>
        <h1>hello</h1>
        <button onClick={ this.props.show }>show</button>
        <button onClick={ this.props.hide }>hide</button>
      </div>
    )
  }
}

const wrapper1 = (OldComponent) => {
  return class extends React.Component {
    render() {
      const handlers = {
        show() {
          console.log('show')
        },

        hide() {
          console.log('hide')
        }
      }

      return (
        <div>
          <OldComponent { ...handlers } ></OldComponent>
        </div>
      )
    }
  }
}
const NHello = wrapper1(Hello)


// 高阶组件属性2：反向继承
class Button extends React.Component {

  render() {
    return (
      <button>{ this.props.text }</button>
    )
  }
}

const wrapper2 = (OldComponent) => {
  return class extends OldComponent {
    constructor(props) {
      super(props)
      this.state = { num: 1 }
    }

    onClick = () => {
      this.setState({
        num: this.state.num + 1
      })
    }

    render() {
      const vdom = super.render()
      const newProps = {
        ...vdom.props,
        onClick: this.onClick
      }

      return React.cloneElement(vdom, newProps, this.state.num)
    }
  }
}

const NButton = wrapper2(Button)

class App extends React.Component {
  render() {
    return (
      <div>
        <NHello/>
        <NButton text='btn' />
      </div>
    )
  }
}

/** @jsxRuntime classic */
/** @jsx React.createElement */
const element = (<App />)
console.log(element)

ReactDOM.render(
  element,
  root
)
