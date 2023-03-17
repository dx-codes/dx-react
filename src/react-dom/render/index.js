import { updateQueue } from '../../react/component/updater'
import { REACT_CONTEXT, REACT_FORWARD_REF, REACT_MEMO, REACT_MOVE, REACT_NEXT, REACT_NULL, REACT_PORTAL, REACT_PROVIDER, REACT_TEXT } from '../../react/createElement'
import addEvent, { isEvent } from './event'
import { disposeContextType, invokeComponentDidMount, invokeComponentWillUnmount, invokeGetDerivedStateFromProps } from '../../react/component'


export const normalizeChildren = (children) => {
  const _children = Array.isArray(children) ? children : children ? [children] : []
  return _children
}

export const mountChildren = (children, container) => {
  if (Array.isArray(children)) {
    children.forEach((child, index) => {
      child.mountIndex = index // 为diff做准备
      mount(child, container)
    })
  } else {
    // props.children.index = 0
    children.mountIndex = 0
    mount(children, container)
  }
}

export const updateProps = (dom, oldProps, newProps) => {
  if (newProps) {
    for (let propName in newProps) {
      if (propName === 'children') {
        continue
      } else if (propName === 'style') {
        for(let styleName in newProps.style) {
          dom.style[styleName] = newProps.style[styleName]
        }
      } else if(isEvent(propName)) {
        const listener = newProps[propName]
        const eventType = propName.toLowerCase()
        // 事件不和dom绑定，委托给document
        addEvent(dom, eventType, listener)
      } else  {
        dom[propName] = newProps[propName]
      }
    } 
  }

  if (oldProps) {
    for(let propName in oldProps) {
      if (!newProps[propName]) {
        dom[propName] = null
      } else if (propName === 'style') {
        for (let styleName in oldProps.style) {
          if (!newProps.style[styleName]) {
            dom.style[styleName] = null
          }
        }
      }
    }
  }
}

export const createDom = (vdom) => {
  const { type, props = {}, ref } = vdom
  let dom

  if (type === REACT_NULL) {
    dom = null

  } else if (type === REACT_TEXT) { // 文本组件
    dom = document.createTextNode(vdom.content)

  } else if (typeof type === 'function') { 
    if (type.isReactComponent) { // 类组件
      dom = mountClassComponent(vdom)
    } else { // 函数组件
      dom = mountFunctionComponent(vdom)
    }

  } else if (type && type.$$type === REACT_FORWARD_REF) { // FowardRef组件
    dom = mountForwardRef(vdom)

  } else if (type && type.$$type === REACT_CONTEXT) {
    dom = mountContext(vdom)

  } else if (type && type.$$type === REACT_PROVIDER) {
    dom = mountProvider(vdom)

  } else if (type && type.$$type === REACT_PORTAL) {
    dom = mountPortal(vdom)

  } else if (type && type.$$type === REACT_MEMO) {
    dom = mountMemo(vdom)

  } else { // 真实html

    // 创建dom
    dom = document.createElement(type)

    // 处理属性
    updateProps(dom, {}, props)

    // 处理children
    const children = props.children
    if (children) {
      mountChildren(children, dom, props)
    }

    if (ref) {
      ref.current = dom
    }
  }

  vdom.dom = dom

  return dom
}

export const mountContext = (c_vdom) => {
  const { type, props } = c_vdom
  const value = type._context._currentValue
  const renderVdom = props.children(value)

  c_vdom.renderVdom = renderVdom
  return createDom(renderVdom)
}

export const mountProvider = (p_vdom) => {
  const { type, props } = p_vdom
  type._context._currentValue = props.value

  const renderVdom = p_vdom.props.children
  p_vdom.renderVdom = renderVdom
  return createDom(renderVdom)
}

export const mountForwardRef = (fr_vdom) => {
  const { type, props, ref } = fr_vdom
  const vdom = type.render(props, ref)
  return createDom(vdom)
}

