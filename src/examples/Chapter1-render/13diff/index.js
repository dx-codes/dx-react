import React from './react'
import ReactDOM from './react-dom'
import 'reset-css'

const root = document.getElementById('root')


/**
 * 
 * mi for mountIndex
 * mi:  [ 0,   1,   2,   3,   4,   5 ]
 * old: ['A', 'B', 'C', 'D', 'E', 'F']
 * 
 * mi:  [ 0,   1,   2,   3,   4 ]
 * new: ['A', 'C', 'E', 'B', 'G']
 * 
 * lastPlaceIndex = 0
 * patch = []
 * 
 * ==== 生成oldChildren的map ====
 * { 0-A, 1-B, 2-C, 3-D, 4-E, 5-F }
 * dom: [A, B, C, D, E, F]
 * 
 * 
 * ==== 遍历newChildren ====
 * lastPlaceIndex = 0
 * index = 0
 * A has Cache
 * 更新A的props和A的children
 * 不满足oldChild.mountIndex(0) < lastPlaceIndex(0)
 * map中删除A
 * lastPlaceIndex = Math.max(0, 0) = 0
 * 
 * lastPlaceIndex = 0
 * index = 1
 * C has Cache
 * 更新C的props和C的children
 * 不满足oldChild.mountIndex(2) < lastPlaceIndex(0)
 * map中删除C
 * lastPlaceIndex = Math.max(2, 1) = 2
 * 
 * lastPlaceIndex = 2
 * index = 2
 * E has Cache
 * 更新E的props和E的children
 * 不满足oldChild.mountIndex(4) < lastPlaceIndex(2)
 * map中删除E
 * lastPlaceIndex = Math.max(4, 2) = 4
 * 
 * lastPlaceIndex = 4
 * index = 3
 * B has Cache
 * 更新B的props和B的children
 * 满足oldChild.mountIndex(2) < lastPlaceIndex(4)
 * patch=[{ B, MOVE, 3 }]
 * map中删除B
 * lastPlaceIndex = Math.max(1, 3) = 3
 * 
 * lastPlaceIndex = 3
 * index = 4
 * G has no cache
 * patch=[{ B, MOVE, 3 }, { G, NEXT, 4}]
 * 
 * 此时oldChildrenMap
 * { 3-D, 5-F }
 * 
 * 
 * ==== 从dom中删除Move和map中剩余的元素 ====
 * dom中remove: [A, C, E] 
 * 此时B依然缓存在patch中，并不需要重新创建
 * patch=[{ B, MOVE, 3 }, { G, NEXT, 4}]
 * 
 * 
 * ==== 遍历patch执行移动或插入操作 ====
 * B Move
 * newDom = B.dom
 * nextDom = dom[3] = undefined
 * parentDom.appendChild(newDom)
 * 
 * G Next
 * newDom = createDom(G)
 * nextDom = dom[4] = undefined
 * parentDom.appendChild(newDom)
 * 
 * 完成
 * 
 * 
 * 
 */
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: ['A', 'B', 'C', 'D', 'E', 'F']
    }
  }

  onClick = () => {
    this.setState({
      list: ['A', 'C', 'E', 'B', 'G']
    })
  }

  render() {
    return (
      <div>
        <ul>
          {
            this.state.list.map((item, index) => {
              return (
                <li key={ index }>{ item }</li>
              )
            })
          }
        </ul>
        <button onClick={ this.onClick }>change</button>
      </div>
    )
  }
}


/** @jsxRuntime classic */
/** @jsx React.createElement */
const element = (<App />)
console.log(element)

ReactDOM.render(
  element,
  root
)
