import React, { useRef, useState } from 'react'
import Axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {

  const usernameRef = useRef(null)
  const passwordRef = useRef(null)

  const [error, setError] = useState("")

  const { setCurrentUser } = useAuth()

  async function login(e) {
    e.preventDefault()
    setError("")
    if (usernameRef.current !== null && passwordRef.current !== null) {
        await Axios.post("http://localhost:3000/api/auth/login", {
        username: usernameRef.current.value,
        password: passwordRef.current.value
      }).then((res) => {
        console.log(res.data);
        setCurrentUser(res.data);
      }).catch((err) => {
        setError(err.response.data.message);
      })
    } else {
      console.error("usernameRef.current or passwordRef.current is null")
    }
  }

  return (
    <>
      {error}
      <form onSubmit={login}>
        <label htmlFor="input-username">Username</label>
        <input ref={usernameRef} type="text" name="username" id="input-username" required />

        <label htmlFor='input-password'>Password</label>
        <input ref={passwordRef} type="password" name="password" id="input-password" required />

        <button type='submit'>Log In</button>
      </form>
    </>
    
  )
}