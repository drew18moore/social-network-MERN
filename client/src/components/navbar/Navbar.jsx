import React from 'react'
import "./navbar.css"
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header>
      <nav>
        <div className="nav-logo"><Link to="/">MERN Social</Link></div>
        <ul className='nav-links'>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/">Profile</Link></li>
          <li><Link to="/login">Log Out</Link></li>
        </ul>
      </nav>
    </header>
  )
}
