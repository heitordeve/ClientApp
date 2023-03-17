import React, { useState, createContext, useContext, useCallback } from 'react';

export interface LoadContextData {
  isloading: boolean;
  addLoad: (codigo: string) => void;
  removeLoad: (codigo: string) => void;
  hasLoad: (codigo: string) => boolean;
}
const defaltValue: LoadContextData = {
  isloading: false,
  addLoad: () => {},
  removeLoad: () => {},
  hasLoad: () => false,
};

const LoadContext = createContext<LoadContextData>(defaltValue);
interface Load {
  codigo: string;
  timeout: NodeJS.Timeout;
}
let loads: Load[] = [];
const LoadProvider: React.FC = ({ children }) => {
  const [isloading, setLoading] = useState(false);

  const removeLoad = useCallback((codigo: string) => {
    let tmpLoads = [...loads];
    const tmpload = tmpLoads.find(l => l.codigo === codigo);
    if (tmpload) {
      clearTimeout(tmpload.timeout);
      loads = tmpLoads.remove(l => l.codigo === codigo);
      setLoading(loads.length > 0);
    }
  }, []);

  const addLoad = useCallback(
    (codigo: string) => {
      const tmpLoad = {
        codigo: codigo,
        timeout: setTimeout(() => removeLoad(codigo), 30000),
      };
      loads.push(tmpLoad);
      setLoading(loads.length > 0);
    },
    [removeLoad],
  );

  const hasLoad = useCallback((codigo: string) => {
    return loads.some(c => c.codigo === codigo);
  }, []);

  return (
    <LoadContext.Provider
      value={{
        addLoad,
        removeLoad,
        isloading,
        hasLoad,
      }}
    >
      {children}
    </LoadContext.Provider>
  );
};

function useLoad(codigo?: string) {
  return useContext(LoadContext);
}

export { LoadProvider, useLoad };
