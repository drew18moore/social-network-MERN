import React from 'react'
import "./rightSidebar.css"
import { useLocation } from 'react-router-dom';
import WhoToFollow from '../whoToFollow/WhoToFollow';

const whoToFollowBlacklist = [/\/settings/, /\/connect/, /\/\w+\/following/, /\/\w+\/followers/]

export default function RightSidebar() {
  const { pathname } = useLocation();

  return (
    <div className='right-sidebar'>
      {whoToFollowBlacklist.some(path => path.test(pathname)) ? <></> : <WhoToFollow />}
    </div>
  )
}
