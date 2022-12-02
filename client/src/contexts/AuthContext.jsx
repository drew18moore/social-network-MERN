import React from 'react'
import { useEffect } from 'react'
import { useContext, useState } from 'react'

const AuthContext = React.createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({_id: '63893e3bfc3d34d25d9ae0cd', username: 'Drew', password: 'Drew1212!', __v: 0})

  useEffect(() => {
    console.log(currentUser)
  }, [])

  return (
    <AuthContext.Provider value={{currentUser, setCurrentUser}}>
      { children }
    </AuthContext.Provider>
  )
}

export default AuthContext