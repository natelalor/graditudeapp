import { useAuth0 } from '@auth0/auth0-react';
import { Paper } from '@material-ui/core';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Gratitude, putData } from '../../database/db';

import styles from './LandingPage.module.scss';
import { CreateGratitudeForm } from './components/CreateGratitudeForm';
import { GratitudeDisplay } from './components/GratitudeDisplay';


export type PartialGratitude = Partial<Gratitude> & {
    tags: string[];
    users: string[];
    from: string;
    body: string;
};


export function LandingPage() {
    const [ gratitude, setGratitude ] = useState<PartialGratitude>();
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
                    setGratitude={setGratitude}
                    setIsEditting={setIsEditting}
                    defaultValues={gratitude}
                />
            ) : (
                <GratitudeDisplay
                    gratitude={gratitude}
                    setIsEditting={setIsEditting}
                />
            )}
        </Paper>
    );
}
