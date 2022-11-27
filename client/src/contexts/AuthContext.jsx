import React from 'react'
import { useEffect } from 'react'
import { useContext, useState } from 'react'

const AuthContext = React.createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()

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