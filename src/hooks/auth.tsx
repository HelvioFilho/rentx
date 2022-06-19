import React, {
  createContext,
  useState,
  useContext,
  ReactNode
} from 'react';
import { api } from '../services/api';

interface User {
  email: string;
  name: string;
  driver_license: string;
  avatar: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInResponseProps {
  error: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  }
}
interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn: (credentials: SignInCredentials) => Promise<SignInResponseProps>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [data, setData] = useState<AuthState>({} as AuthState);

  async function signIn({ email, password }: SignInCredentials) {
    const response = await api.post('/session', {
      email,
      password
    });
    const { token, user } = response.data.data;
    setData({ token, user });
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return response.data;
  }
  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth }