export const combineReducers = (reducers) => {

  const reducerKeys = Object.keys(reducers)

  return (combinedPrevState, action) => {
    const nextCombineState = {}
    let hasChanged = false

    for(let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i]

      const prevState = combinedPrevState[key]
      const reducer = reducers[key]
      const newState = reducer(prevState, action)
      if (!hasChanged && newState !== prevState) {
        hasChanged = true
      }

      nextCombineState[key] = newState
    }

    return hasChanged ? nextCombineState : combinedPrevState
  }
}