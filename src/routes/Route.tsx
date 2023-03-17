import React, { useEffect } from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
  Switch,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  title?: string;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  title,
  ...rest
}) => {
  const { user } = useAuth();
  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return !isPrivate || !!user ? (
          <Page title={title}>
            <Component />
          </Page>
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

interface RouteWithSubRoutesProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  title: string;
  subroutes: RouteProps[];
}

export const RouteWithSubRoutes: React.FC<RouteWithSubRoutesProps> = ({ subroutes, ...route }) => {
  const routesComponent: React.FC = () => (
    <Switch>
      {subroutes.map(props => (
        <Route {...props} />
      ))}
    </Switch>
  );

  return <Route {...route} component={routesComponent} />;
};

interface PageProps {
  title: string;
}
export const Page: React.FC<PageProps> = ({ title, children }) => {
  useEffect(() => {
    document.title = 'KIM' + (title ? ' | ' + title : '');
  }, [title]);

  return <>{children}</>;
};
export default Route;
