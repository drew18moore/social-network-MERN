import React from 'react'
import "./post.css"

export default function Post({ postBody }) {
  return (
    <div className='post'>
      <p>{postBody}</p>
    </div>
  )
}
