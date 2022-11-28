import React from 'react'
import { useEffect } from 'react'
import { useContext, useState } from 'react'

const AuthContext = React.createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({_id: '63853a8561b33994cb56fb44', username: 'Drew', password: 'drew1212', __v: 0})

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