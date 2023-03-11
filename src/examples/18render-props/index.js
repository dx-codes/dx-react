import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

class MousePoint extends React.Component {
  constructor(props) {
    super(props)
    this.state = { x: 0, y: 0 }
  }

  onMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }

  render() {
    return (
      <div style={{ width: '100%', height: '500px' }} onMouseMove={ this.onMouseMove }>
        {
          this.props.render
          ?
          this.props.render(this.state)
          :
          <div>
            <h1>鼠标位置</h1>
            <p>
              <span>x: </span><span>{ this.state.x }</span>
              <span> - </span>
              <span>y: </span><span>{ this.state.y }</span>
            </p>
          </div>
        }
      </div>
    )
  }
}

class App extends React.Component {

  render() {
    return (
      <div>
        <MousePoint render={
          (props) => {
            return (
              <div>
                <p>
                  <span>x: </span><span>{ props.x }</span>
                </p>
              </div>
            )
          }
        }/>
        <MousePoint/>
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
