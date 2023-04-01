import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route, Outlet, useParams } from './react-router-dom'
import 'reset-css'

const root = document.getElementById('root')

const Home = () => {
  return (
    <div>
      Home
    </div>
  )
}

const User = () => {

  return (
    <div>
      <div>user</div>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

const UserAdd = () => {
  const params = useParams()
  console.log(params)
  return (
    <div>
      add
    </div>
  )
}

const UserDetail = () => {
  return (
    <div>
      detail
    </div>
  )
}

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home /> } ></Route>
        <Route path='/user' element={ <User /> }>
          <Route path='add/:id' element={ <UserAdd /> }></Route>
          <Route path='detail' element={ <UserDetail /> }></Route>
        </Route>
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

