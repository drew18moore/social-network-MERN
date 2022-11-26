import React, { useRef } from 'react'

export default function Login() {

  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(usernameRef.current.value, passwordRef.current.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="input-username">Username</label>
      <input ref={usernameRef} type="text" name="username" id="input-username" required />

      <label htmlFor='input-password'>Password</label>
      <input ref={passwordRef} type="password" name="password" id="input-password" required />

      <button type='submit'>Log In</button>
    </form>
  )
}
