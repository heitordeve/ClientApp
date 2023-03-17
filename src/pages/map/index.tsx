import React, { createRef, useEffect, useState } from 'react';
import { DirectionsRenderer, GoogleMap } from '@react-google-maps/api';

import logo from '../../assets/logos/logo-k.svg';
import directionsFrame from '../../assets/map-directions-frame.svg';
import { RiArrowRightSLine, RiMenu3Fill } from 'react-icons/ri';
import { TbArrowsDownUp } from 'react-icons/tb';
import {
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardBackspace,
  MdOutlineExpandMore,
  MdOutlineArrowRight,
  MdOutlineArrowLeft,
} from 'react-icons/md';

import { AiOutlineAim } from 'react-icons/ai';
import {
  IconButton,
  createStyles,
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import GoogleMapsAutoComplete from '../../components/AutocompleteGoogle';
import { BsFillBusFrontFill } from 'react-icons/bs';
import { BiWalk } from 'react-icons/bi';
import {
  BusNumberBadge,
  Container,
  CurrentLocationContainer,
  DetailContainer,
  DrawerBtn,
  DrawerContainer,
  DrawerHeader,
  DrawerInputContainer,
  InputGroup,
  Logo,
  MapContainer,
  RouteCardContent,
  RouteCardHeader,
  RouteDetailBtn,
  RoutesContainer,
  RouteStepsResume,
  TransparentButton,
  TransparentButtonContent,
  TransparentButtontText,
} from './styles';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: -19.9917651,
  lng: -44.0103913,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: 80,
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(14),
      color: theme.palette.text.secondary,
    },
  }),
);

