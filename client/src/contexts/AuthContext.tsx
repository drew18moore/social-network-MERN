import React, { useEffect, useState, useContext, ReactNode } from "react";

type AuthContextType = {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
};

const AuthContext = React.createContext<any>(undefined);

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>({} as User);

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
