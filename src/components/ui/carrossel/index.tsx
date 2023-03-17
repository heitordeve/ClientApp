import React, { useCallback, ReactNode, useEffect, useState, Children } from 'react';
import styled, { css } from 'styled-components';

import { Column, Row } from '../layout';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { primaryLight, primary, secondary } from 'styles/consts';
import { media, breakpoint } from 'styles';
import CarrosselItem from './carrosselItem';

interface GalleryContainerProps {
  count: number;
  height?: string;
}

const Container = styled.div<GalleryContainerProps>`
  align-items: center;
  display: flex;
  ${({ height }) => `height: ${height};`}
  margin: 0 auto;
  width: 100%;
  max-width: 1000px;
  position: relative;
  overflow-x: hidden;
  user-select: none;
  ${media.max(breakpoint.md)} {
    max-width: 100vw;
  }
  .ghost {
    opacity: 0;
    z-index: -1;
    pointer-events:none;
  }
  .item {
    > div {
      opacity: 0;
      transition: all 0.3s ease-in-out;
    }
    background: #fff;
    position: absolute;
    transition: all 0.3s ease-in-out;
    z-index: 0;
    left: 50%;
    transform: translateX(-50%) scale(0.25);
    max-width: 90vw;
  }
  ${({ count }) => {
    if (count === 1) {
      return css`
        .item-0 {
          left: 50%;
          transform: translateX(-50%);
          > div {
            opacity: 1;
          }
        }
      `;
    } else if (count < 5) {
      return css`
        .item-0,
        .item-2 {
          z-index: 2;
          transform: translateX(-50%) scale(0.75);
          > div {
            opacity: 0.6;
          }
        }
        .item-0 {
          left: 30%;
        }
        .item-1 {
          left: 50%;
          z-index: 3;
          transform: translateX(-50%);
          > div {
            opacity: 1;
          }
        }
        .item-2 {
          left: 70%;
        }
      `;
    } else {
      return css`
        .item-0 {
          left: 15%;
        }
        .item-0,
        .item-4 {
          transform: translateX(-50%) scale(0.5);
          > div {
            opacity: 0.4;
          }
        }
        .item-1,
        .item-3 {
          z-index: 2;
          transform: translateX(-50%) scale(0.75);
          > div {
            opacity: 0.6;
          }
        }
        .item-1 {
          left: 30%;
        }
        .item-2 {
          left: 50%;
          z-index: 3;
          transform: translateX(-50%);
          > div {
            opacity: 1;
          }
        }
        .item-3 {
          left: 70%;
        }
        .item-4 {
          left: 85%;
        }
      `;
    }
  }}
`;

const BtnDirection = styled.button`
  background: none;
  border: none;
  line-height: 0;
  svg {
    color: ${primary};
    &:hover {
      border-radius: 50%;
      color: ${secondary};
    }
  }
`;
const Dot = styled.button`
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  background: ${primaryLight};
  border: none;
  &:hover {
    background: ${secondary};
  }
  &.active {
    background: ${primary};
  }
`;

interface CarrosselProps {
  children?: ReactNode;
  height?: string;
}

const getShowCount = (count: number) => (count < 3 ? 1 : count < 5 ? 3 : 5);

const getCenter = (count: number) => Math.ceil(getShowCount(count) / 2);

const Carrossel: React.FC<CarrosselProps> = ({ children, height }) => {
  const [ids, setIds] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [mouseX, setMouseX] = useState<number>(0);

  const prev = useCallback(() => {
    setIds(pre => {
      const arr = [...pre];
      arr.unshift(arr.pop());
      return arr;
    });
  }, [setIds]);

  const next = useCallback(() => {
    setIds(pre => {
      const arr = [...pre];
      arr.push(arr.shift());
      return arr;
    });
  }, [setIds]);

  const goTo = useCallback(
    (id: string) => {
      const center = getCenter(count) - 1;
      const index = ids.indexOf(id);
      if (index > center) {
        for (let i = index - center; i > 0; i--) {
          next();
        }
      } else if (index < center) {
        for (let i = center - index; i > 0; i--) {
          prev();
        }
      }
    },
    [ids, count, next, prev],
  );

  useEffect(() => {
    let idsTmp = Children.toArray(children).map(item => {
      const idTmp = (item as { props: { id: string } }).props.id;
      return idTmp.replace('.$', '');
    });
    for (let i = getCenter(idsTmp.length) - 1; i > 0; i--) {
      idsTmp.unshift(idsTmp.pop());
    }
    setIds(prev => {
      let arr = [...prev];
      idsTmp.forEach(function (value) {
        if (arr.indexOf(value) === -1) arr.push(value);
      });
      setCount(arr.length);
      return arr;
    });
  }, [children]);

  const mousedownHandler = useCallback(
    (e: TouchEvent) => {
      const clientX = e.touches[0].clientX;
      if (e.touches.length === 1) setMouseX(clientX);
    },
    [setMouseX],
  );

  const mouseUpHandler = useCallback(
    (e: TouchEvent) => {
      const clientX = e.changedTouches[0].clientX;
      if (mouseX < clientX) {
        prev();
      } else if (mouseX > clientX) {
        next();
      }
    },
    [mouseX, prev, next],
  );
  useEffect(() => {
    document.addEventListener('touchstart', mousedownHandler);
    document.addEventListener('touchend', mouseUpHandler);
    return () => {
      document.removeEventListener('touchstart', mousedownHandler);
      document.removeEventListener('touchend', mouseUpHandler);
    };
  }, [mousedownHandler, mouseUpHandler]);

  return (
    <Column gap="12px">
      <Container count={count}>
        {Children.map(
          children,
          (child: React.ReactElement<any, string | React.JSXElementConstructor<any>>) => {
            const id = (child as { props: { id: string } }).props.id;
            const index = ids.indexOf(id);
            const className = 'item item-' + index;
            const center = getCenter(count);
            return (
              <>
                <CarrosselItem
                  key={id}
                  className={className}
                  isActive={index === center - 1}
                  onclick={() => goTo(id)}
                >
                  {child}
                </CarrosselItem>
                {React.cloneElement(child, {
                  className: `${child.props.className} ghost`,
                  key: `${child.props.id}-ghost`,
                })}
              </>
            );
          },
        )}
      </Container>
      <Row justify="center" align="center" gap="0.4em">
        <BtnDirection onClick={() => prev()}>
          <AiOutlineLeft />
        </BtnDirection>
        <Row gap="0.4em">
          {Children.map(children, (child: { props: { id: string } }, i) => {
            const center = getCenter(count);
            const isActive = child.props.id === ids[center - 1];
            return (
              <Dot className={isActive ? 'active' : ''} onClick={() => goTo(child.props.id)} />
            );
          })}
        </Row>
        <BtnDirection onClick={() => next()}>
          <AiOutlineRight />
        </BtnDirection>
      </Row>
    </Column>
  );
};
export { CarrosselItem };

export default Carrossel;
