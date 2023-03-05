import { REACT_CONTEXT, REACT_PROVIDER } from '../createElement'

/**
 * ==== <Context.Provider>{ children }</Context.Provider>的虚拟dom ====
 * {
 *   props: {
 *     value: value // 外部传入的value,
 *     children: any // 实际包裹的子vdom, 参考createElement
 *   },
 *   type: {
 *     $$type: Symbol('react.provider'),
 *     _context: context // 真正的通过React.createContext创建的context对象
 *   }
 * }
 * 
 * ==== <Context.Consumer>{ (value) => vdom }</Context.Consumer>的虚拟dom ====
 * {
 *   props: {
 *     children: (value) => vdom // 实际包裹的是一个函数，需要在render时单独处理
 *   },
 *   type: {
 *     $$type: Symbol('react.context'),
 *     _context: context // 真正的通过React.createContext创建的context对象
 *   }
 * }
 * 
 * @returns 
 */
export default function createContext() {
  const context = {
    $$type: REACT_CONTEXT,
    _currentValue: undefined,
  }

  context.Provider = {
    $$type: REACT_PROVIDER,
    _context: context
  }

  context.Consumer = {
    $$type: REACT_CONTEXT,
    _context: context
  }

  return context
}