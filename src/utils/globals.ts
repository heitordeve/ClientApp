/*eslint no-extend-native: "off"*/
import { RX_ISO_DATE } from './dateUtils';
declare global {
  interface Number {
    toDecimalString(): string;
    toMoneyString(): string;
    between(start: number, end: number): boolean;
  }
  interface String {
    ToNumber(): number;
    isIsoDateFormat(): boolean;
    replaceAll(searchValue: string | RegExp, replaceValue: string | ((substring: string, ...args: any[]) => string)): string;
  }
  interface Array<T> {
    remove(condition: (value: T) => boolean): T[];
    group<K>(callbackfn: (item: T) => K): Groups<K, T>;
    order<K>(callbackfn?: (item: T) => K): T[];
  }

  interface Date {
    addYears(years: number): Date;
    addDays(days: number): Date;
    format(format: string): string;
  }
  interface DateConstructor {
    tryParse(value: string): Date | string;
  }
  interface File {
    toBase64(dataType?: boolean): Promise<string>;
  }
}
//Number
Number.prototype.toDecimalString = function () {
  return this.toLocaleString(undefined, { minimumFractionDigits: 2 });
};
Number.prototype.toMoneyString = function () {
  const formeter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  return formeter.format(this);
};
Number.prototype.between = function (start: number, end: number) {
  return this >= start && this <= end;
};

//Array
Array.prototype.remove = function <T>(this: T[], condition: (value: T, index: number, array: T[]) => boolean): T[] {
  return this.filter((v, i, arr) => !condition(v, i, arr));
};
class Groups<K, T> extends Array<Group<K, T>>{
  constructor(items?: Array<Group<K, T>>) {
    items.length > 0 ? super(...items) : super()
  }

  get(key: K): T[] {
    return this.find(g => g.key === key)?.group ?? []
  }
}
class Group<K, T>{
  constructor(key: K, group: T[]) {
    this.key = key;
    this.group = group;
  }
  key: K;
  group: T[]
}
Array.prototype.group = function <U, K>(callbackfn: (item: U) => K): Groups<K, U> {
  const map = new Map<K, U[]>();
  this.forEach((i: U) => {
    const key = callbackfn(i);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [i]);
    } else {
      collection.push(i);
    }
  });
  const arr = Array.from(map).map(i => new Group<K, U>(i[0], i[1]));
  return new Groups<K, U>(arr);
}
Array.prototype.order = function <U, K>(callbackfn?: (item: U) => K): U[] {
  return (this as U[]).sort((a, b) => {
    const valA = callbackfn?.(a) ?? a;
    const valB = callbackfn?.(b) ?? b;
    if (valA < valB) { return -1 }
    if (valA > valB) { return 1 }
    else return 0
  });
}


//String
String.prototype.ToNumber = function () {
  const isBrFormat = /^(((\d+)(\.\d{3})*(,\d+))|(\d*))$/g.test(this)
  const value = isBrFormat ? this.replaceAll('.', '').replace(',', '.') : this;
  return Number(value)
};

String.prototype.isIsoDateFormat = function () {
  return RX_ISO_DATE.test(this);
};
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (searchValue: string | RegExp, replaceValue: string | ((substring: string, ...args: any[]) => string)): string {
    return this.split(searchValue).join(replaceValue);
  };
}
//Date
Date.prototype.addYears = function (years: number) {
  this.setFullYear(this.getFullYear() + years)
  return this;
};
Date.prototype.addDays = function (days: number) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
Date.prototype.format = function (format: string) {
  const converts: { match: string, func: () => string }[] = [
    { match: 'ss', func: () => this.getSeconds().toString().padStart(2, '0') },
    { match: 'mm', func: () => this.getMinutes().toString().padStart(2, '0') },
    { match: 'HH', func: () => this.getHours().toString().padStart(2, '0') },
    { match: 'dd', func: () => this.getDate().toString().padStart(2, '0') },
    { match: 'MM', func: () => (this.getMonth() + 1).toString().padStart(2, '0') },
    { match: 'yyyy', func: () => this.getFullYear() }];
  converts.forEach((c) => format = format.replace(c.match, c.func()))
  return format;
};


Date.tryParse = function (value: string): Date | string {
  if (value && typeof value === "string" && value.isIsoDateFormat()) {
    return new Date(Date.parse(value))
  }
  return value;
}

//File
File.prototype.toBase64 = async function (dataType?: boolean): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(this);
    reader.onload = () => {
      let base = reader.result.toString()
      if (!dataType) {
        base = base.replace(/^data:(.*,)?/, '')
      }
      resolve(base)
    };
    reader.onerror = error => reject(error);
  });
};
export { }

