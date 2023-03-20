import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route } from './react-router-dom'
import { createBrowserHistory } from 'history'
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

const User = ({ title }) => {
  return (
    <div>
      <div>user</div>
      <div>{ title }</div>
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

const browserHistory = createBrowserHistory()
console.log(browserHistory)

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home title='t1'/>} ></Route>
        <Route path='/user' element={<User title='t2'/>} ></Route>
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
