import { useAuth0 } from '@auth0/auth0-react';
import { Paper } from '@material-ui/core';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { putData } from '../../database/db';

import styles from './LandingPage.module.scss';
import { CreateGratitudeForm, GratitudeFormValues } from './components/CreateGratitudeForm';
import { GratitudeWipDisplay } from './components/GratitudeWipDisplay';


export function LandingPage() {
    const [ wipGratitude, setWipGratitude ] = useState<GratitudeFormValues>();
    const [ isEditting, setIsEditting ] = useState(true);

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
            {isEditting ? (
                <CreateGratitudeForm
                    setWipGratitude={setWipGratitude}
                    setIsEditting={setIsEditting}
                    defaultValues={wipGratitude}
                />
            ) : (
                <GratitudeWipDisplay
                    wipGratitude={wipGratitude}
                    setIsEditting={setIsEditting}
                />
            )}
        </Paper>
    );
}
