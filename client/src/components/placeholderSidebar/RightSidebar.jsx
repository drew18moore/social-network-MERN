import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import "./rightSidebar.css"
import axios from "axios"
import { useAuth } from '../../contexts/AuthContext';
import User from '../user/User';

export default function RightSidebar() {
  const { currentUser } = useAuth();
  const [unfollowedUsers, setUnfollowedUsers] = useState();

  useEffect(() => {
    axios.get(`http://192.168.1.2:3000/api/users/all-unfollowed/${currentUser._id}`).then((res) => {
      console.log(res.data);
      setUnfollowedUsers(res.data);
    })
  },[])

  return (
    <div className='right-sidebar'>
      <div className="who-to-follow">
        <h2>Who to follow?</h2>
        {unfollowedUsers && unfollowedUsers.map(user => {
          return <User user={user} key={user._id} />
        })}
      </div>
    </div>
  )
}
