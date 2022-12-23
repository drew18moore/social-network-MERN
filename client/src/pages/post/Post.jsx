import React from 'react'
import { useParams } from "react-router-dom";

export default function Post() {
  const { username, postId } = useParams();

  return (
    <div className='post-main'>
      {username}
      {postId}
    </div>
  )
}
