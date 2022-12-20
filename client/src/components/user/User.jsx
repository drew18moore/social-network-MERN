import React from 'react'
import "./user.css"

export default function User({ user }) {
  console.log(user);
  return (
    <div className='user'>
      {user.username}
    </div>
  )
}
