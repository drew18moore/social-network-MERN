import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import "./profile.css"
import { useAuth } from '../../contexts/AuthContext'

export default function Profile() {
  const { currentUser } = useAuth()
  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className='profile-card'>
          <div className='profile-img-username'>
            <img className='profile-picture' src='/default-pfp.jpg' alt='profile picture' />
            <div className="profile-name-username">
              <h1 className='name'>{currentUser.username}</h1>
              <h2 className='username'>@{currentUser.username}</h2>
            </div>
            
          </div>
          
        </div>
      </div>
    </>
  )
}
