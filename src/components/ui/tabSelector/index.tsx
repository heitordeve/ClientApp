import React from 'react';
import styled from 'styled-components';
import { Colors, colorMap, gray2, gray3, gray4 } from 'styles/consts';
import { Row, Hr } from '../layout';

export interface Tab {
  id: number;
  name: string;
}

export class BaseTabs<T extends Tab> {
  constructor(tabs: T[]) {
    this.tabs = tabs;
  }
  tabs: T[];
  get = (id: number): T => this.tabs.find(t => t.id === id);
}
export class Tabs extends BaseTabs<Tab> {}

export class PagedLoadTabs extends BaseTabs<PagedLoadTab> {
  refresh = (id: number) => this.get(id).refresh();
  next = (id: number) => this.get(id).next();
  stop = (id: number) => this.get(id).stop();
  isActive = (id: number) => this.get(id).isActive();
}
export class PagedLoadTab implements Tab {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.countLoads = 0;
    this.canLoad = true;
  }
  id: number;
  name: string;
  countLoads: number;
  canLoad: boolean;
  refresh = () => {
    this.countLoads = 0;
    this.canLoad = true;
  };
  next = () => this.countLoads++;
  stop = () => (this.canLoad = false);
  isActive = () => this.canLoad;
}

interface TabProps {
  tab: Tab;
  selected?: boolean;
  disabled?: boolean;
  color?: string;
  onClick?: (id: number) => void;
}
interface TabSelectorProps {
  tabs?: Tab[] | Tabs;
  selectedId?: number;
  disabled?: boolean;
  sticky?: boolean;
  color?: Colors;
  onClick?: (id: number) => void;
}

const Container = styled(Row)`
  &.sticky {
    position: sticky;
    top: 0;
    z-index: 10;
    background: white;
  }
`;
export const TextTab = styled.div`
  font-style: normal;
  font-size: 17px;
  padding: 10px 0px 10px 0px;
  text-align: center;
  text-transform: capitalize;
`;
interface ContentTabProps {
  color: string;
}

const ContentTab = styled.button<ContentTabProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  flex: 1;
  border: 0;
  color: ${gray3};
  background: none;
  ${Hr} {
    background: ${gray3};
  }
  &:disabled {
    ${Hr} {
      background: ${gray2};
    }
  }
  &.selected:not(:disabled) {
    color: ${gray4};
    ${Hr} {
      background: ${({ color }) => color};
    }
  }

  &:hover:not(:disabled) {
    color: ${gray4};
    ${Hr} {
      background: ${({ color }) => color};
    }
  }
`;

const Tab: React.FC<TabProps> = ({ tab, selected, disabled, onClick, color }) => {
  let fontWeight = 600;
  if (selected && !disabled) {
    fontWeight = 700;
  }
  return (
    <ContentTab
      type="button"
      className={selected && 'selected'}
      disabled={disabled}
      color={color}
      onClick={() => {
        !disabled && onClick(tab.id);
      }}
    >
      <TextTab style={{ fontWeight }}>{tab.name}</TextTab>
      <Hr className="lg" />
    </ContentTab>
  );
};

const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  selectedId,
  disabled,
  onClick,
  sticky,
  color = 'primary',
}) => {
  var arr: Tab[] = tabs instanceof BaseTabs ? tabs.tabs : tabs;
  return (
    <Container gap="4px" className={sticky ? 'sticky' : ''}>
      {arr.map(tab => (
        <Tab
          key={tab.id}
          tab={tab}
          selected={selectedId === tab.id}
          disabled={disabled}
          onClick={onClick}
          color={colorMap.get(color)}
        />
      ))}
    </Container>
  );
};
export default TabSelector;
