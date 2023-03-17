export interface validation<T> {
  execute: (value: T) => boolean
}
export class BaseValid<T> {
  valadations: ((value: T) => boolean)[];
  isValid = (value: T): boolean => this.valadations.some(v => !v(value));
}

export class Numbervalid extends BaseValid<number>{
  max = (max: number) => {
    this.valadations.push((value: number) => max >= value)
  }
  min = (min: number) => {
    this.valadations.push((value: number) => min <= value)
  }
}

const Valid = {
  Numbervalid
}
export default Valid

