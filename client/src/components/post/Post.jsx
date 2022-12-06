import React from 'react'
import "./post.css"

export default function Post({ username, postBody, createdAt }) {
  let date = new Date(createdAt)
  const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric"
  } 
  return (
    <div className='post'>
      <div className="post-header">
        <p className='post-username'>{username}</p>
        <p className='post-date'>{date.toLocaleString("en-US", dateOptions)}</p>
      </div>
      <p className='post-body'>{postBody}</p>
    </div>
  )
}
