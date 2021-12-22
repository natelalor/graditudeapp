import { Route, Switch } from 'react-router-dom';

import { LandingPage } from './views/LandingPage/LandingPage';
import { LoginPage } from './views/LoginPage/LoginPage';


export default function App() {
    return (
        <Switch>
            <Route
                exact
                path="/"
                component={LandingPage}
            />

            <Route
                exact
                path="/login"
                component={LoginPage}
            />

            {/* <Route
                path="*"
                component={AuthenticatedRouteSwitch}
            /> */}
        </Switch>
    );
}
