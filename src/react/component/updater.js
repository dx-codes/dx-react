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
    if (nextProps || this.pendingState.length > 0) {
      const prevProps = { ...this.component.props }
      const prevState = { ...this.component.state }
      ReactDom.invokeComponentUpdate(this.component, nextProps, this.getState(), prevProps, prevState)
    }
  }

  getState() {
    let { state } = this.component
    this.pendingState.forEach(_state => {
      state = { ...state, ..._state }
    })
    this.pendingState.length = 0
    return state
  }
}

export default Updater