import LocalStorage from './storage';
import { Usuario } from '../dtos/usuarios';

const KEY = '@Kim:user'

const get = (): Usuario => {
  return LocalStorage.get<Usuario>(KEY);
}
const set = (value: Usuario): void => {
  LocalStorage.set(KEY, value);
}
const update = (value: Usuario): void => {
  const obj = get();
  set({ ...obj, ...value })
}
const del = (): void => {
  LocalStorage.del(KEY);
}
const exist = (): boolean => {
  return get() !== null;
}

const UsuarioStorage = {
  get, set, update, del, exist
}
export default UsuarioStorage;
