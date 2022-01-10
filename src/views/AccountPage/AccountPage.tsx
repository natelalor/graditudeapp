import {
    Avatar, ToggleButton, ToggleButtonGroup, Tooltip, Typography
} from '@material-ui/core';
import { PaletteOutlined, PeopleOutlineOutlined } from '@material-ui/icons';
import { useState, useCallback, FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { Route, useParams } from 'react-router-dom';

import api from '../../api';
import Gallery from '../../components/Gallery/Gallery';
import { RoutedDialogProps } from '../../components/RoutedDialog/RoutedDialog';
import { doCustomQuery, Gratitude, User } from '../../database/db';
import useAsyncEffect from '../../utils/useAsyncEffect';

import styles from './AccountPage.module.scss';
import { GratitudeDialog } from './components/GratitudeDialog';


export interface AccountPageParams {
    accountId: string;
    gratitudeId: string | undefined;
}


export function AccountPage({ match, history }: RouteComponentProps<AccountPageParams>) {
    const { accountId } = useParams<AccountPageParams>();
    const [ user, setUser ] = useState<User>();
    const [ sentGratitudes, setSentGratitudes ] = useState<Gratitude[]>([]);
    const [ receivedGratitudes, setReceivedGratitudes ] = useState<Gratitude[]>([]);
    const [ displayTab, setDisplayTab ] = useState<'sent' | 'received'>('received');

    const handleDisplayChange = (event: any, newValue: 'sent' | 'received') => {
        setDisplayTab(newValue);
    };

    useAsyncEffect(useCallback(async () => {
        const userFromDb = await api.users.getUserById(accountId);
        setUser(userFromDb);

        if (accountId && userFromDb) {
            setSentGratitudes(await doCustomQuery('Gratitude', [
                {
                    propertyName: 'from',
                    propertyValue: accountId
                }
            ]) as Gratitude[]);

            setReceivedGratitudes(await doCustomQuery('Gratitude', [
                {
                    propertyName: 'users',
                    propertyValue: JSON.stringify({
                        userId: accountId,
                        name: userFromDb.name,
                        picture: userFromDb.picture
                    })
                }
            ]) as Gratitude[]);
        }
    }, [ accountId ]));

    return (
        <div className={styles.root}>
            <div
                style={{
                    backgroundColor: 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
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

            <Gallery gratitudes={displayTab === 'received' ? receivedGratitudes : sentGratitudes} />

            {Object.entries(dialogRoutes).map(([ path, DialogComponent ]) => (
                <Route
                    key={path}
                    path={`${match.path}/${path}`}
                    children={({ history, location, match: dialogMatch }) => (
                        <DialogComponent
                            closeTo={match.url}
                            history={history}
                            location={location}
                            match={dialogMatch as RoutedDialogProps['match']}
                        />
                    )}
                />
            ))}
        </div>
    );
}

type DialogRoutes = {
    [path: string]: FC<Omit<RoutedDialogProps, 'title' | 'children'>>;
};

const dialogRoutes: DialogRoutes = {
    ':gratitudeId': GratitudeDialog
};
