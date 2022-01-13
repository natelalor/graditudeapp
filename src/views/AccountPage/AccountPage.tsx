import { useAuth0 } from '@auth0/auth0-react';
import {
    Avatar, Button, Popper, ToggleButton, ToggleButtonGroup, Tooltip, Typography
} from '@material-ui/core';
import { PaletteOutlined, PeopleOutlineOutlined, PersonOutline } from '@material-ui/icons';
import Hamburger from 'hamburger-react';
import {
    useState, useCallback, FC, useRef, useContext
} from 'react';
import { RouteComponentProps } from 'react-router';
import { Route, useParams } from 'react-router-dom';

import { UserContext } from '../../App';
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
    const { user: loggedInUser } = useContext(UserContext);
    const [ sentGratitudes, setSentGratitudes ] = useState<Gratitude[]>([]);
    const [ receivedGratitudes, setReceivedGratitudes ] = useState<Gratitude[]>([]);
    const [ displayTab, setDisplayTab ] = useState<'sent' | 'received'>('received');
    const [ open, setOpen ] = useState(false);

    const ref = useRef(null);

    const isCurrentUsersPage = loggedInUser?.id === accountId;

    const { logout } = useAuth0();

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
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}
            >
                <Hamburger onToggle={toggled => setOpen(toggled)} />

                <div ref={ref} />

                <Popper // todo this might be laggy
                    open={open}
                    anchorEl={ref.current}
                    placement="bottom-end"
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}
                    >
                        <Button
                            onClick={() => history.push(`${history.location.pathname}/edit`)}
                            variant="contained"
                        >
                            <PersonOutline />

                            Edit user
                        </Button>

                        <Button
                            onClick={() => logout({
                                returnTo: window.location.origin
                            })}
                            variant="contained"
                        >
                            Log out
                        </Button>
                    </div>
                </Popper>
            </div>

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

                <Typography variant="h4">
                    {user?.name}
                </Typography>

                {isCurrentUsersPage && !user?.bio && (
                    <Typography>
                        Edit your profile to add a bio
                    </Typography>
                )}

                {user?.bio && (
                    <Typography>
                        {user.bio}
                    </Typography>
                )}
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