export const mountClassComponent = (vdom) => {
  const { type, props, ref } = vdom
  const component = new type(props)
  if (ref) {
    ref.current = component
  }

  disposeContextType(component)

  const componentWillMount = component.componentWillMount
  componentWillMount && componentWillMount()
  const renderVdom = component.render()
  component.renderVdom = renderVdom

  const dom = createDom(renderVdom)
  vdom.component = component
  renderVdom.component = component // 用于componentWillUnmount

  if (dom) {
    dom.component = component // 用于componentDidMount
  }

  return dom
}

export const mountFunctionComponent = (vdom) => {
  const { type, props } = vdom
  const renderVdom = type(props)
  vdom.renderVdom = renderVdom
  return createDom(renderVdom)
}

export const mountMemo = (m_vdom) => {
  const { type, props } = m_vdom

  const renderVdom = type.type(props)
  m_vdom.renderVdom = renderVdom
  
  return createDom(renderVdom)
}

export const mountPortal = (vdom) => {
  mount(vdom.children, vdom.containerInfo)
}

export const mount = (vdom, container) => {
  const dom = createDom(vdom)
  if (dom) {
    container.appendChild(dom)
    const component = dom.component
    if (component) {
      invokeGetDerivedStateFromProps(component, component.props, component.state)
      invokeComponentDidMount(component)
    }
  }
}

export const unmount = (vdom, newVdom) => {
  const { props, ref } = vdom

  const component = vdom.component
  invokeComponentWillUnmount(component)

  if (ref) {
    ref.current = null
  }

  if (vdom.type && vdom.$$type === REACT_PORTAL) {
    document.body.removeChild(vdom.containerInfo)
    return
  }

  if (props && props.children) {
    const children = normalizeChildren(props.children)
    children.forEach(child => unmount(child))
  }

  const dom = vdom.dom
  if (dom) {
    if (newVdom && newVdom.type && newVdom.$$type === REACT_PORTAL) {
      // portal时保存原来的parentDom，因为原来用来替换的非portal dom被remove后是无法拿到parentDom的
      newVdom.parentDom = dom.parentElement
    }

    dom.parentElement.removeChild(dom)
  }

}

export const invokeComponentUpdate = (component, nextProps, nextState, prevProps, prevState) => {
  disposeContextType(component)

  invokeGetDerivedStateFromProps(component, nextProps, nextState)

  let willUpdate = true
  const shouldComponentUpdate = component.shouldComponentUpdate
  if (shouldComponentUpdate) {
    willUpdate = !!shouldComponentUpdate.call(component, nextProps, nextState)
  }

  if (willUpdate) {
    component.props = nextProps
    component.state = nextState

    const componentWillUpdate = component.componentWillUpdate
    const componentDidUpdate = component.componentDidUpdate
    const getSnapshotBeforeUpdate = component.getSnapshotBeforeUpdate

    componentWillUpdate && componentWillUpdate(nextProps, nextState)
    const snapshot = getSnapshotBeforeUpdate && getSnapshotBeforeUpdate(prevProps, prevState)
    component.forceUpdate()
    componentDidUpdate && componentDidUpdate(prevProps, prevState, snapshot)
  }
}

export const _update_without_diff = (parentDom, oldVdom, newVdom) => {
  const newDom = createDom(newVdom)
  const oldDom = oldVdom.dom

  parentDom.replaceChild(newDom, oldDom)
}

// portalOldDom表示portal被加载前的dom，当下一次返回正常vdom而不是portal时用于找到前面的parentDom
export const patchVdom = (parentDom, vdom, nextDom) => {
  if (vdom.type === undefined) {
    return
  }

  const newDom = createDom(vdom)

  if (nextDom) {
    parentDom.insertBefore(newDom, nextDom)
  } else if (newDom) {
    parentDom.appendChild(newDom)
  }

  const component = vdom.component
  if (component) {
    invokeGetDerivedStateFromProps(component, component.props, component.state)
    invokeComponentDidMount(component)
  }

  vdom.dom = newDom
}

