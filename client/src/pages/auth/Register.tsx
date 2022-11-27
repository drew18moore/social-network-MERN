import React, { useRef, useState } from 'react'
import Axios from 'axios'

export default function Register() {

  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)

  const [error, setError] = useState<string>("")

  async function register(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    if (usernameRef.current !== null && passwordRef.current !== null && passwordConfirmRef.current !== null) {
      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        return setError("Passwords do not match")
      }
      await Axios.post("http://localhost:3000/api/auth/register", {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
        passwordConfirm: passwordConfirmRef.current.value
      }).then((res) => {
        console.log(res.data);
      }).catch((err) => {
        setError(err.response.data.message);
      })
    } else {
      console.error("usernameRef.current, passwordRef.current, or passwordConfirmRef is null")
    }
  }

  return (
    <>
      {error}
      <form onSubmit={register}>
        <label htmlFor="input-username">Username</label>
        <input ref={usernameRef} type="text" name="username" id="input-username" required />

        <label htmlFor='input-password'>Password</label>
        <input ref={passwordRef} type="password" name="password" id="input-password" required />

        <label htmlFor='input-password-confirm'>Confirm Password</label>
        <input ref={passwordConfirmRef} type="password" name='password-confirm' id='input-password-confirm' required />

        <button type='submit'>Sign Up</button>
      </form>
    </>
    
  )
}
