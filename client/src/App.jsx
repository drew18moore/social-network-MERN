import './App.css'
import { Link, Route, Routes } from "react-router-dom"
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PrivateRoutes from './components/PrivateRoutes'
import Home from './pages/home/Home'
import Profile from "./pages/profile/Profile"
import { useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './contexts/AuthContext'

export default function App() {
  const { setCurrentUser } = useAuth()
  useEffect(() => {
    axios.get("http://localhost:3000/api/users/main").then((res) => setCurrentUser(res.data))
  }, [])
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/' element={<Home />} exact/>
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </div>
  )
}
