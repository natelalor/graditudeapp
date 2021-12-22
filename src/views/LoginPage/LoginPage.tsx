import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

import styles from './LoginPage.module.scss';


export function LoginPage() {
    return (
        <div className={styles.root}>
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
