import React from 'react'
import "./navSidebar.css"

export default function NavSideBar() {
  return (
    <div className='nav-sidebar'>
      <nav>
        <ul className='links'>
          <li className='selected'>Home</li>
          <li>Profile</li>
          <li>Settings</li>
        </ul>
      </nav>
    </div>
  )
}
