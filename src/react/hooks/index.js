import { hooksUpdater } from '../../react-dom/render'

const hooksState = []
let hooksIndex = 0

const update = () => {
  hooksIndex = 0
  hooksUpdater()
}

export const useState = (initialState) => {
  const state = hooksState[hooksIndex] = hooksState[hooksIndex] || initialState
  const index = hooksIndex

  const setState = (newState) => {
    hooksState[index] = newState
    update()
  }

  hooksIndex++

  return [state, setState]
}

export const useReducer = (reducer, initialState) => {
  const state = hooksState[hooksIndex] = hooksState[hooksIndex] || initialState
  const index = hooksIndex

  const dispatch = (action) => {
    const newState = reducer(state, action)
    hooksState[index] = newState
    update()
  }

  hooksIndex++

  return [state, dispatch]
}

const isDepsSame = (prevDeps, nextDeps) => {
  if (!prevDeps && !nextDeps) {
    return true
  } else if ((prevDeps && !nextDeps) || (!prevDeps && nextDeps)) {
    return false
  }

  return prevDeps.every((prevDep, index) => prevDep === nextDeps[index])
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