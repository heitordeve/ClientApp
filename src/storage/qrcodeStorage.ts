import LocalStorage from './storage';
import { QrCode } from '../dtos/cartaoQrcode';

const KEY = '@Kim:qrcode'

const get = (): QrCode[] => {
  return LocalStorage.get<QrCode[]>(KEY) ?? [];
}
const set = (value: QrCode[]): void => {
  LocalStorage.set(KEY, value);
}
const del = (): void => {
  LocalStorage.del(KEY);
}
const QrcodeStorage = {
  get, set, del
}
export default QrcodeStorage;
