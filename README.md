# Dx-react
个人手写react练习，基于babel-jsx

已实现以下功能
### 基础render，包含纯jsx、ClassComponent和FunctionComponent

### batchUpdate，当ClassComponent的dom事件中多次触发setState时，会被合并成一次

### ref

### ForWardRef

### diff算法的三个阶段：
暴力diff - 只要vdom不一致就暴力删除旧的dom，放上新的
simpleDiff - 对children数组做一一对比，一致的复用，更新属性，不一致的暴力替换
diff 基于key的真实diff算法

### ClassComponent的生命周期（新版和老版）

### createContext

### HOC

### renderProps

### portal

### PureComponent




