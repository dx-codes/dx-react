import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route, NavLink } from './react-router-dom'
import 'reset-css'

const root = document.getElementById('root')

const Home = ({ title }) => {
  return (
    <div>
      <div>Home</div>
      <div>{ title }</div>
    </div>
  )
}

const User = (props) => {

  console.log(props)
  return (
    <div>
      <div>user</div>
      <div>{ props.title }</div>
    </div>
  )
}

const Profile = ({ title }) => {
  return (
    <div>
      <div>profile</div>
      <div>{ title }</div>
    </div>
  )
}

const App = () => {

  const activeStyle = { backgroundColor: 'blue', color: 'white' }

  return (
    <BrowserRouter>
      <ul>
        <li>
          <NavLink style={({ isActive }) => isActive ? activeStyle : {}} to='/'>去首页</NavLink>
        </li>
        <li>
          <NavLink style={({ isActive }) => isActive ? activeStyle : {}} to='/profile'>个人中心</NavLink>
        </li>
      </ul>

      <Routes>
        <Route path='/' element={<Home title='t1'/>} ></Route>
        <Route path='/user/:id/:age' element={<User title='t2'/>} ></Route>
        <Route path='/profile' element={<Profile title='t3'/>} ></Route>
      </Routes>
    </BrowserRouter>
  )
}

/** @jsxRuntime classic */
/** @jsx React.createElement */
const element = (<App />)
console.log(element)

ReactDOM.render(
  element,
  root
)

