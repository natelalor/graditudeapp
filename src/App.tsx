import { BungalowOutlined, FaceOutlined, VolunteerActivismOutlined } from '@material-ui/icons';
import { Route, Switch } from 'react-router-dom';

import styles from './App.module.scss';
import { FeedPage } from './views/FeedPage/FeedPage';
import { LandingPage } from './views/LandingPage/LandingPage';
import { NavButtonGroup, SideNav } from './views/LandingPage/components/SideNav';
import { LoginPage } from './views/LoginPage/LoginPage';


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
                to: '/login',
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

export default function App() {
    return (
        <div className={styles.root}>
            <SideNav navButtonGroups={navButtonGroups} />

            <div className={styles.content}>
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
                        exact
                        path="/feed"
                        component={FeedPage}
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
