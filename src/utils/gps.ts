import { Coordenadas } from "dtos/geral";

const getCoordenadasAsync = async (): Promise<Coordenadas> => {
  if ('geolocation' in navigator) {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    try {
      const geo: any = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, options),
      );
      const { latitude, longitude } = geo.coords;
      return { Latitude: latitude, Longitude: longitude };
    } catch {
      return null;
    }
  } else {
    return null;
  }
}

function getDistanciaEmKm(coo1: Coordenadas, coo2: Coordenadas) {
  if (!coo1 || !coo2) {
    return 0;
  }
  const deg2rad = (deg: number) => deg * (Math.PI / 180);
  const cosDeg2rad = (num: number) => Math.cos(deg2rad(num));
  const quadradoSeno = (num: number) => Math.pow(Math.sin(num / 2), 2);
  const RaioTerra = 6371;
  const dLat = deg2rad(coo2.Latitude - coo1.Latitude);
  const dLng = deg2rad(coo2.Longitude - coo1.Longitude);
  const a = quadradoSeno(dLat)
    + cosDeg2rad(coo1.Latitude)
    * cosDeg2rad(coo2.Latitude)
    * quadradoSeno(dLng);
  const distancia = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * RaioTerra;
  return Math.round(distancia * 100) / 100;
}

const GpsUtils = {
  getCoordenadasAsync,
  getDistanciaEmKm
}
export default GpsUtils;
