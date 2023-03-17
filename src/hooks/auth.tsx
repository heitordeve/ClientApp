import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
} from 'react';
import { useAlert } from './alert';
import api from 'services/api';
import { AutenticacaoApi } from 'services/apis';
import { Usuario } from '../dtos/usuarios';
import UsuarioStorage from 'storage/usuarioStorage';
import { Subject } from 'rxjs';

interface AuthState {
  user: Usuario;
  tokenUsuario: string;
  tokenAcesso: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthContextData {
  user: Usuario;
  signIn(credentials: SignInCredentials): Promise<any>;
  signInGoogle(tokenId: string): Promise<any>;
  signOut(): void;
  updateUser(user: Usuario): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const { addAlert } = useAlert();
  const [validando, setValidando] = useState<boolean>(true);
  const [data, setData] = useState<AuthState>(() => {
    const tokenUsuario = localStorage.getItem('@Kim:token');
    const tokenAcesso = localStorage.getItem('@Kim:tokenAcesso');
    let user: Usuario = UsuarioStorage.get();

    if (user && user.HostedUrl === api.defaults.baseURL && tokenUsuario) {
      api.defaults.headers.authorization = `Bearer ${tokenUsuario}`;
      return { tokenUsuario, user: user, tokenAcesso };
    } else {
      return {} as AuthState;
    }
  });

  const registrarUsuario = (usuario: Usuario | null): void => {
    if (usuario) {
      let user = usuario;
      user.HostedUrl = api.defaults.baseURL;
      localStorage.setItem('@Kim:token', user.TokenUsuario);
      localStorage.setItem('@Kim:tokenAcesso', user.TokenAcesso);
      UsuarioStorage.set(user);
      setData({
        tokenUsuario: user.TokenUsuario,
        user,
        tokenAcesso: user.TokenAcesso,
      });
    }
  };

  const signIn = useCallback(async ({ email, password }) => {
    const response = await AutenticacaoApi.Autenticar(email, password);
    registrarUsuario(response);
    return response;
  }, []);

  const signInGoogle = useCallback(async (tokenId: string) => {
    const response = await AutenticacaoApi.AutenticarGoogle(tokenId, '38');
    registrarUsuario(response);
    return response;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Kim:token');
    localStorage.removeItem('@Kim:tokenAcesso');
    UsuarioStorage.del();

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: Usuario) => {
      setData({
        tokenUsuario: data.tokenUsuario,
        user,
        tokenAcesso: user.TokenAcesso,
      });
      UsuarioStorage.update(user);
    },
    [setData, data.tokenUsuario],
  );

  const validar = useCallback(async () => {
    if (UsuarioStorage.exist()) {
      const response = await AutenticacaoApi.VerificarSessao();
      if (response) {
        registrarUsuario(response);
      } else {
        signOut();
      }
    }
    setValidando(false);
  }, [signOut]);

  useEffect(() => {
    if (
      UsuarioStorage.exist() &&
      (typeof data.user?.CodigoUsuario !== 'number' || typeof data.user?.TokenUsuario !== 'string')
    ) {
      signOut();
      addAlert({
        type: 'error',
        title: 'Atenção',
        description: 'Um erro inesperado aconteceu, tente novamente mais tarde',
      });
    }
  }, [data.user, signOut, addAlert]);

  useEffect(() => {
    var subscriber = authSubject.subscribe(alert => {
      signOut();
    });
    return () => subscriber.unsubscribe();
  }, [validar, signOut]);

  useLayoutEffect(() => {
    validar();
  }, [validar]);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signInGoogle, signOut, updateUser }}>
      {!validando && children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
const authSubject = new Subject();
function logout() {
  authSubject.next();
}

export const authService = {
  logout,
};
