import './App.css'
import { Link, Route, Routes } from "react-router-dom"
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import PrivateRoutes from './components/PrivateRoutes'
import Home from './pages/home/Home'
import Profile from "./pages/profile/Profile"

export default function App() {

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
