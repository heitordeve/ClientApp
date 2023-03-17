import React, { useState, useRef, useEffect, useCallback } from 'react';

import { Column } from '../../ui/layout';
import { LoadMini } from '../../ui/loading';
import { throttle } from 'throttle-debounce';

interface InfiniteScrollProps {
  onReachBottom?: (count: number) => Promise<void> | void;
  children?: React.ReactNode;
  hasMore?: boolean;
}
const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ onReachBottom, children, hasMore }) => {
  const refLoad = useRef<HTMLDivElement>(null);
  const [isloading, setIsloading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [reached, setReached] = useState<boolean>(false);

  const onReached = useCallback(async () => {
    if (hasMore) {
      setIsloading(true);
      await onReachBottom?.(count);
      setCount(count + 1);
      setIsloading(false);
    }
  }, [count, setCount, onReachBottom, hasMore]);

  useEffect(() => {
    if (reached) {
      onReached();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reached]);

  useEffect(() => {
    const onScroll = throttle(300, async (ev: Event) => {
      const botton = refLoad?.current?.offsetTop ?? document.body.offsetHeight;
      const main = document.querySelector('main');
      const scrollHeight = main.scrollTop + main.offsetHeight;
      if (!isloading && scrollHeight >= botton && main.scrollTop < botton) {
        setReached(true);
      } else {
        setReached(false);
      }
    });
    document.querySelector('main').addEventListener('scroll', onScroll);
    return () => {
      document.querySelector('main').removeEventListener('scroll', onScroll);
    };
  }, [isloading]);
  return (
    <Column>
      {children}
      <div ref={refLoad}>
        <LoadMini loading={isloading} timeout={60} />
      </div>
    </Column>
  );
};

export default InfiniteScroll;
