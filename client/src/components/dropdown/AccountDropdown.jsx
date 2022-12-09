import React from 'react'
import { Link } from 'react-router-dom'

export default function AccountDropdown() {
  return (
    <ul>
      <li><Link to="/profile">Profile</Link></li>
      <li><Link to="/login">Log Out</Link></li>
    </ul>
  )
}
