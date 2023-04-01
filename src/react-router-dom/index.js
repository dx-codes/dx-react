import React from 'react'
import { Router, useLocation, useNavigate } from '../react-router/index'
import { createBrowserHistory } from '../history'

export * from '../react-router/index'

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

export const Link = ({ to, children, ...rest }) => {
  const navigator = useNavigate()

  const onClick = (e) => {
    e.preventDefault()
    navigator(to)
  }

  return (
    <a { ...rest } onClick={ onClick } href={ to }>{ children }</a>
  )
}

export const NavLink = ({
  className = '',
  style = {},
  end = false,
  to,
  children,
  ...rest
}) => {
  const location = useLocation()
  const pathname = location.pathname

  let _style
  let _className
  const isActive = pathname === to
  if (typeof className === 'function') {
    _className = className({ isActive })
  } else {
    _className = className
  }

  if (typeof style === 'function') {
    _style = style({ isActive })
  } else {
    _style = style
  }

  return <Link { ...rest } style={ _style } className={ _className } to={ to }>{ children }</Link>
}

export const Navigate = ({ to }) => {
  const navigate = useNavigate()

  React.useEffect(() => {
    navigate(to)
  }, [navigate, to])

  return null
}