import { Coordenadas } from "dtos/geral";
import GpsUtils from "./gps";

describe('GpsUtils', () => {
  describe('getDistanciaEmKm', () => {
    it('Deve reornar 0"', () => {
      const coo: Coordenadas = { Latitude: -19.965404067691196, Longitude: -43.954586498720154 }
      const distancia = GpsUtils.getDistanciaEmKm(coo, coo);
      expect(distancia).toEqual(0)
    })
    it('Deve reornar 1"', () => {
      const coo1: Coordenadas = { Latitude: -19.96534084, Longitude: -43.9545332 }
      const coo2: Coordenadas = { Latitude: -19.95671157, Longitude: -43.9572278 }
      const distancia = GpsUtils.getDistanciaEmKm(coo1, coo2);
      expect(distancia).toEqual(1)
    })
    it('Deve reornar 3.42"', () => {
      const coo1: Coordenadas = { Latitude: -19.96534084, Longitude: -43.9545332 }
      const coo2: Coordenadas = { Latitude: -19.934591, Longitude: -43.952810 }
      const distancia = GpsUtils.getDistanciaEmKm(coo1, coo2);
      expect(distancia).toEqual(3.42)
    })
    it('Deve reornar 970.28"', () => {
      const coo1: Coordenadas = { Latitude: -19.96534084, Longitude: -43.9545332 }
      const coo2: Coordenadas = { Latitude: -12.97565394, Longitude: -38.5028965}
      const distancia = GpsUtils.getDistanciaEmKm(coo1, coo2);
      expect(distancia).toEqual(970.28)
    })
  })
})

export { }
