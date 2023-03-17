import { ColorScheme } from 'styles/consts';

export const StausQrCode = new Map<string, { lebel: (recarga: boolean) => string, color: (recarga: boolean) => ColorScheme }>();
StausQrCode.set('0', { lebel: r => r ? 'Compra' : 'Válido', color: r => r ? 'success' : 'info' });
StausQrCode.set('1', { lebel: () => 'Utilizado', color: () => 'danger' });
StausQrCode.set('2', { lebel: () => 'Expirado', color: () => 'warning' });
StausQrCode.set('3', { lebel: r => r ? 'Restituição' : null, color: () => 'success' });
StausQrCode.set('4', { lebel: () => 'Estorno Ressarcimento', color: () => 'gray-3' });


export const TipoEventoQrCode = new Map<string, string>();
TipoEventoQrCode.set('C', 'Recarga');
TipoEventoQrCode.set('U', 'Uso');
