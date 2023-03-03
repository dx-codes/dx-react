import Updater from './updater'
import ReactDom from '../../react-dom'

class Component {
  static isReactComponent = true

  constructor(props) {
    this.props = props
    this.updater = new Updater(this)
  }

  setState(partialState) {
    this.updater.addState(partialState)
  }

  forceUpdate() {
    const renderVdom = this.render()
    renderVdom.component = this
    const oldRenderVdom = this.renderVdom

    ReactDom._update(oldRenderVdom.dom.parentElement, oldRenderVdom, renderVdom)
    this.renderVdom = renderVdom
  }

  render() {
    return <></>
  }
}

export default Component

export const invokeComponentDidMount = (component) => {
  if (component && component.componentDidMount) {
    component.componentDidMount()
  }
}

export const invokeGetDerivedStateFromProps = (component, nextProps, nextState) => {
  if (!component) {
    return
  }

  const getDerivedStateFromProps = component.constructor.getDerivedStateFromProps
  if (getDerivedStateFromProps) {
    const newState = getDerivedStateFromProps(nextProps, nextState)
    component.state = { ...component.state, ...newState }
  } else {
    component.state = nextState
  }
  
}

export const invokeComponentWillUnmount = (comopnent) => {
  if (!comopnent) {
    return
  }

  const componentWillUnmount = comopnent.componentWillUnmount
  componentWillUnmount && componentWillUnmount()
}