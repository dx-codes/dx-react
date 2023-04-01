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
  return useRoutes(createRoutesFromChildren(children), null)
}

const joinPaths = (paths) =>
  paths.join("/").replace(/\/\/+/g, "/");

function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;

  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }

  let nextChar = pathname.charAt(basename.length);
  if (nextChar && nextChar !== "/") {
    // pathname does not start with basename/
    return null;
  }

  return pathname.slice(basename.length) || "/";
}

function flattenRoutes(
  routes,
  branches = [],
  parentsMeta = [],
  parentPath = ""
) {
  routes.forEach((route, index) => {
    let meta = {
      relativePath: route.path || "",
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index
    };

    if (meta.relativePath.startsWith("/")) {
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }

    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);

    // Add the children before adding this route to the array so we traverse the
    // route tree depth-first and child routes appear before their parents in
    // the "flattened" version.
    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, branches, routesMeta, path);
    }

    // Routes without a path shouldn't ever match by themselves unless they are
    // index routes, so don't add them to the list of possible branches.
    if (route.path == null && !route.index) {
      return;
    }

    branches.push({ path, score: 0, routesMeta });
  });

  return branches;
}

function compilePath(
  path,
  caseSensitive = false,
  end = true
) {

  let paramNames = [];
  let regexpSource =
    "^" +
    path
      .replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
      .replace(/^\/*/, "/") // Make sure it has a leading /
      .replace(/[\\.*+^$?{}|()[\]]/g, "\\$&") // Escape special regex chars
      .replace(/:(\w+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return "([^\\/]+)";
      });

  if (path.endsWith("*")) {
    paramNames.push("*");
    regexpSource +=
      path === "*" || path === "/*"
        ? "(.*)$" // Already matched the initial /, just match the rest
        : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
  } else {
    regexpSource += end
      ? "\\/*$" // When matching to the end, ignore trailing slashes
      : // Otherwise, at least match a word boundary. This restricts parent
        // routes to matching only their own words and nothing more, e.g. parent
        // route "/home" should not match "/home2".
        "(?:\\b|$)";
  }

  let matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");

  return [matcher, paramNames];
}


export function matchPath(
  pattern,
  pathname
) {
  if (typeof pattern === "string") {
    pattern = { path: pattern, caseSensitive: false, end: true };
  }

  let [matcher, paramNames] = compilePath(
    pattern.path,
    pattern.caseSensitive,
    pattern.end
  );

  let match = pathname.match(matcher);
  if (!match) return null;

  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = paramNames.reduce(
    (memo, paramName, index) => {
      // We need to compute the pathnameBase here using the raw splat value
      // instead of using params["*"] later because it will be decoded then
      if (paramName === "*") {
        let splatValue = captureGroups[index] || "";
        pathnameBase = matchedPathname
          .slice(0, matchedPathname.length - splatValue.length)
          .replace(/(.)\/+$/, "$1");
      }

      // memo[paramName] = safelyDecodeURIComponent(
      //   captureGroups[index] || "",
      //   paramName
      // );
      memo[paramName] = decodeURIComponent(captureGroups[index] || "")
      return memo;
    },
    {}
  );

  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}

function matchRouteBranch(branch, routesArg, pathname) {
  let routes = routesArg;
  let { routesMeta } = branch;

  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname =
      matchedPathname === "/"
        ? pathname
        : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath(
      { path: meta.relativePath, caseSensitive: meta.caseSensitive, end },
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

const matchRoutes = (routes, locationArg, basename = '/') => {
  let location = locationArg

  let pathname = stripBasename(location.pathname || "/", basename);

  if (pathname == null) {
    return null;
  }

  /**
   * [
   *    {path: '/', score: 0, routesMeta: [{relativePath: '/', caseSensitive: false, childrenIndex: 0}]}, 
        {path: '/user/add', score: 0, routesMeta: [{relativePath: '/user', caseSensitive: false, childrenIndex: 1}, {relativePath: 'add', caseSensitive: false, childrenIndex: 0}]},
        {path: '/user/detail', score: 0, routesMeta: [{relativePath: '/user', caseSensitive: false, childrenIndex: 1}, {relativePath: 'detail', caseSensitive: false, childrenIndex: 1}]},
        {path: '/user', score: 0, routesMeta: [{relativePath: '/user', caseSensitive: false, childrenIndex: 1}]}
      ]
   */
  let branches = flattenRoutes(routes);
  // rankRouteBranches(branches);

  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i], routes, pathname);
  }

  return matches;
}

function _renderMatches(
  matches,
  parentMatches = []
) {
  debugger
  if (matches == null) return null;

  const r = matches.reduceRight((outlet, match, index) => {
    debugger

    const children = match.route.element !== undefined ? match.route.element : <Outlet/>
    const value = { outlet, matches: parentMatches.concat(matches.slice(0, index + 1)) }

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

export function useRoutes(routes) {
  let { matches: parentMatches } = React.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;

  let location = useLocation();
  let pathname = location.pathname || "/";
  let remainingPathname =
    parentPathnameBase === "/"
      ? pathname
      : pathname.slice(parentPathnameBase.length) || "/";
  debugger
  /**
   * [
   *  {params: {}, pathname: '/user', pathnameBase: '/user', route: {path: '/user', element: {}, children: [{}, {}] } },
   *  {params: {}, pathname: '/user', pathnameBase: '/user', route: {path: 'add', element: {}}}
   * ]
   */
  let matches = matchRoutes(routes, { pathname: remainingPathname });

  return _renderMatches(
    matches &&
      matches.map(match =>
        Object.assign({}, match, {
          params: Object.assign({}, parentParams, match.params),
          pathname: joinPaths([parentPathnameBase, match.pathname]),
          pathnameBase:
            match.pathnameBase === "/"
              ? parentPathnameBase
              : joinPaths([parentPathnameBase, match.pathnameBase])
        })
      ),

    parentMatches
  );
}

function createRoutesFromChildren(children) {
  const routes = []
  
  // React.Children.forEach(children, () => {})
  React.Children.forEach(children, child => {
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

// export function useRoutes(routes, locationArgs) {
//   const locationFromContext = useLocation()
//   const pathname = locationFromContext.pathname || '/'

//   let _pathname = pathname
//   if (typeof pathname === 'object') { // to={{ pathname: '/xxx', state: { xxx } }}
//     _pathname = pathname.pathname
//   }

//   for(let i = 0;i < routes.length; i++)  {
//     const { path, element } = routes[i]
//     const match = matchPath(path, _pathname) // /user
//     if (match) {


//       return React.cloneElement(element, { ...element.props, match })
//     }
//   }

//   return (
//     <></>
//   )
// }

// function compilePath(path) {
//   const paramNames = []

//   let regexpSource = '^' + path.replace(/:(\w+)/g, (_, paramName) => {
//     paramNames.push(paramName)
//     return "([^\\/]+)"
//   }) // 动态路由匹配，例如把路由为/user/:id/:age，url为/user/10/20，解析出matcher=[_, '10', '20', ...], paramNames=['id', 'age']
//   regexpSource += '$'
//   const matcher = new RegExp(regexpSource)
//   return [matcher, paramNames]
// }

// function matchPath(path, pathname) { // pathname是当前浏览器地址，path是需要匹配的路由地址
//   if (pathname.split('/').length > 2) {
//     debugger
//   }

//   const [matcher, paramNames] = compilePath(path)
//   const match = pathname.match(matcher)
//   if (!match) {
//     return null
//   }

//   const matchPathname = match[0]
//   const values = match.slice(1)
//   const params = paramNames.reduce((prev, paramName, index) => {
//     prev[paramName] = values[index]
//     return prev
//   }, {}) // 把matcher和paramNames组合成对象，例如compilePath中的示例将被解析成{ id: '10', age: '20' }

//   return { params, path, pathname: matchPathname }
// }

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