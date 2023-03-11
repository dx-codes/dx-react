import Updater from './updater'
import ReactDom from '../../react-dom'
import { isEqual } from '../utils'

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

    // Portal加载的时候，会在之前dom unmount时把parentDom存起来
    const parentDom = 
      oldRenderVdom.dom ? oldRenderVdom.dom.parentElement : oldRenderVdom.parentDom

    ReactDom._update(parentDom, oldRenderVdom, renderVdom)
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
    nextState = { ...nextState, ...newState }
  }
  
}

export const invokeComponentWillUnmount = (comopnent) => {
  if (!comopnent) {
    return
  }

  const componentWillUnmount = comopnent.componentWillUnmount
  componentWillUnmount && componentWillUnmount()
}

export const disposeContextType = (component) => {
  if (!component) {
    return
  }

  const contextType = component.constructor.contextType
  if (contextType) {
    component.context = contextType._currentValue
  }
}

export class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const isPropsChanged = !isEqual(this.props, nextProps)
    const isStateChanged = !isEqual(this.state, nextState)

    return isPropsChanged || isStateChanged
  }
}