const _updateClassComponent = (parentDom, newVdom, oldVdom) => {
  const component = newVdom.component = oldVdom.component
  const nextProps = newVdom.props

  const componentWillReceiveProps = component.componentWillReceiveProps
  if (componentWillReceiveProps) {
    componentWillReceiveProps(nextProps)
  }

  const rawIsBatchData = updateQueue.isBatchData // 当外部为点击事件时，此时这个值为true，会导致
  updateQueue.isBatchData = false
  component.updater.emitUpdate(nextProps)
  updateQueue.isBatchData = rawIsBatchData
}

const _updateFunctionComponent = (parentDom, newVdom, oldVdom) => {
  const { type, props } = newVdom
  const newRenderVdom = type(props)
  _update(parentDom, oldVdom.renderVdom, newRenderVdom)
  newVdom.renderVdom = newRenderVdom
}

const _updateProvider = (parentDom, newVdom, oldVdom) => {
  const { type, props } = newVdom
  type._context._currentValue = props.value

  const renderVdom = props.children
  _diff(parentDom, oldVdom.renderVdom, renderVdom)
  newVdom.renderVdom = renderVdom
}

const _updateContext = (parentDom, newVdom, oldVdom) => {
  const { type, props } = newVdom

  const value = type._context._currentValue
  const renderVdom = props.children(value)
  _diff(parentDom, oldVdom.renderVdom, renderVdom)
  newVdom.renderVdom = renderVdom
}

const _updateMemo = (parentDom, newVDom, oldVDom) => {
  const { props: oldProps } = oldVDom
  const { props: newProps } = newVDom
  const { compare, type } = newVDom.type

  if (compare(oldProps, newProps)) {
    newVDom.renderVdom = oldVDom.renderVdom
    newVDom.dom = oldVDom.dom
  } else {
    const renderVdom = type(newProps)
    _diff(parentDom, oldVDom.renderVdom, renderVdom)
    newVDom.renderVdom = renderVdom
  }
}

const _diff_simple = (parentDom, oldChildren, newChildren) => {
  const _oldChildren = normalizeChildren(oldChildren)
  const _newChildren = normalizeChildren(newChildren)

  const maxLength = Math.max(_oldChildren.length, _newChildren.length)
  for(let i = 0; i < maxLength; i++) {
    const nextDom = _oldChildren.find((item, index) => item && index > i)?.dom
    _update(parentDom, _oldChildren[i], _newChildren[i], nextDom)
  }
}

