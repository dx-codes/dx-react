import ReactDom from '../../react-dom'

export const updateQueue = {
  isBatchData: false,

  updaters: [],

  batchUpdate() {
    updateQueue.updaters.forEach(updater => updater.updateComponent())
    updateQueue.isBatchData = false
    updateQueue.updaters.length = 0
  }
}

class Updater {
  constructor(component) {
    this.component = component
    this.pendingState = []
  }

  addState(partialState) {
    this.pendingState.push(partialState)
    this.emitUpdate()
  }

  emitUpdate(nextProps) {
    if (updateQueue.isBatchData) { // 批量更新封装在react-dom/render/event.js中，对dom事件中的setState进行了合并
      if (!updateQueue.updaters.includes(this)) {
        updateQueue.updaters.push(this)
      }
    } else {
      this.updateComponent(nextProps)
    }
  }

  updateComponent(nextProps) {
    const prevProps = this.component.props
    if (!nextProps) {
      nextProps = prevProps
    }
    const prevState = this.component.state
    const nextState = this.getState()

    // const hasChanged = 
    //   nextProps !== prevProps || 
    //   prevState !== nextState

    // if (hasChanged) { // PureComponent才执行，否则默认全部更新
      // const prevProps = { ...prevProps }
      // const prevState = { ...prevState }
    //   ReactDom.invokeComponentUpdate(this.component, nextProps, nextState, prevProps, prevState)
    // }

    ReactDom.invokeComponentUpdate(this.component, nextProps, nextState, prevProps, prevState)
  }

  getState() {
    let state = { ...this.component.state } // 不在这里改变component.state的引用，后面还要在其他地方用到
    this.pendingState.forEach(_state => {
      state = { ...state, ..._state }
    })
    this.pendingState.length = 0
    return state
  }
}

export default Updater