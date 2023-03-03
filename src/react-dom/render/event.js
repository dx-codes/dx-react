import { updateQueue } from '../../react/component/updater'

export const isEvent = (propName) => {
  return propName?.startsWith('on')
}

export const cropEventName = (propName) => {
  if (isEvent(propName)) {
    return propName?.replace('on', '').toLowerCase()
  }
}

const preventDefault = (event) => {
  if (event?.preventDefault) {
    event.preventDefault()
  }
}

const createEvent = (nativeEvent) => {
  const syntheticBaseEvent = {}
  for(const key in nativeEvent) {
    syntheticBaseEvent[key] = nativeEvent[key]
  }
  syntheticBaseEvent.nativeEvent = nativeEvent
  syntheticBaseEvent.preventDefault = preventDefault
  return syntheticBaseEvent
}

const dispatchEvent = (event) => {
  const { target: dom, type } = event
  const eventType = `on${type}`
  const store = dom.store
  const hanlder = store && store[eventType]
  
  const syntheticBaseEvent = createEvent(event)
  // 实现合并更新
  updateQueue.isBatchData = true
  hanlder && hanlder(syntheticBaseEvent)  // 这里多个setState的执行会被合并
  updateQueue.batchUpdate()
}

const addEvent = (dom, eventType, handler) => {
  const store = dom.store || (dom.store = {})
  
  if (handler) {
    store[eventType] = handler
    document[eventType] = dispatchEvent
  }
}

export default addEvent