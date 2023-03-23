import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from './react-router-dom'
import 'reset-css'

const root = document.getElementById('root')

const Home = ({ title }) => {
  const navigate = useNavigate()
  const onClick = () => {
    navigate('/profile')
  }

  return (
    <div>
      <div>Home</div>
      <div>{ title }</div>
      <button onClick={ onClick }>jump</button>
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home title='t1'/>} ></Route>
        <Route path='/user/:id/:age' element={<User title='t2'/>} ></Route>
        <Route path='/profile' element={<Profile title='t3'/>} ></Route>
        <Route path='/xxx' element={ <Navigate to='/' />}></Route>
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