const _diff = (parentDom, oldChildren, newChildren) => {

  const makeCacheMap = (children) => {
    const map = {}
    children.forEach((child, index) => {
      const key = child.key !== null && child.key !== undefined ? child.key : index // 0的话也会用index，不符合需求
      map[key] = child
    })

    return map
  }

  const _oldChildren = normalizeChildren(oldChildren)
  const _newChildren = normalizeChildren(newChildren)

  // 将老的children缓存起来用以复用
  const oldChildrenMap = makeCacheMap(_oldChildren)

  // 遍历新的进行处理
  let lastPlaceIndex = 0
  const patch = []

  _newChildren.forEach((newChild, index) => {
    newChild.mountIndex = index

    if (newChild.type === REACT_NULL) { // 新节点为空时，结束当前循环，后面oldChild对应的dom会被直接删除
      return
    } 

    const newKey = newChild.key !== null && newChild.key !== undefined ? newChild.key : index
    const oldChild = oldChildrenMap[newKey]

    if (oldChild && oldChild.type !== REACT_NULL) { // 缓存可用且不为NULL节点，更新属性和children
      _updateElement(parentDom, oldChild, newChild)
      if (oldChild.mountIndex < lastPlaceIndex) {
        patch.push({
          _type: REACT_MOVE,
          _old: oldChild,
          _new: newChild,
          _mountIndex: index
        })
      }

      delete oldChildrenMap[newKey]
      lastPlaceIndex = Math.max(oldChild.mountIndex, newChild.mountIndex)

    } else {
      patch.push({
        _type: REACT_NEXT,
        _new: newChild,
        _mountIndex: index
      })
    }
  })

  // 删除所有不再需要的元素，包括需要移动的（因为移动的元素已经在patch中缓存了，需要从原位置删除放到正确的位置上去）
  const moveVdoms = patch.filter(item => item._type === REACT_MOVE).map(item => item._old)
  moveVdoms.forEach(vdom => {
    if (vdom.dom) { // NULL节点没有dom
      parentDom.removeChild(vdom.dom)
    }
  })

  const removeVdoms = Object.values(oldChildrenMap)
  removeVdoms.forEach(vdom => {
    if (vdom.dom) {
      unmount(vdom, true)
      parentDom.removeChild(vdom.dom)
    }
  })
  

  patch.forEach(item => {
    const { _type, _new: newVdom, _old, _mountIndex } = item

    const rawDomArr = parentDom.childNodes
    let newDom
    if (_type === REACT_NEXT) {
      newDom = createDom(newVdom)
      
    } else if (_type === REACT_MOVE) {
      newDom = newVdom.dom
    }

    const nextDom = rawDomArr[_mountIndex]
    if (nextDom) {
      parentDom.insertBefore(newDom, nextDom)
    } else {
      parentDom.appendChild(newDom)
    }
  })
}

function _updateElement(parentDom, oldVdom, newVdom) {
  const currentDom = oldVdom.dom
  const type = newVdom.type

  if (type && type.$$type === REACT_PROVIDER) {
    _updateProvider(parentDom, newVdom, oldVdom)

  } else if (type && type.$$type === REACT_CONTEXT) {
    _updateContext(parentDom, newVdom, oldVdom)

  } else if (type && type.$$type === REACT_MEMO) {
    _updateMemo(parentDom, newVdom, oldVdom)

  } else if (type === REACT_TEXT) {
    // todo 直接赋值会导致<div>text<div>1234</div></div> => <div>newText</div> 后面的<div>1234</div>会被全部覆盖掉
    parentDom.textContent = newVdom.content

  } else if (typeof type === 'string') {
    updateProps(currentDom, oldVdom.props, newVdom.props)
    // _diff_simple(currentDom, oldVdom.props.children, newVdom.props.children)
    _diff(currentDom, oldVdom.props.children, newVdom.props.children)

  } else if (typeof type === 'function') {
    if (oldVdom.type.isReactComponent) { // 类组件
      _updateClassComponent(parentDom, newVdom, oldVdom)

    } else { // 函数组件
      _updateFunctionComponent(parentDom, newVdom, oldVdom)
    }
  }

  newVdom.dom = currentDom
}

export const _update = (parentDom, oldVdom, newVdom, nextDom) => {
  if (!oldVdom && !newVdom) {
    return 

  } else if (oldVdom && !newVdom) {
    unmount(oldVdom)

  } else if (!oldVdom && newVdom) {
    patchVdom(parentDom, newVdom, nextDom)

  } else { // oldVdom && newVdom
    if (oldVdom.type !== newVdom.type) {
      unmount(oldVdom, newVdom)
      patchVdom(parentDom, newVdom, nextDom)

    } else {
      _updateElement(parentDom, oldVdom, newVdom)
    }
  }
}

export const createPortal = (vdom, container) => {
  return {
    $$type: REACT_PORTAL,
    children: vdom,
    containerInfo: container,
    type: { $$type: REACT_PORTAL }
  }
}


export let hooksUpdater
export default function render(vdom, container) {
  mount(vdom, container)

  hooksUpdater = () => {
    _update(container, vdom, vdom)
  }
}