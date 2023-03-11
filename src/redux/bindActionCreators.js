export const bindActionCreators = (actionCreators, dispatch) => {
  const bindActions = {}
  Object.entries(actionCreators).forEach(entry => {
    const [actionName, handler] = entry

    bindActions[actionName] = (...args) => {
      return dispatch(handler(...args))
    }
  })


  return bindActions
}
