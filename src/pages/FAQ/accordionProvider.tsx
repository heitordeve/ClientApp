import { Column } from 'components/ui/layout';
import React, { createContext, useContext } from 'react';

interface AccordionContextData {
  setExpanded: React.Dispatch<React.SetStateAction<string | number>>;
  expanded: number | string;
}

const AccordionContext = createContext<AccordionContextData>({
  setExpanded: (value: string | number | ((prevState: string | number) => string | number)) => {},
  expanded: null,
});

interface AccordionProviderProps {
  round?: boolean;
}

export const AccordionProvider: React.FC<AccordionProviderProps> = ({ round, children }) => {
  const [expanded, setExpanded] = React.useState<number | string>(null);

  return (
    <AccordionContext.Provider
      value={{
        setExpanded,
        expanded,
      }}
    >
      <Column radius={round ? '10px' : ''} overflow="hidden" width="100%">
        {children}
      </Column>
    </AccordionContext.Provider>
  );
};

export const useAccordion = () => useContext(AccordionContext);
