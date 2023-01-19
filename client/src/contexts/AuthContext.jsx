import React, { useEffect, useState, useContext } from "react";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    import.meta.env.VITE_USER && JSON.parse(import.meta.env.VITE_USER)
  );

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
