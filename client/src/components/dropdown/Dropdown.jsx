import React from 'react'
import "./dropdown.css"

export default function Dropdown({ children }) {
  return (
    <div className='dropdown'>
      {children}
    </div>
  )
}
