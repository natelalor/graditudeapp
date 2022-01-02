import { useAuth0 } from '@auth0/auth0-react';
import {
    Avatar, ImageList, ImageListItem, Paper, ToggleButton, ToggleButtonGroup, Tooltip, Typography
} from '@material-ui/core';
import { PaletteOutlined, PeopleOutlineOutlined } from '@material-ui/icons';
import { useState, useCallback } from 'react';

import { doCustomQuery, Gratitude } from '../../database/db';
import useAsyncEffect from '../../utils/useAsyncEffect';

import styles from './AccountPage.module.scss';


export function AccountPage() {
    const { user } = useAuth0();
    const [ sentGratitudes, setSentGratitudes ] = useState<Gratitude[]>([]);
    const [ receivedGratitudes, setReceivedGratitudes ] = useState<Gratitude[]>([]);
    const [ displayTab, setDisplayTab ] = useState<'sent' | 'received'>('received');

    const handleDisplayChange = (event: any, newValue: 'sent' | 'received') => {
        setDisplayTab(newValue);
    };


    useAsyncEffect(useCallback(async () => {
        const userId = user?.['http://localhost:3000/user_id'];
        if (userId) {
            setSentGratitudes(await doCustomQuery('Gratitude', [
                {
                    propertyName: 'from',
                    propertyValue: userId
                }
            ]) as Gratitude[]);

            setReceivedGratitudes(await doCustomQuery('Gratitude', [
                {
                    propertyName: 'users',
                    propertyValue: JSON.stringify({
                        userId,
                        name: user.name,
                        picture: user.picture
                    })
                }
            ]) as Gratitude[]);
        }
    }, [ user ]));

    console.log({
        sentGratitudes,
        receivedGratitudes
    });

    return (
        <Paper
            className={styles.paper}
            elevation={14}
        >
            <div
                style={{
                    display: 'flex',
                    padding: '16px',
                    width: '100%'
                }}
            >
                <Avatar
                    src={user?.picture}
                    alt="todo"
                    className={styles.avatar}
                />

                <div>
                    <Typography>
                        {user?.name}
                    </Typography>

                    <Typography>
                        {user?.email}
                    </Typography>

                    <Typography>
                        last updated at {user?.updated_at}
                    </Typography>
                </div>
            </div>

            <ToggleButtonGroup
                value={displayTab}
                exclusive
                onChange={handleDisplayChange}
                aria-label="text alignment"
            >
                <ToggleButton
                    value="received"
                    aria-label="My collection"
                >
                    <Tooltip title="Gratitude recieved">
                        <PaletteOutlined />
                    </Tooltip>
                </ToggleButton>

                <ToggleButton
                    value="sent"
                    aria-label="Gratitude"
                >
                    <Tooltip title="Gratitude sent">
                        <PeopleOutlineOutlined />
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>

            <ImageList
                sx={{ width: '100%' }}
                cols={3}
            >
                {(displayTab === 'received' ? receivedGratitudes : sentGratitudes).map(gratitude => (
                    <ImageListItem key={gratitude.id}>
                        <img
                            src={gratitude.imageUrl}
                            alt={gratitude.body}
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Paper>
    );
}
