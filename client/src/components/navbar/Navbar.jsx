import React, { useState } from 'react'
import "./navbar.css"
import { Link } from 'react-router-dom'
import Dropdown from '../dropdown/Dropdown'
import AccountDropdown from '../dropdown/AccountDropdown'

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false) 

  const openDropdown = () => {
    setShowDropdown(prev => !prev);
  }
  return (
    <header>
      <nav>
        <div className="nav-logo"><Link to="/">MERN Social</Link></div>
        <ul className='nav-links'>
          <li><Link to="/">Home</Link></li>
          <li className='account-dropdown-btn' onClick={openDropdown}>
            <img src='/default-pfp.jpg'/>
            {showDropdown && <Dropdown><AccountDropdown /></Dropdown>}
          </li>
        </ul>
      </nav>
    </header>
  )
}
