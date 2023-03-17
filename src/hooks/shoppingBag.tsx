import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth';
import { ShoppingBagData } from '../dtos/ShoppingBagData';
interface ShoppingBagContextData {
  shoppingBag: ShoppingBagData[];
  getShoppingBag(): ShoppingBagData[];
  addShoppingBag(item: ShoppingBagData): void;
  removeShoppingBag(where: (item: ShoppingBagData) => boolean): ShoppingBagData[];
}

const ShoppingBagContext = createContext<ShoppingBagContextData>({} as ShoppingBagContextData);
const shoppingBagKey = '@Kim:shoppingBag';

const ShoppingBagProvider: React.FC = ({ children }) => {
  const { user } = useAuth();
  const [shoppingBag, setShoppingBag] = useState<ShoppingBagData[]>([]);

  const defineShoppingBag = useCallback((value: ShoppingBagData[]) => {
    localStorage.setItem(shoppingBagKey, JSON.stringify(value));
    setShoppingBag(value);
  }, []);

  useEffect(() => {
    localStorage.setItem(shoppingBagKey, '[]');
    setShoppingBag([]);
  }, [user]);

  useEffect(() => {
    if (localStorage.getItem(shoppingBagKey) === null) {
      defineShoppingBag([]);
    }
  }, [defineShoppingBag]);

  const getShoppingBag: () => ShoppingBagData[] = useCallback(() => {
    let result: ShoppingBagData[] = [];
    try {
      let tmpShoppingBag = JSON.parse(localStorage.getItem(shoppingBagKey));
      if (Array.isArray(tmpShoppingBag)) {
        defineShoppingBag(tmpShoppingBag);
        result = tmpShoppingBag;
      } else {
        defineShoppingBag([]);
      }
    } catch (err) {
      defineShoppingBag([]);
    }
    return result;
  }, [defineShoppingBag]);

  const addShoppingBag = useCallback(
    (item: ShoppingBagData) => {
      let result = item;
      result.Codigo = Date.now();
      defineShoppingBag([...getShoppingBag(), result]);
    },
    [getShoppingBag, defineShoppingBag],
  );

  const removeShoppingBag = useCallback(
    (where: (item: ShoppingBagData) => boolean) => {
      let result: ShoppingBagData[][] = [[], []];
      try {
        //split data by condition:
        //0 -> pass
        //1 -> fail
        result = getShoppingBag().reduce(
          ([pass, fail], elem) => {
            return where(elem) ? [pass, [...fail, elem]] : [[...pass, elem], fail];
          },
          [[], []] as ShoppingBagData[][],
        );
        //set new shopping bag
        defineShoppingBag(result[0] /*pass*/);
        //return removed items
      } catch (err) {
        defineShoppingBag([]);
      }
      return result[1] /*fail*/;
    },
    [getShoppingBag, defineShoppingBag],
  );

  return (
    <ShoppingBagContext.Provider
      value={{
        shoppingBag: shoppingBag,
        getShoppingBag: getShoppingBag,
        addShoppingBag: addShoppingBag,
        removeShoppingBag: removeShoppingBag,
      }}
    >
      {children}
    </ShoppingBagContext.Provider>
  );
};

export function useShoppingBag(): ShoppingBagContextData {
  return useContext(ShoppingBagContext);
}

export { ShoppingBagProvider };
