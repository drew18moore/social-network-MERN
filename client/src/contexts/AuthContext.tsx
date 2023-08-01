import React, { useEffect, useState, useContext, ReactNode } from "react";

type AuthContextType = {
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

const AuthContext = React.createContext<any>(undefined);

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState({});

  // useEffect(() => {
  //   console.log(currentUser);
  // }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
