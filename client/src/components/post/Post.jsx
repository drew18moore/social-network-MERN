import React from 'react'
import "./post.css"

export default function Post({ username, postBody, createdAt }) {
  return (
    <div className='post'>
      <div className="post-header">
        <p className='post-username'>{username}</p>
        <p className='post-date'>{createdAt}</p>
      </div>
      <p className='post-body'>{postBody}</p>
    </div>
  )
}