const Map: React.FC = () => {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(true);
  const [lastInputFocused, setLastIputFocused] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [originObj, setOriginObj] = useState<any>(null);
  const [destinationObj, setDestinationObj] = useState<any>(null);
  const destinationRef = createRef<any>();
  const originRef = createRef<any>();
  const directionsService = new google.maps.DirectionsService();

  const findRoutes = () => {
    directionsService.route(
      {
        provideRouteAlternatives: true,
        destination: destinationObj?.coords?.latitude
          ? {
              lat: destinationObj.coords.latitude,
              lng: destinationObj.coords.longitude,
            }
          : destinationObj?.description,
        origin: originObj?.coords?.latitude
          ? {
              lat: originObj.coords.latitude,
              lng: originObj.coords.longitude,
            }
          : originObj?.description,
        travelMode: google.maps.TravelMode.TRANSIT,
      },
      (response, status) => {
        if (status === 'OK') {
          if (response !== directions) {
            setDirections(response);
            setSelectedRoute(0);
          }
        }
      },
    );
  };

  const onLoad = React.useCallback(function callback(map) {
    map.setZoom(14);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {}, []);

  useEffect(() => {
    document.getElementsByTagName('body')[0].style.margin = '0px';
  }, []);

  useEffect(() => {
    if (originObj !== null && destinationObj !== null) {
      findRoutes();
    }
  }, [originObj, destinationObj]);

  const handleSelectRoute = (routeIndex: any) => {
    setSelectedRoute(routeIndex);
  };

  const handleSetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (location: any) => {
        if (lastInputFocused == 1) {
          originRef.current?.setCurrentLocation();
          setOriginObj(location);
        }

        if (lastInputFocused == 2) {
          destinationRef.current?.setCurrentLocation();
          setDestinationObj(location);
        }
      },
      error => console.log(error),
      {},
    );
  };

  return (
    <Container>
      {openDrawer && (
        <DrawerContainer>
          <DrawerHeader>
            <Logo src={logo} alt="Logo" />
            <IconButton aria-label="delete" size="small" onClick={() => setOpenDrawer(!openDrawer)}>
              <RiMenu3Fill size={24} color={'white'} />
            </IconButton>
          </DrawerHeader>
          <DrawerInputContainer>
            <img src={directionsFrame} />
            <InputGroup>
              <GoogleMapsAutoComplete
                ref={originRef}
                onFocus={() => setLastIputFocused(1)}
                newValue={originObj}
                label="Ponto de Partida"
                onSetValue={(value: any) => setOriginObj(value)}
              />
              <GoogleMapsAutoComplete
                ref={destinationRef}
                onFocus={() => setLastIputFocused(2)}
                label="Destino"
                onSetValue={(value: any) => setDestinationObj(value)}
                newValue={destinationObj}
              />
            </InputGroup>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => [setDestinationObj(originObj), setOriginObj(destinationObj)]}
            >
              <TbArrowsDownUp size={20} color={'#7762AF'} />
            </IconButton>
          </DrawerInputContainer>

          {!destinationObj?.coords?.latitude && !originObj?.coords?.latitude && (
            <CurrentLocationContainer>
              <TransparentButton
                variant="text"
                onClick={() => handleSetCurrentLocation()}
                style={{ justifyContent: 'flex-start', borderBottom: '1px solid #e8e4f1' }}
              >
                <TransparentButtonContent>
                  <AiOutlineAim size={22} color={'#7762AF'} />
                  <TransparentButtontText>Localização atual</TransparentButtontText>
                </TransparentButtonContent>
              </TransparentButton>
            </CurrentLocationContainer>
          )}

          {showDetails && (
            <RoutesContainer>
              <TransparentButton
                variant="text"
                onClick={() => setShowDetails(false)}
                style={{ justifyContent: 'flex-start', borderBottom: '1px solid #e8e4f1' }}
              >
                <TransparentButtonContent>
                  <MdOutlineKeyboardBackspace size={22} color={'#7762AF'} />{' '}
                  <TransparentButtontText>Voltar</TransparentButtontText>
                </TransparentButtonContent>
              </TransparentButton>
            </RoutesContainer>
          )}

          {showDetails && (
            <DetailContainer>
              {directions.routes[selectedRoute].legs[0].steps.map((step: any) => (
                <Accordion key={Math.random() * 9999}>
                  <AccordionSummary
                    expandIcon={<MdOutlineExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>
                      {step.travel_mode === 'WALKING' ? (
                        <span>
                          <BiWalk size={16} key={Math.random() * 9999} style={{ marginRight: 3 }} />{' '}
                          Ande
                        </span>
                      ) : (
                        <span>
                          <BsFillBusFrontFill size={15} style={{ marginRight: 3 }} />
                          <BusNumberBadge
                            lineColor={step?.transit?.line?.color}
                            textColor={step?.transit?.line?.text_color}
                          >
                            {step?.transit.line.short_name}
                          </BusNumberBadge>
                        </span>
                      )}
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                      Cerca de {step.duration.text}, {step.distance.text}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {step.travel_mode === 'WALKING' &&
                        step?.steps.map((subStep: any) => (
                          <ListItem key={subStep.instructions || step.instructions}>
                            <ListItemText
                              secondary={
                                <span>
                                  <MdKeyboardDoubleArrowRight size={12} />
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: subStep.instructions
                                        ? subStep.instructions
                                        : step.instructions,
                                    }}
                                  ></span>
                                </span>
                              }
                            />
                          </ListItem>
                        ))}

                      {step.travel_mode === 'TRANSIT' && (
                        <ListItem key={step.instructions}>
                          <ListItemText
                            secondary={
                              <span>
                                <MdKeyboardDoubleArrowRight size={12} />
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: step.instructions,
                                  }}
                                ></span>
                              </span>
                            }
                          />
                        </ListItem>
                      )}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </DetailContainer>
          )}

          {!showDetails && directions && (
            <List className={classes.root}>
              {directions.routes.map((route, index) => (
                <ListItem
                  button
                  onClick={() => handleSelectRoute(index)}
                  alignItems="flex-start"
                  style={{
                    borderLeft: selectedRoute === index ? '6px solid #7762AF' : '',
                    borderBottom: '1px solid #E8E4F1',
                  }}
                  key={Math.random() * 9999}
                >
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <RouteCardHeader>
                          <span>
                            {route.legs[0]?.departure_time?.text} -{' '}
                            {route.legs[0]?.arrival_time?.text}
                          </span>
                          <span>{route.legs[0]?.duration?.text}</span>
                        </RouteCardHeader>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <RouteCardContent>
                          <RouteStepsResume>
                            {route.legs[0].steps.map((step, index) => {
                              if (step.travel_mode === 'WALKING') {
                                return (
                                  <div key={Math.random() * 9999}>
                                    <BiWalk size={16} />
                                    {index >= 0 && index + 1 < route.legs[0].steps.length ? (
                                      <RiArrowRightSLine size={16} />
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                );
                              }

                              if (step.travel_mode === 'TRANSIT') {
                                return (
                                  <div
                                    key={Math.random() * 9999}
                                    style={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    <BsFillBusFrontFill size={16} />
                                    <BusNumberBadge
                                      lineColor={step?.transit?.line?.color}
                                      textColor={step?.transit?.line?.text_color}
                                    >
                                      {step?.transit.line.short_name}
                                    </BusNumberBadge>
                                    {index >= 0 && index + 1 < route.legs[0].steps.length ? (
                                      <RiArrowRightSLine size={16} />
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                );
                              }
                            })}
                          </RouteStepsResume>
                          {selectedRoute === index && (
                            <>
                              <span>{route.legs[0].start_address}</span>

                              <RouteDetailBtn
                                onClick={() => {
                                  setShowDetails(true);
                                }}
                                style={{ justifyContent: 'flex-start' }}
                                variant="text"
                              >
                                Ver detalhes
                              </RouteDetailBtn>
                            </>
                          )}
                        </RouteCardContent>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}

              <Divider variant="inset" component="li" />
            </List>
          )}
        </DrawerContainer>
      )}

      <MapContainer>
        <DrawerBtn onClick={() => setOpenDrawer(!openDrawer)} href="#">
          {openDrawer ? (
            <MdOutlineArrowLeft size={18} key={Math.random() * 9999} />
          ) : (
            <MdOutlineArrowRight size={18} key={Math.random() * 9999} />
          )}
        </DrawerBtn>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {directions && (
            <DirectionsRenderer options={{ directions: directions, routeIndex: selectedRoute }} />
          )}
        </GoogleMap>
      </MapContainer>
    </Container>
  );
};

export default Map;
