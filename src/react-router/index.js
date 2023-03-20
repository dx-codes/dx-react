import React from 'react'

const NavigationContext = React.createContext()
const LocationContext = React.createContext()
const RouterContext = React.createContext()

export function useLocation() {
  return React.useContext(LocationContext).location
}

export function Router({ children, location, navigationType, navigator }) {
  return (
    <NavigationContext.Provider 
      value={{ navigator }}
      >
      <LocationContext.Provider
        children={ children }
        value={{ location }}
        />
    </NavigationContext.Provider>
  )
}

export function Routes({ children }) {
  return useRoutes(createRoutesFromChildren(children), null)
}

function createRoutesFromChildren(children) {
  const routes = []
  
  // React.Children.forEach(children, () => {})
  children.forEach(child => {
    const route = {
      path: child.props.path,
      element: child.props.element
    }

    routes.push(route)
  })

  return routes
}

function useRoutes(routes, locationArgs) {
  const locationFromContext = useLocation()
  const pathname = locationFromContext.pathname || '/'
  for(let i = 0;i < routes.length; i++)  {
    const { path, element } = routes[i]
    const match = matchPath(path, pathname)
    if (match) {
      return element
    }
  }

  return (
    <></>
  )
}

function compilePath(path) {
  let regexpSource = '^' + path
  regexpSource += '$'
  const matcher = new RegExp(regexpSource)
  return matcher
}

function matchPath(path, pathname) {
  const matcher = compilePath(path)
  const match = pathname.match(matcher)
  if (match) {
    return match
  }

  return null
}

export const Route = (_props) => {

}

