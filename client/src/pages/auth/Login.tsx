import React, { useRef } from 'react'
import Axios from 'axios'

export default function Login() {

  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (usernameRef.current !== null && passwordRef.current !== null) {
        await Axios.post("http://localhost:3000/api/auth/login", {
        username: usernameRef.current.value,
        password: passwordRef.current.value
      }).then((res) => {
        console.log(res.data);
      })
    } else {
      console.error("usernameRef.current or passwordRef.current is null")
    }
  }

  return (
    <form onSubmit={login}>
      <label htmlFor="input-username">Username</label>
      <input ref={usernameRef} type="text" name="username" id="input-username" required />

      <label htmlFor='input-password'>Password</label>
      <input ref={passwordRef} type="password" name="password" id="input-password" required />

      <button type='submit'>Log In</button>
    </form>
  )
}
