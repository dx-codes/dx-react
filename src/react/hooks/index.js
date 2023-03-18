import { hooksUpdater } from '../../react-dom/render'

const isDepsSame = (prevDeps, nextDeps) => {
  if (!prevDeps && !nextDeps) {
    return true
  } else if ((prevDeps && !nextDeps) || (!prevDeps && nextDeps)) {
    return false
  }

  return prevDeps.every((prevDep, index) => prevDep === nextDeps[index])
}

const hooksState = []
let hooksIndex = 0

const update = () => {
  hooksIndex = 0
  hooksUpdater()
}

// 没有useReducer时的实现
export const _useState = (initialState) => {
  const state = hooksState[hooksIndex] = hooksState[hooksIndex] || initialState
  const index = hooksIndex

  const setState = (newState) => {
    hooksState[index] = newState
    update()
  }

  hooksIndex++

  return [state, setState]
}

export const useState = (initialState) => {
  return useReducer(null, initialState)
}

export const useReducer = (reducer, initialState) => {
  const state = hooksState[hooksIndex] = hooksState[hooksIndex] || initialState
  const index = hooksIndex

  const dispatch = (action) => {
    if (!action) {
      return
    }

    let newState

    if (reducer) {
      newState = reducer(state, action)

    } else { // useState
      if (typeof action === 'function') { // setState(num => num + 1)
        newState = action(state)

      } else {
        newState = action
      }
      
    }

    hooksState[index] = newState
    update()
  }

  hooksIndex++

  return [state, dispatch]
}

export const useMemo = (factory, dependecies) => {
  let _state
  if (hooksState[hooksIndex] === undefined) {
    _state = factory()
    hooksState[hooksIndex] = [_state, dependecies]

  } else {
    const [prevState, prevDeps] = hooksState[hooksIndex]
    if (isDepsSame(prevDeps, dependecies)) {
      _state = prevState
    } else {
      _state = factory()
      hooksState[hooksIndex] = [_state, dependecies]
    }
  }

  hooksIndex++
  return _state
}

export const useCallback = (handler, dependecies) => {
  let _handler
  if (hooksState[hooksIndex] === undefined) {
    _handler = handler
    hooksState[hooksIndex] = [_handler, dependecies]

  } else {
    const [prevHandler, prevDeps] = hooksState[hooksIndex]
    if (isDepsSame(prevDeps, dependecies)) {
      _handler = prevHandler

    } else {
      _handler = handler
      hooksState[hooksIndex] = [_handler, dependecies]

    }
  }

  hooksIndex++
  return _handler
}

export const useEffect = (callback, dependecies) => {
  const invoke = (index) => {
    setTimeout(() => {
      const destroy = callback()
      hooksState[index] = [destroy, dependecies]
    })
  }

  if (hooksState[hooksIndex] === undefined) {
    invoke(hooksIndex)

  } else {
    const [prevDestroy, prevDeps] = hooksState[hooksIndex]
    if(!isDepsSame(prevDeps, dependecies)) {
      prevDestroy && prevDestroy()
      invoke(hooksIndex)
    }
    
  }

  hooksIndex++
}

export const useLayoutEffect = (callback, dependecies) => {
  const invoke = (index) => {
    queueMicrotask(() => {
      const destroy = callback()
      hooksState[index] = [destroy, dependecies]
    })
  }

  if(hooksState[hooksIndex] === undefined) {
    invoke(hooksIndex)

  } else {
    const [prevDestroy, prevDeps] = hooksState[hooksIndex]
    if (!isDepsSame(prevDeps, dependecies)) {
      prevDestroy()
      invoke(hooksIndex)
    }

  }

  hooksIndex++
}

export const useRef = (initialState) => {
  hooksState[hooksIndex] = hooksState[hooksIndex] || { current: initialState }
  return hooksState[hooksIndex++]
}

export const useImperativeHandle = (ref, handlerFactory, dependecies) => {
  
  if (hooksState[hooksIndex] === undefined) {
    const handler = handlerFactory()
    ref.current = handler
    hooksState[hooksIndex] = [handler, dependecies]

  } else {
    const [prevHandler, prevDeps] = hooksState[hooksIndex]
    if (!isDepsSame(prevDeps, dependecies)) {
      const handler = handlerFactory()
      ref.current = handler
      hooksState[hooksIndex] = [handler, dependecies]

    } else {
      ref.current = prevHandler
    }
  }

  hooksIndex++
}

export const useContext = (context) => {
  return context._currentValue
}