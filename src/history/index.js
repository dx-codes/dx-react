export function createBrowserHistory() {
  const globalHistory = window.history
  let listeners = []

  const go = (delta) => {
    console.log('go')
    globalHistory.go(delta)
  }

  const goBack = () => {
    console.log('back')
    globalHistory.back()
  }

  const goForward = () => {
    console.log('forward')
    globalHistory.forward()
  }

  const push = (pathname, nextState) => {
    // const action = 'PUSH'
    console.log('push')

    let _state
    let _pathname
    if (typeof pathname === 'object') {
      _state = pathname.state
      _pathname = pathname.pathname
    } else {
      _state = nextState
      _pathname = pathname
    }

    globalHistory.pushState(_state, null, _pathname)
    notify({ location: { pathname, state: _state }, action: 'POP' })
  }

  const listen = (listener) => {
    listeners.push(listener)

    return () => {
      listeners = listeners.filter(item => item !== listener)
    }
  }

  const notify = (newState) => {
    Object.assign(history, newState)
    history.length = globalHistory.length
    listeners.forEach(listener => listener({ location: history.location }))
  }

  window.onpopstate = () => {
    console.log('onpopstate')
    const location = { pathname: window.location.pathname, state: window.location.state }
    notify({ location, action: 'POP' })
  }

  const history = {
    action: 'POP',
    go,
    goBack,
    goForward,
    push,
    listen,
    location: {
      pathname: window.location.pathname,
      state: window.location.state
    },
    __tag: 'dx'
  }

  return history
}