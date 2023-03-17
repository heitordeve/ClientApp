import React, { useState, useCallback, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import { GoPrimitiveDot } from 'react-icons/go';

import Button from '../ui/button';

import {
  FunctionalityOptionsHolder,
  FunctionalityQuestionButton,
  FunctionalityOptionsButton,
  FunctionalityHeader,
  FunctionalityBody,
  FunctionalityFooter,
  FunctionalityCardHolder,
  ProgressBarHolder,
  LabeledCardHrHolder,
  CardHr,
  FunctionalityCancelButton,
} from './styles';

export { CardHr, CardSubtitle, CardsHolder } from './styles';

const isSmallWidth = window.matchMedia('(max-width: 1000px)').matches;

export const LabeledHr: React.FC = ({ children }) => {
  return (
    <LabeledCardHrHolder>
      <CardHr />
      <div>{children}</div>
      <CardHr />
    </LabeledCardHrHolder>
  );
};

interface FunctionalityProgressBarProps {
  data?: {
    size: number;
    current: number;
  };
  color: string;
}

const FunctionalityProgressBar: React.FC<FunctionalityProgressBarProps> = ({ data, color }) => {
  if (typeof data === 'undefined') return <></>;

  const prgsBarData: JSX.Element[] = [];

  for (let i = 0; i < data.size; i++) {
    prgsBarData.push(<GoPrimitiveDot key={i} color={i > data.current ? '#D1CED6' : color} />);
  }

  return <ProgressBarHolder>{prgsBarData}</ProgressBarHolder>;
};

export interface FunctionalityCardComponents {
  doubt?: {
    onClick?: () => void;
  };
  cancel?: {
    cancelAppend?: React.ReactNode;
    id?: string;
    onClick?: () => void;
  };
  options?: {
    onClick?: (isOpen: boolean) => boolean;
    optionsContent?: React.ReactNode;
  };
  action?: {
    text: string;
    startAlerting?: boolean;
    onClick?: (isAlerting: boolean, callback: (alert: boolean) => void) => void;
    alertText?: string;
    alertContent?: React.ReactNode;
  };
  progressBar?: {
    size: number;
    current: number;
  };
}

export interface FunctionalityCardProps {
  id?: string;
  title: string;
  color?: string;
  children?: React.ReactNode;
  components?: FunctionalityCardComponents;
  minHeight?: string;
}

const FunctionalityCard: React.FC<FunctionalityCardProps> = ({
  minHeight,
  components,
  color,
  title,
  children,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (typeof components?.action?.startAlerting !== 'undefined') {
      setShowAlert(components?.action?.startAlerting);
    }
    return () => {
      if (typeof components?.action?.startAlerting !== 'undefined') setShowAlert(false);
    };
  }, [components]);

  const handleActionClick = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    components?.action?.onClick?.call({}, showAlert, (alert: React.SetStateAction<boolean>) => {
      setShowAlert(alert);
    });
  }, [showAlert, components]);

  const handleOptionsClick = useCallback(() => {
    setShowOptions(components?.options?.onClick?.(showOptions) ?? !showOptions);
  }, [showOptions, components]);

  return (
    <FunctionalityCardHolder className={showAlert ? 'dashbord-alert' : ''} minHeight={minHeight}>
      <FunctionalityHeader style={{ backgroundColor: color }}>
        {title}
        <FunctionalityOptionsHolder>
          {typeof components?.doubt !== 'undefined' && (
            <FunctionalityQuestionButton onClick={components?.doubt.onClick} />
          )}
          {typeof components?.cancel !== 'undefined' && (
            <>
              <FunctionalityCancelButton
                id={components?.cancel?.id}
                onClick={components?.cancel?.onClick}
              />
              {components?.cancel?.cancelAppend}
            </>
          )}
          {typeof components?.options !== 'undefined' && (
            <Dropdown
              direction={isSmallWidth ? 'left' : 'right'}
              isOpen={showOptions}
              toggle={handleOptionsClick}
            >
              <DropdownToggle tag="span">
                <FunctionalityOptionsButton />
              </DropdownToggle>
              <DropdownMenu>{components?.options?.optionsContent}</DropdownMenu>
            </Dropdown>
          )}
        </FunctionalityOptionsHolder>
      </FunctionalityHeader>
      <FunctionalityBody style={{ color: showAlert ? '#FFFFFF' : 'inherit' }}>
        {showAlert ? components?.action?.alertContent : children}
      </FunctionalityBody>
      {(typeof components?.action !== 'undefined' ||
        typeof components?.progressBar !== 'undefined') && (
        <FunctionalityFooter>
          {typeof components?.action !== 'undefined' && (
            <Button onClick={handleActionClick} className={showAlert ? 'reverse-colors' : ''}>
              {showAlert ? components?.action.alertText : components?.action.text}
            </Button>
          )}
          <FunctionalityProgressBar
            data={components?.progressBar}
            color={showAlert ? '#15CDF9' : '#672ED7'}
          />
        </FunctionalityFooter>
      )}
    </FunctionalityCardHolder>
  );
};

export default FunctionalityCard;
