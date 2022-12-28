import React from 'react'
import "./comment.css"

export default function Comment({ fullname, profilePicture, commentBody }) {
  return (
    <div className='comment'>
      <div className="comment-pfp">
        <img src={profilePicture} alt="" />
      </div>
      <div className="comment-text">
        <p className="fullname">{fullname}</p>
        <p className="comment-body">{commentBody}</p>
      </div>
    </div>
  )
}
