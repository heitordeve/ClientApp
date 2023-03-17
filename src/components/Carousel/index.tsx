import React, { useCallback, useState, useRef, useEffect } from 'react';

import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

import {
  CarouselIndicatorsHolder,
  CarouselControlHolder,
  CarouselPageHolder,
  CarouselHolder,
} from './styles';

interface CarouselIndicatorProps {
  position: number;
  size: number;
  onClick: (local: number) => void;
}

const CarouselIndicator: React.FC<CarouselIndicatorProps> = ({ position, size, onClick, }) => {

  const renderDots = useCallback(() => {
    let dots: React.ReactNode;
    if (size > 11) {
      if (position < 3 || position > (size - 4)) {
        let mid = Math.floor(size / 2);
        dots = (
          <>
            <GoPrimitiveDot className={`carousel-dot-0`} key={`carousel-dot-0`}
              onClick={() => onClick(0)}
            />
            <GoPrimitiveDot className={`carousel-dot-1`} key={`carousel-dot-1`}
              onClick={() => onClick(1)}
            />
            <GoPrimitiveDot className={`carousel-dot-2`} key={`carousel-dot-2`}
              onClick={() => onClick(2)}
            />
            &nbsp;&nbsp;
            <GoPrimitiveDot className={`carousel-dot-${mid-1}`} key={`carousel-dot-${mid-1}`}
              onClick={() => onClick(mid-1)}
            />
            <GoPrimitiveDot className={`carousel-dot-${mid}`} key={`carousel-dot-${mid}`}
              onClick={() => onClick(mid)}
            />
            <GoPrimitiveDot className={`carousel-dot-${mid+1}`} key={`carousel-dot-${mid+1}`}
              onClick={() => onClick(mid+1)}
            />
            &nbsp;&nbsp;
            <GoPrimitiveDot className={`carousel-dot-${size-3}`} key={`carousel-dot-${size-3}`}
              onClick={() => onClick(size-3)}
            />
            <GoPrimitiveDot className={`carousel-dot-${size-2}`} key={`carousel-dot-${size-2}`}
              onClick={() => onClick(size-2)}
            />
            <GoPrimitiveDot className={`carousel-dot-${size-1}`} key={`carousel-dot-${size-1}`}
              onClick={() => onClick(size-1)}
            />
          </>
        );
      } else {
        dots = (
          <>
            <GoPrimitiveDot className={`carousel-dot-0`} key={`carousel-dot-0`}
              onClick={() => onClick(0)}
            />
            <GoPrimitiveDot className={`carousel-dot-1`} key={`carousel-dot-1`}
              onClick={() => onClick(1)}
            />
            <GoPrimitiveDot className={`carousel-dot-2`} key={`carousel-dot-2`}
              onClick={() => onClick(2)}
            />
            &nbsp;&nbsp;
            <GoPrimitiveDot className={`carousel-dot-${position-1}`} key={`carousel-dot-${position-1}`}
              onClick={() => onClick(position-1)}
            />
            <GoPrimitiveDot className={`carousel-dot-${position}`} key={`carousel-dot-${position}`}
              onClick={() => onClick(position)}
            />
            <GoPrimitiveDot className={`carousel-dot-${position+1}`} key={`carousel-dot-${position+1}`}
              onClick={() => onClick(position+1)}
            />
            &nbsp;&nbsp;
            <GoPrimitiveDot className={`carousel-dot-${size-3}`} key={`carousel-dot-${size-3}`}
              onClick={() => onClick(size-3)}
            />
            <GoPrimitiveDot className={`carousel-dot-${size-2}`} key={`carousel-dot-${size-2}`}
              onClick={() => onClick(size-2)}
            />
            <GoPrimitiveDot className={`carousel-dot-${size-1}`} key={`carousel-dot-${size-1}`}
              onClick={() => onClick(size-1)}
            />
          </>
        );
      }
    } else {
      for (let i = 0; i < size; i++) {
        dots = (
          <>
            {dots}
            <GoPrimitiveDot className={`carousel-dot-${i}`} key={`carousel-dot-${i}`}
              onClick={() => onClick(i)}
            />
          </>
        );
      }
    }

    return dots;
  }, [size, position, onClick]);

  return <CarouselIndicatorsHolder theme={{ selected: position}} >{renderDots()}</CarouselIndicatorsHolder>;
};

interface CarouselControlProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

const CarouselControl: React.FC<CarouselControlProps> = ({
  direction,
  onClick,
}) => {
  return (
    <CarouselControlHolder onClick={onClick}>
      {(direction === 'left' && <IoIosArrowBack />) || <IoIosArrowForward />}
    </CarouselControlHolder>
  );
};

interface CarouselProps {
  pages: React.ReactNode[];
  width: string;
}

const Carousel: React.FC<CarouselProps> = ({ pages, width }) => {
  const [pageIndex, setPageIndex] = useState(0);

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current != null) {
      pageRef.current.addEventListener('resize', () => {
        if (pageRef.current != null) {
          pageRef.current.scroll({
            left: (pageRef.current.clientWidth * pageIndex) % (pageRef.current.scrollWidth * pages.length),
            behavior: 'smooth'
          });
        }
      });
    }
  }, [pageRef, pageIndex, pages]);

  useEffect(() => {
    if (pageRef.current != null) {
      pageRef.current.scroll({
        left: (pageRef.current.clientWidth * pageIndex) % (pageRef.current.scrollWidth * (pages.length)),
        behavior: 'smooth'
      });
    }
  }, [pageRef, pageIndex, pages]);

  const handleMove = useCallback((page: number) => {
      if (page !== pageIndex) {
        setPageIndex((page + pages.length) % pages.length);
      }
    },
    [pageIndex, pages],
  );

  return (
    <CarouselHolder>
      <CarouselControl
        direction="left"
        onClick={() => {
          handleMove(pageIndex - 1);
        }}
      />
      <div>
        <CarouselPageHolder ref={pageRef} style={{ width }}>
          <div>
            {pages?.map((page, index) => (
              <div key={`carousel-page-${index}`} style={{ width }}>
                {page}
              </div>
            ))}
          </div>
        </CarouselPageHolder>
        <CarouselIndicator
          size={pages?.length}
          position={pageIndex}
          onClick={handleMove}
        />
      </div>
      <CarouselControl
        direction="right"
        onClick={() => {
          handleMove(pageIndex + 1);
        }}
      />
    </CarouselHolder>
  );
};

export default Carousel;
