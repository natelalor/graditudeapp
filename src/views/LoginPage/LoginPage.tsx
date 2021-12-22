import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

import styles from './LoginPage.module.scss';


export function LoginPage() {
    const { loginWithRedirect } = useAuth0();
    const { logout } = useAuth0();
    const { isAuthenticated } = useAuth0();

    const { user } = useAuth0();

    return (
        <div className={styles.root}>
            User is {isAuthenticated ? '' : 'not'} authenticated.

            <br />

            <img
                src={user?.picture}
                alt="alt"
            /><br />

            {`name: ${user?.name}`}<br />

            {`email: ${user?.email}`}

            <Button
                onClick={() => loginWithRedirect()}
                variant="contained"
            >
                Login
            </Button>

            <Button
                onClick={() => loginWithRedirect({
                      screen_hint: 'signup', // eslint-disable-line
                })}
                variant="contained"
            >
                Sign up
            </Button>

            <Button
                onClick={() => logout({
                    returnTo: window.location.origin
                })}
                variant="contained"
            >
                Log out
            </Button>

            <Button
                component={Link}
                to="/"
                variant="contained"
            >
                Back
            </Button>
        </div>
    );
}
