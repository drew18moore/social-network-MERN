import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Home() {
  const { currentUser } = useAuth()
  return (
    <div>Hello, {currentUser.username}</div>
  )
}
