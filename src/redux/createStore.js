export const createStore = (reducer, initState) => {
  let state = initState
  let listeners = []

  const getState = () => {
    return state
  }

  const dispatch = (action) => {
    const newState = reducer(state, action)
    if (newState !== state) {
      state = newState
      listeners.forEach(l => l())
    }
  }

  const subscribe = (listener) => {
    listeners.push(listener)

    return () => {
      listeners = listeners.filter(item => item !== listener)
    }
  }

  return {
    getState,
    dispatch,
    subscribe,
  }
}