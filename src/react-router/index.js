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
      return React.cloneElement(element, { ...element.props, match })
    }
  }

  return (
    <></>
  )
}

function compilePath(path) {
  const paramNames = []

  let regexpSource = '^' + path.replace(/:(\w+)/g, (_, paramName) => {
    paramNames.push(paramName)
    return "([^\\/]+)"
  }) // 动态路由匹配，例如把路由为/user/:id/:age，url为/user/10/20，解析出matcher=[_, '10', '20', ...], paramNames=['id', 'age']
  regexpSource += '$'
  const matcher = new RegExp(regexpSource)
  return [matcher, paramNames]
}

function matchPath(path, pathname) {
  const [matcher, paramNames] = compilePath(path)
  const match = pathname.match(matcher)
  if (!match) {
    return null
  }

  const matchPathname = match[0]
  const values = match.slice(1)
  const params = paramNames.reduce((prev, paramName, index) => {
    prev[paramName] = values[index]
    return prev
  }, {}) // 把matcher和paramNames组合成对象，例如compilePath中的示例将被解析成{ id: '10', age: '20' }

  return { params, path, pathname: matchPathname }
}

export const Route = (_props) => {

}

export const useNavigate = () => {
  const _navigator = React.useContext(NavigationContext).navigator
  const navigator = React.useCallback(to => {
    _navigator.push(to)
  }, [_navigator])

  return navigator
}
