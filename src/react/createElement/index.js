export const REACT_ELEMENT = Symbol('react.element')
export const REACT_TEXT = Symbol('react.text')
export const REACT_NULL = Symbol('react.null')
export const REACT_FORWARD_REF = Symbol('react.foward_ref')

export const REACT_MOVE = Symbol('react.move')
export const REACT_NEXT = Symbol('react.next')

export const makeVdom = (vdom) => {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return {
      $$type: REACT_TEXT,
      type: REACT_TEXT,
      content: vdom
    }
  } else if (vdom === false) {
    return {
      $$type: REACT_NULL,
      type: REACT_NULL,
    }
  }

  return vdom
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
    $$typeof: REACT_ELEMENT,
    type,
    key,
    props,
    ref,
    __tag: 'dx'
  }
}