import React from 'react'
import { Router } from '../react-router'
import { createBrowserHistory, createHashHistory } from '../history'

export * from '../react-router'

export const BrowserRouter = ({ children }) => {
  const historyRef = React.useRef()

  if (!historyRef.current) {
    historyRef.current = createBrowserHistory()
  }

  let history = historyRef.current
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location
  })

  React.useLayoutEffect(() => {
    history.listen(update => setState(update)) // { action, location }

  }, [history])

  return (
    <Router
      children={ children }
      location={ state.location }
      navigationType={ state.action }
      navigator={ history }
      />
  )
}

export const HashRouter = (_ref) => {

}
