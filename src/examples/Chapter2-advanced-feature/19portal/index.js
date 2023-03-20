import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

class Modal extends React.Component {
  constructor(props) {
    super(props)

    this.container = document.createElement('div')
    this.container.style = `
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(00, 00, 00, 0.5);
        z-index: 9999;
        left: 0;
        top: 0;
      `
  }

  onClick = () => {
    this.props.onCancel()
  }

  render() {
    if (this.props.open) {
      document.body.appendChild(this.container)
      
      const portal = ReactDOM.createPortal(
        <div style={{ position: 'absolute', left: '300px', top: '300px', background: 'white', display: 'inline-block' }}>
          <div>title</div>
          <div>content</div>
          <button onClick={ this.onClick }>cancel</button>
        </div>,
        this.container
      )

      return portal

    } else {
      // this.container.setAttribute('style', '')
      return <></>
    }

  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  onClick = () => {
    this.setState({
      open: true
    })
  }

  onCancel = () => {
    this.setState({
      open: false
    })
  }

  render() {
    return (
      <div>
        <div>App</div>
        <div>
          <button onClick={ this.onClick }>show</button>
        </div>
        <Modal open={ this.state.open } onCancel={ this.onCancel }/>
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
