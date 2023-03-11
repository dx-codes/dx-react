import { isEqual } from '../utils'

export const REACT_ELEMENT = Symbol('react.element')
export const REACT_TEXT = Symbol('react.text')
export const REACT_NULL = Symbol('react.null')
export const REACT_FORWARD_REF = Symbol('react.foward_ref')
export const REACT_CONTEXT = Symbol('react.context')
export const REACT_PROVIDER = Symbol('react.provider')
export const REACT_PORTAL = Symbol('react.portal')
export const REACT_MEMO = Symbol('react.memo')

export const REACT_MOVE = Symbol('react.move')
export const REACT_NEXT = Symbol('react.next')

export const makeVdom = (vdom) => {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return {
      $$type: REACT_TEXT,
      type: REACT_TEXT,
      content: vdom
    }
  } else if (vdom === false || !vdom.type) {
    return {
      $$type: REACT_NULL,
      type: REACT_NULL,
    }
  }

  return vdom
}

export const normalizeChildrenVdoms = (children, props, args) => {
  /**
     * 1、没有children
     * 2、一个child: text number element
     * 3、多个children
     */
  if (args.length > 1) { // 多个
    props.children = args.map(makeVdom) // 此时为数组
  } else if (args.length === 1) { // 单个
    props.children = makeVdom(children)
  }
}

export default function createElement(type, config, children) {

  // 处理key和ref，key和ref在config中，但是虚拟dom中不在props中
  let key = null
  let ref = null
  if (config) {
    if (config.key) {
      key = config.key
      delete config.key
    }

    if (config.ref) {
      ref = config.ref
      delete config.ref
    }
  }


  // 处理props
  const props = { ...config } // 如果config为null，此时props为{}

  /**
     * 1、没有children
     * 2、一个child: text number element
     * 3、多个children
     */
  if (arguments.length > 3) { // 多个
    props.children = Array.prototype.slice.call(arguments, 2).map(makeVdom) // 此时为数组
  } else if (arguments.length === 3) { // 单个
    props.children = makeVdom(children)
  }

  return {
    $$typeof: !type ? REACT_NULL : REACT_ELEMENT,
    type: !type ? REACT_NULL : type,
    key,
    props,
    ref,
    __tag: 'dx'
  }
}

export function cloneElement(vdom, props, children) {
  const args = Array.prototype.slice.call(arguments, 2)
  normalizeChildrenVdoms(children, props, args)

  return {
    ...vdom,
    props,
  }
}

export function memo(type, compare = isEqual) {
  return {
    $$type: REACT_MEMO,
    compare,
    type,
  }
}