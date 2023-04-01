import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from './react-router-dom'
import 'reset-css'

const root = document.getElementById('root')

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const onClick = () => {
    localStorage.setItem('dx-react-user', true)
    let from = location?.state?.from
    if (!from) {
      from = '/'
    }
    navigate(from)
  }

  return (
    <div>
      <button onClick={ onClick }>登录</button>
    </div>
  )
}

const Home = () => {
  return (
    <div>
      Home
    </div>
  )
}

const AuthRoute = (props) => {
  const location = useLocation()
  const { component: RouteComponent } = props
  return (
    localStorage.getItem('dx-react-user')
    ?
    <RouteComponent/>
    :
    <Navigate to={{ pathname: '/login', state: { from: location.pathname } }} />
  )
}

const User = () => {
  return (
    <div>
      <div>user</div>
    </div>
  )
}

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} ></Route>
        <Route path='/login' element={<Login />} ></Route>
        <Route path='/user/*' element={<AuthRoute component={ User } />} ></Route>
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

