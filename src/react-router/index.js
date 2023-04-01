import React from 'react'

const NavigationContext = React.createContext()
const LocationContext = React.createContext()
const RouteContext = React.createContext({
  outlet: null,
  matches: []
})

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
  const routes = createRoutesFromChildren(children)
  return useRoutes(routes)
}

// 把jsx里组合的Routes和Route，转化成Route对象
function createRoutesFromChildren(children) {
  const routes = []

  React.Children.forEach(children, (child) => {
    const route = {
      path: child.props.path,
      element: child.props.element
    }

    if (child.props.children) {
      route.children = createRoutesFromChildren(child.props.children)
    }

    routes.push(route)
  })

  return routes
}

function useRoutes(routes) {
  const location = useLocation(LocationContext)

  const pathname = location.pathname || '/'
  const branches = flattenRoutes(routes)

  let matches = null
  for(let i = 0; i < branches.length; i++) {
    const branch = branches[i]

    matches = matchRouteBranch(branch, routes, pathname)
    if (matches) {
      break
    }
  }

  return renderMatches(matches || [])
}

/**
 * 示例数据结构
  [
    {path: '/', score: 0, routesMeta: [{relativePath: '/', caseSensitive: false, childrenIndex: 0}]}, 
    {path: '/user/add', score: 0, routesMeta: [{relativePath: '/user', caseSensitive: false, childrenIndex: 1}, {relativePath: 'add/:id', caseSensitive: false, childrenIndex: 0}]},
    {path: '/user/detail', score: 0, routesMeta: [{relativePath: '/user', caseSensitive: false, childrenIndex: 1}, {relativePath: 'detail', caseSensitive: false, childrenIndex: 1}]},
    {path: '/user', score: 0, routesMeta: [{relativePath: '/user', caseSensitive: false, childrenIndex: 1}]}
  ]
*/
function flattenRoutes(routes, branches = [], parentRoutesMeta = [], parentPath = '') {

  routes.forEach((route, index) => {
    const meta = {
      relativePath: route.path,
      childrenIndex: index
    }

    const path = joinPaths([parentPath, route.path]) // ''和'/'会被join成'//'要替换掉
    const routesMeta = parentRoutesMeta.concat(meta)

    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, branches, routesMeta, path)
    }

    branches.push({ path, routesMeta })
  })

  return branches
}

function renderMatches(matches) { 

  // 注意这里是reduceRight，先把子路由生成Provider赋值给上一层的outlet，然后上一层使用Outlet时，正好拿到子路由的Provider并渲染
  const r = matches.reduceRight((outlet, match, index) => {

    const children = match.route.element !== undefined ? match.route.element : <Outlet/>
    const value = { outlet, matches: matches.slice(0, index + 1) }

    return (
      <RouteContext.Provider
        children={
          children
        }
        value={ value }
      />
    );
  }, null);

  return r
}

function joinPaths(paths) {
  return paths.join('/').replace(/\/\/+/g, '/')
}

function compilePath(path, end) {
  const paramKeys = []

  let reg = '^' + path
    .replace(/^\/*/, "/") // 保证以/开头
    .replace(/:(\w+)/g, (_, paramKey) => {
      paramKeys.push(paramKey)
      return '([^\\/]+)'
    })

  reg += end ? "\\/*$" : "(?:\\b|$)";

  return [new RegExp(reg), paramKeys]
}

function matchPath(pattern, pathname) {
  // 第一次path是/user，pathname是/user/add/1122; 第二次path是add/:id，pathname是/add/1122
  const { path, end } = pattern 
  const [matcher, paramKeys] = compilePath(path, end)

  const match = pathname.match(matcher)

  if (!match) {
    return null
  }

  const matchedPathname = match[0]
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  const paramValues = match.slice(1)
  const params = paramKeys.reduce((prev, key, index) => {
    prev[key] = paramValues[index]
    return prev
  }, {})

  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  }
}

/**
 * 示例matches
 * [
 *  {params: {}, pathname: '/user', pathnameBase: '/user', route: {path: '/user', element: {}, children: [{}, {}] } },
 *  {params: {}, pathname: '/user', pathnameBase: '/user', route: {path: 'add', element: {}}}
 * ]
 */
function matchRouteBranch(branch, routes, pathname) {
  let { routesMeta } = branch;

  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1; // true or false
    // 截取掉上一次匹配的path，比如/user/add第一次匹配的是/user，第二次的时候就截取成只剩/add，且此时end = true
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/"; 
    // let match
    let match = matchPath(
      { path: meta.relativePath, end },
      remainingPathname
    );

    if (!match) return null;

    Object.assign(matchedParams, match.params);

    let route = routes[meta.childrenIndex];

    matches.push({
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: joinPaths([matchedPathname, match.pathnameBase]),
      route
    });

    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }

    routes = route.children
  }

  return matches;
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

export const useOutlet = () => {
  const outlet = React.useContext(RouteContext).outlet
  return outlet
}

export const Outlet = (_props) => {
  return useOutlet()
}

export function useParams() {
  let { matches } = React.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? (routeMatch.params) : {};
}