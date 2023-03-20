import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')


const ColorTheme = React.createContext()

// ===== context 获取方法 ===== //
// 1、static contextType = XXContext 注意一定要叫contextType，但使用的时候是this.context
// 2、ColorTheme.Consumer

// <div>staticMethod</div>
// <div>{ this.context.num }</div>
class Page extends React.Component {

  static contextType = ColorTheme

  onClick = (value) => {
    value.changeNum(value.num + 1)
  }

  render() {
    return (
      <div>
        <div>Page</div>

        <div>staticMethod</div>
        <div>{ this.context.num }</div>

        <div>cosumerMethod</div>
        <ColorTheme.Consumer>
          {
            (value) => (
              <div>
                <div>{ value.num }</div>
                <Header/>
                <Content/>
              </div>
            )
          }
        </ColorTheme.Consumer>
      </div>
    )
  }
}

class Header extends React.Component {

  render() {
    return (
      <ColorTheme.Consumer>
        {
          (value) => {
            return (
              <div>
                <div>Header</div>
                <div>{ value.num }</div>
              </div>
            )
          }
        }
      </ColorTheme.Consumer>
    )
  }
}

class Content extends React.Component {

  onClick = (value) => {
    value.changeNum(value.num + 1)
  }

  render() {
    return (
      <ColorTheme.Consumer>
        {
          (value) => {
            return (
              <div>
                <div>Content</div>
                <div>{ value.num }</div>
                <button onClick={ () => this.onClick(value) }>change</button>
              </div>
            )
          }
        }
      </ColorTheme.Consumer>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num: 1
    }
  }

  changeNum = (num) => {
    this.setState({
      num
    })
  }

  render() {
    const context = { changeNum: this.changeNum, num: this.state.num }
    return (
      <ColorTheme.Provider value={ context }>
        <div>
          <div>App</div>
          <div>{ this.state.num }</div>
          <Page/>
        </div>
      </ColorTheme.Provider>
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
