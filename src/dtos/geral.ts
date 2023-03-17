export interface MaxMin<T> {
  Max: T,
  Min: T
}

export interface Coordenadas {
  Latitude: number;
  Longitude: number;
}
export interface PosicaoGps extends Coordenadas {
  Raio: number
}
