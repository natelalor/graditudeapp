import { useAuth0 } from '@auth0/auth0-react';
import { BungalowOutlined, FaceOutlined, VolunteerActivismOutlined } from '@material-ui/icons';
import {
    createContext, useMemo, useCallback, useState, Dispatch, SetStateAction
} from 'react';
import { Route, Switch } from 'react-router-dom';

import styles from './App.module.scss';
import api from './api';
import SearchBar from './components/SearchBar/SearchBar';
import { User } from './database/db';
import useAsyncEffect from './utils/useAsyncEffect';
import { AccountPage } from './views/AccountPage/AccountPage';
import { EditUserPage } from './views/EditUserPage/EditUserPage';
import { FeedPage } from './views/FeedPage/FeedPage';
import { LandingPage } from './views/LandingPage/LandingPage';
import { NavButtonGroup, SideNav } from './views/LandingPage/components/SideNav';
import { LoginPage } from './views/LoginPage/LoginPage';
import { SearchPage } from './views/SeachPage/SearchPage';


interface UserContextValue {
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User | undefined>>
}

export const UserContext = createContext<UserContextValue>({
    user: undefined,
    setUser: () => {}
});

export default function App() {
    const { isAuthenticated, user: auth0User } = useAuth0();

    const [ user, setUser ] = useState<User>();

    const UserContextValue = useMemo(() => ({
        user,
        setUser
    }), [ user, setUser ]);

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

    useAsyncEffect(useCallback(async () => {
        try {
            setUser(await api.users.getUserById(auth0User?.['http://localhost:3000/user_id']));
        } catch (error) {
            console.log(error);
        }
    }, [ auth0User ]));

    return (
        <UserContext.Provider value={UserContextValue}>
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
                            exact
                            path="/account/:accountId/edit"
                            component={isAuthenticated ? EditUserPage : LoginPage}
                            // TODO abstract isAuthenticated functionality
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
        </UserContext.Provider>
    );
}
