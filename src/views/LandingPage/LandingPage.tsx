import { useAuth0 } from '@auth0/auth0-react';
import { Paper } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { putData } from '../../database/db';

import styles from './LandingPage.module.scss';
import { AddEditGratitudeForm } from './components/AddEditGratitudeForm';


export function LandingPage() {
    const history = useHistory();
    const { user } = useAuth0();

    if (user?.['http://localhost:3000/user_metadata']?.isNew) {
        putData('Users', {
            ...user,
            lowercaseName: user.name?.toLowerCase(),
            lowercaseEmail: user.email?.toLowerCase(),
            id: user?.['http://localhost:3000/user_id'] || uuidv4()
        });
    }

    return (
        <Paper
            className={styles.paper}
            elevation={14}
        >
            <AddEditGratitudeForm
                onDone={() => history.push('/account')}
            />
        </Paper>
    );
}
