import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: ['A', 'B', 'C', 'D', 'E', 'F'],
      list2: [<div key='div'>A</div>, <p key='p'>B</p>, <span key='span' style={{ display: 'block'}}>C</span>]
    }
  }

  onClick = () => {
    this.setState({
      // list: ['A', 'C', 'E', 'B', 'G'],
      list2: [<p key='p'>B</p>, <div key='div'>A</div>, <span key='span' style={{ display: 'block'}}>C</span>]
    })
  }

  render() {
    return (
      <div>
        <div>
          {
            this.state.list2.map((item) => {
              return item
            })
          }
        </div>
        <button onClick={ this.onClick }>change</button>
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
