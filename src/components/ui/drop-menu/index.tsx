import React, { useState, useRef, useCallback } from 'react';

import { BsThreeDotsVertical } from 'react-icons/bs';

import styled from 'styled-components';
import Button from '../button';
import { Column, Row } from '../layout';
import { Link } from 'react-router-dom';
import { LocationDescriptor, LocationState, Location } from 'history';
import { IconType } from 'react-icons';
import { Strong } from '../typography';
import { primary, gray2, gray4, zIndex } from 'styles/consts';

interface DropdownItemProps {
  top: number;
  bottom: number;
  left?: number;
  right?: number;
}
const Dropdown = styled(Column)<DropdownItemProps>`
  position: absolute;
  background: #fff;
  min-width: 150px;
  min-height: 10px;
  border-radius: 2px;
  ${({ top }) => top && `top: ${top}px`};
  ${({ bottom }) => bottom && `bottom: ${bottom}px`};
  ${({ left }) => left && `left: ${left}px`};
  ${({ right }) => right && `right: ${right}px`};
`;
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${zIndex.dropdown};
`;

const Item = styled(Column)`
  height: 56px;
  > a {
    text-decoration: none;
    border-left: 6px solid ${gray2};
    color: ${gray4};
    height: 100%;
    &:hover {
      border-color: ${primary};
      color: ${primary};
      background: #f0efff;
    }
  }
  &:first-child > a {
    border-radius: 2px 2px 0 0;
  }
  &:last-child > a {
    border-radius: 0 0 2px 2px;
  }
`;

interface ItemProps {
  text: string;
  icon?: IconType;
  onClick?: () => void;
  show?: boolean;
  to?:
    | LocationDescriptor<LocationState>
    | ((location: Location<LocationState>) => LocationDescriptor<LocationState>);
}

interface DropMenuProps {
  itens: Array<ItemProps>;
}

const DropMenu: React.FC<DropMenuProps> = ({ itens }) => {
  const [show, setShow] = useState<boolean>(false);
  const [top, setTop] = useState<number>(null);
  const [bottom, setBottom] = useState<number>(null);
  const [left, setLeft] = useState<number>(null);
  const [right, setRight] = useState<number>(null);

  const btnRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const reposisionar = useCallback(async () => {
    const {
      top: tmpTop,
      left: tmpLeft,
      bottom: tmpBottom,
      right: tmpRight,
    } = btnRef.current.getBoundingClientRect();
    const winWidth = window.outerWidth;
    const winHeight = window.innerHeight;
    const dropHeight = itens.filter(i => i.show || i.show === undefined).length * 56;
    if (tmpBottom + dropHeight > winHeight) {
      setTop(null);
      var botttomTmp = Math.min(winHeight - tmpTop, winHeight - dropHeight - 15);
      setBottom(botttomTmp);
    } else {
      setTop(tmpBottom);
      setBottom(null);
    }
    if (winWidth - 150 > tmpLeft) {
      setLeft(tmpLeft);
      setRight(null);
    } else {
      setRight(winWidth - tmpRight);
      setLeft(null);
    }
  }, [btnRef, setTop, setLeft, setRight, itens]);

  const alternar = useCallback(async () => {
    reposisionar();
    setShow(prev => !prev);
  }, [reposisionar, setShow]);

  return (
    <>
      <div ref={btnRef}>
        <Button theme="outlined" color="primary" onClick={() => alternar()}>
          <BsThreeDotsVertical size={25} />
        </Button>
      </div>
      {show && (
        <OverlayContainer>
          <Overlay onClick={() => setShow(prev => !prev)} />
          <Dropdown
            top={top}
            bottom={bottom}
            left={left}
            right={right}
            className="shadow-4"
            ref={dropRef}
          >
            {itens
              .filter(i => i.show || i.show === undefined)
              ?.map(({ icon: Icon, text, onClick, to = '#' }, i) => (
                <Item key={i}>
                  <Link
                    to={to}
                    onClick={() => {
                      setShow(false);
                      onClick?.();
                    }}
                  >
                    <Column height="100%" justify="center">
                      <Row align="center" gap="12px" padding="0 12px">
                        {Icon && <Icon size={24} />}
                        <Strong>{text}</Strong>
                      </Row>
                    </Column>
                  </Link>
                </Item>
              ))}
          </Dropdown>
        </OverlayContainer>
      )}
    </>
  );
};

export default DropMenu;
