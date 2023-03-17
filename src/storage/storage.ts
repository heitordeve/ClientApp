
function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && value.isIsoDateFormat();
}

function handleDates(key: string, value: any) {
  if (isIsoDateString(value)) {
    return Date.tryParse(value)
  }
  return value;
}

const get = <T extends object>(key: string): T => {
  return (JSON.parse(localStorage.getItem(key), handleDates) as T);
}
const set = (key: string, value: object): void => {
  localStorage.setItem(key, JSON.stringify(value));
}
const update = (key: string, value: object): void => {
  const obj = get(key);
  set(key, { ...obj, ...value })
}
const del = (key: string): void => {
  localStorage.removeItem(key);
}

const LocalStorage = {
  get, set, update, del
}
export default LocalStorage;

