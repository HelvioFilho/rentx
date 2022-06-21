import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react';
import { api } from '../services/api';
import { database } from '../database';
import { User as ModelUser } from '../database/model/User';

interface APIUser {
  email: string;
  name: string;
  driver_license: string;
  avatar: string;
}
interface User {
  id: string;
  email: string;
  name: string;
  driver_license: string;
  photo: string;
  token: string;
}

interface SignInResponseProps {
  error: boolean;
  message: string;
  data?: {
    token: string;
    user: APIUser;
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
  const [data, setData] = useState<User>({} as User);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('/session', {
        email,
        password
      });

      if (response.data.error) {
        return response.data;
      } else {
        const { token, user } = response.data.data;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const userCollection = database.get<ModelUser>('user');
        await database.write(async () => {
          await userCollection.create((newUser) => {
            newUser.email = user.email;
            newUser.name = user.name;
            newUser.driver_license = user.driver_license;
            newUser.token = token;
            newUser.photo = user.avatar;
          });
        });

        setData({ ...user, token });
        return false;
      }

    } catch (error) {
      console.log("Error: " + error);
    }
  }

  useEffect(() => {
    async function loadUserData() {
      const userCollection = database.get<ModelUser>('user');
      const response = await userCollection.query().fetch();
      if (response.length > 0) {
        const userData = response[0]._raw as unknown as User;
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        setData(userData);
      }
    }
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data,
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