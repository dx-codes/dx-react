# Dx-react

## 一、intro
个人手写react练习，基于react16版本和babel-jsx，有兴趣的同学可以尝试把bael-jsx的ast转换也自己去实现一版，可以深刻的感受下编译原理。后续有时间再折腾一份17之后基于fiber的版本。

## 二、detail

### chapter1-基础render
#### 核心组件的mount与update
1. 基础render，包含纯jsx、ClassComponent和FunctionComponent
2. batchUpdate，当ClassComponent的dom事件中多次触发setState时，会被合并成一次
#### ref
1. ref
2. ForWardRef
#### diff算法的三个阶段：
1. 暴力diff - 只要vdom不一致就暴力删除旧的dom，放上新的
2. simpleDiff - 对children数组做一一对比，一致的复用，更新属性，不一致的暴力替换
3. diff 基于key的真实diff算法
#### ClassComponent的生命周期（新版和老版）

### chapter2-高级特性
#### createContext

#### HOC

#### renderProps

#### portal

#### PureComponent

#### memo

### chapter3-hooks
#### useState
#### useReducer
#### useMemo & useCallback
#### useEffect
#### useLayoutEffect
#### useRef
#### useImperativeHandle
#### useContext

### chapter4-router
#### 基础原理：浏览器提供的history与hash api
#### 基础BrowserRouter
#### 动态路由
#### Link、NavLink、Navigate组件
#### useNaviate和路由校验
#### 嵌套路由，Outlet的实现
outlet的实现比想象的复杂的不少，需要比较扎实的正则功底

### chapter5-redux
redux比较简单，只做了基础的实现



