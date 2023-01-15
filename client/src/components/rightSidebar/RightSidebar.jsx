import React from 'react'
import "./rightSidebar.css"
import { useLocation } from 'react-router-dom';
import WhoToFollow from '../whoToFollow/WhoToFollow';

export default function RightSidebar() {
  const location = useLocation();

  return (
    <div className='right-sidebar'>
      {location.pathname === "/settings" ? <></> : <WhoToFollow />}
    </div>
  )
}
