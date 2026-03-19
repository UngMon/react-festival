import { User } from "firebase/auth";
import { auth } from "../firebase/index";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { getLoginProvider } from "./getLoginProvider";

interface AuthContextType {
  user: User | null;
  status: string;
  provider: string | null;
  logout: () => Promise<void>;
  updateName: (newName: string) => Promise<void>;
  updatePhoto: (newPhotoURL: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [provider, setProvider] = useState<string | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const providerName = getLoginProvider(currentUser);
        setUser(currentUser);
        setProvider(providerName);
      }
      setStatus("fulfilled");
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateName = async (newName: string) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: newName });
      setUser({ ...auth.currentUser });
    }
  };

  const updatePhoto = async (newPhotoURL: string) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL: newPhotoURL });
      setUser({ ...auth.currentUser });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, status, provider, logout, updateName, updatePhoto }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
