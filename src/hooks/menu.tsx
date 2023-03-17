import React, { useState, useCallback, createContext, useContext } from 'react';;

interface MenuContextData {
  setOpenMenu: (open: boolean) => void;
  toggleMenu: () => void;
  menuIsOpen: boolean;
  setOpenNavbar: (open: boolean) => void;
  toggleNavbar: () => void;
  navbarIsOpen: boolean;
}

const MenuContext = createContext<MenuContextData>({
  setOpenMenu: () => {},
  toggleMenu: () => {},
  setOpenNavbar: () => {},
  toggleNavbar: () => {},
  menuIsOpen: false,
  navbarIsOpen: true,
});

export const MenuProvider: React.FC = ({ children }) => {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [navbarIsOpen, setNavbarIsOpen] = useState<boolean>(true);

  const setOpenMenu = useCallback(
    (open: boolean) => {
      setMenuIsOpen(open);
    },
    [setMenuIsOpen],
  );

  const toggleMenu = useCallback(async () => {
    setMenuIsOpen(prev => !prev);
  }, [setMenuIsOpen]);

  const setOpenNavbar = useCallback(
    (open: boolean) => {
      setNavbarIsOpen(open);
    },
    [setNavbarIsOpen],
  );
  const toggleNavbar = useCallback(async () => {
    setNavbarIsOpen(prev => !prev);
  }, [setNavbarIsOpen]);

  return (
      <MenuContext.Provider
        value={{
          setOpenMenu,
          menuIsOpen,
          setOpenNavbar,
          navbarIsOpen,
          toggleMenu,
          toggleNavbar,
        }}
      >
        {children}
      </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
