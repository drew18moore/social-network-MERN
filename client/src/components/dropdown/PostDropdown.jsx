import React from 'react'
import { useAuth } from "../../contexts/AuthContext";

export default function PostDropdown({ username }) {
  const { currentUser } = useAuth();
  
  return (
    <ul>
        {username === currentUser.username && <li>Edit</li>}
        {username === currentUser.username && <li>Delete</li>}
        {username !== currentUser.username && <li>Report</li>}
      </ul>
  )
}
