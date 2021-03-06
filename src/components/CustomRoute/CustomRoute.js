import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import RedirectNotAdmin from '../RedirectNotAdmin/RedirectNotAdmin';
import { useSource } from '../../hooks/useSource';
import RedirectNoId from '../RedirectNoId/RedirectNoId';

const CustomRouteInternal = ({ route, children }) => {
    const source = route.redirectNoId ? useSource() : undefined;

    if (!source && route.redirectNoId) {
        return <RedirectNoId />;
    }

    return (
        <React.Fragment>
            {route.writeAccess && <RedirectNotAdmin />}
            {children}
        </React.Fragment>
    );
};

CustomRouteInternal.propTypes = {
    route: PropTypes.shape({
        path: PropTypes.string.isRequired,
        redirectNoId: PropTypes.bool,
        writeAccess: PropTypes.bool
    }).isRequired,
    children: PropTypes.node.isRequired
};

const CustomRoute = ({ route, componentProps, Component, ...props }) =>  (
    <Route {...props} path={route.path}>
        <CustomRouteInternal route={route}>
            <Component  {...componentProps}/>
        </CustomRouteInternal>
    </Route>
);

CustomRoute.propTypes = {
    route: PropTypes.shape({
        path: PropTypes.string.isRequired,
        redirectNoId: PropTypes.bool,
        writeAccess: PropTypes.bool
    }).isRequired,
    componentProps: PropTypes.any,
    Component: PropTypes.func.isRequired
};

export default CustomRoute;
