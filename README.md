# Dx-react

## 一、简介
个人手写react练习，基于babel-jsx，有兴趣的同学可以尝试把bael-jsx的ast转换也自己去实现一版

## 二、详细实现介绍

### Chapter1-基础render
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

### Chapter2-高级特性
#### createContext

#### HOC

#### renderProps

#### portal

#### PureComponent

#### memo

### Chapter3-hooks

### Chapter4-router




