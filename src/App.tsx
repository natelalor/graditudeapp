import { useAuth0 } from '@auth0/auth0-react';
import { BungalowOutlined, FaceOutlined, VolunteerActivismOutlined } from '@material-ui/icons';
import { Route, Switch } from 'react-router-dom';

import styles from './App.module.scss';
import SearchBar from './components/SearchBar/SearchBar';
import { AccountPage } from './views/AccountPage/AccountPage';
import { FeedPage } from './views/FeedPage/FeedPage';
import { LandingPage } from './views/LandingPage/LandingPage';
import { NavButtonGroup, SideNav } from './views/LandingPage/components/SideNav';
import { LoginPage } from './views/LoginPage/LoginPage';
import { SearchPage } from './views/SeachPage/SearchPage';


export default function App() {
    const { isAuthenticated, user } = useAuth0();

    const navButtonGroups: NavButtonGroup[] = [
        {
            title: 'Actions',
            navButtons: [
                {
                    name: 'Feed',
                    to: '/feed',
                    icon: BungalowOutlined
                },
                {
                    name: 'My account',
                    to: user?.['http://localhost:3000/user_id'] ? `/account/${user['http://localhost:3000/user_id']}` : '/login',
                    icon: FaceOutlined
                },
                {
                    name: 'Appreciate',
                    to: '/appreciate',
                    icon: VolunteerActivismOutlined
                }
            ]
        }
    ];

    return (
        <div className={styles.root}>
            <SideNav navButtonGroups={navButtonGroups} />

            <div className={styles.content}>
                <SearchBar />

                <Switch>
                    <Route
                        exact
                        path="/appreciate"
                        component={LandingPage}
                    />

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

                    <Route
                        // exact
                        path="/account/:accountId"
                        component={isAuthenticated ? AccountPage : LoginPage}
                    />

                    <Route
                        exact
                        path="/feed"
                        component={FeedPage}
                    />

                    <Route
                        // exact
                        path="/search"
                        component={SearchPage}
                    />

                    {/* <Route
                        path="*"
                        component={AuthenticatedRouteSwitch}
                    /> */}
                </Switch>
            </div>
        </div>
    );
}
