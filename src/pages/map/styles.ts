import styled from 'styled-components';
import { Button } from '@material-ui/core';

interface LineColorBadge {
  lineColor: string;
  textColor: string;
}

export const Container = styled.div`
  display: flex;
`;
export const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

export const Logo = styled.img`
  width: 60;
  height: 60;
`;

export const DrawerContainer = styled.div`
  display: flex;
  width: 380px;
  min-width: 380px;
  max-width: 380px;
  height: 100vh;
  flex-direction: column;
  background-color: #fff;
`;

export const DrawerInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px;
  height: 92px;
  background-color: #e8e4f1;
  justify-content: space-around;
  align-items: center;
  box-sizing: initial;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 98%;
`;

export const CurrentLocationContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 62px;
  align-items: center;
  overflow: auto;
`;

export const TransparentButton = styled(Button)`
  background-color: transparent;
  border: 0px solid transparent;
  width: 100%;
  height: 100%;
  padding: 0px 16px;
  border-bottom: 1px solid #e8e4f1;
  justify-content: flex-start;
`;
export const TransparentButtonContent = styled.div`
  display: flex;
  align-content: flex-start;
  font-size: 10pt;
`;
export const TransparentButtontText = styled.span`
  color: #838383;
  margin-left: 8px;
`;

export const DrawerHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px;
  height: 50px;
  background-color: #7762af;
  justify-content: space-between;
  align-items: center;
  box-sizing: initial;
`;

export const Drawer = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  height: 99vh;
  background-color: #ccc;
`;
export const RoutesContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 62px;
  align-items: center;
`;

export const DrawerBtn = styled.a`
  position: absolute;
  display: flex;
  justifty-content: center;
  align-items: center;
  width: 24px;
  height: 56px;
  left: 450;
  top: calc(50% - 56px / 2);
  background: #ffffff;
  box-shadow: 1px 0px 2px rgba(0, 0, 0, 0.1);
  border-radius: 0px 8px 8px 0px;
  z-index: 9999;
`;

export const DetailContainer = styled.div`
  overflow: auto;
`;

export const BusNumberBadge = styled.span<LineColorBadge>`
  background-color: ${(props: LineColorBadge) => props.lineColor};
  margin-left: 3px;
  color: ${(props: LineColorBadge) => props.textColor};
  font-weight: bold;
  padding: 0px 8px;
  border-radius: 7px;
  font-size: 10.5pt;
`;

export const RouteCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10pt;
  color: #666666;
  font-weight: bold;
`;
export const RouteCardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const RouteStepsResume = styled.div`
  display: flex;
  margin: 5px 0px;
  align-items: center;
  flex-wrap: wrap;
`;
export const RouteDetailBtn = styled(Button)`
  color: #7762af;
  justify-content: flex-start;
`;
