import { createContext, useState, useEffect, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router";

export interface AuthContextType {
  currentUser: User | null;
  initializing: boolean;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  async function signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const displayName = firstName + " " + lastName;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, { displayName });
    navigate("/");
  }

  async function logIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);

    navigate("/");
  }

  function signOut() {
    return firebaseSignOut(auth);
  }

  const value = {
    currentUser,
    initializing,
    signUp,
    logIn,
    signInWithGoogle,
    signOut,
  };

  console.log("value.currentUser", value.currentUser);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
