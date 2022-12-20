import React from 'react'
import "./user.css"

export default function User({ user }) {
  console.log(user);
  return (
    <div className='user'>
      <div className="user-info">
        <img src={user.img} alt="" />
        <div className="info">
          <p className='fullname'>{user.fullname}</p>
          <p className='username'>@{user.username}</p>
        </div>
      </div>
      <button>Follow</button>
    </div>
  )
}
