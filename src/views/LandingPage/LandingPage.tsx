import { useAuth0 } from '@auth0/auth0-react';
import { Button, InputAdornment, TextField as MuiTextField } from '@material-ui/core';
import { ExpandMore, Search } from '@material-ui/icons';
import { useCallback, useEffect, useState } from 'react';
import {
    useForm, FormProvider
} from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import apiUtils from '../../api/ApiUtils';
import { TextField } from '../../components/form/TextField';
import { fetchData, Gratitude, putData } from '../../database/db';

import styles from './LandingPage.module.scss';
import { NavButtonGroup, SideNav } from './components/SideNav';
import useAsyncEffect from '../../utils/useAsyncEffect';


const navButtonGroups: NavButtonGroup[] = [
    {
        title: 'Actions',
        navButtons: [
            {
                name: 'Login',
                to: '/login',
                icon: ExpandMore
            },
            {
                name: 'My account',
                to: '/account',
                icon: ExpandMore
            },
            {
                name: 'Feed',
                to: '/feed',
                icon: ExpandMore
            }
        ]
    },
    {
        title: 'Links',
        navButtons: [
            {
                name: 'Research',
                to: '/research',
                icon: ExpandMore
            },
            {
                name: 'More info',
                to: '/info',
                icon: ExpandMore
            },
            {
                name: 'Contact',
                to: '/contact',
                icon: ExpandMore
            }
        ]
    }
];

type GratitudeFormValues = Omit<Gratitude, 'id'>;


export function LandingPage() {
    const formMethods = useForm<GratitudeFormValues>();

    const { isAuthenticated, loginWithRedirect, user, getAccessTokenSilently } = useAuth0();

    console.log(user);
    if (user?.['http://localhost:3000/user_metadata']?.isNew) {
        putData('Users', {
            ...user,
            id: user?.['http://localhost:3000/user_id'] || uuidv4()
        });
    }

    const [ users, setUsers ] = useState<any>();

    const handleSubmit = formMethods.handleSubmit(async formValues => {
        console.log(formValues);

        try {
            setUsers(await apiUtils.get('/users'));
        } catch (e) {
            console.log(e);
        }
    });

    // useAsyncEffect(useCallback(async () => {
    //     users && console.log(users);

    //     const token = await getAccessTokenSilently();

    //     const res = await fetch('https://dev-eks3f9sr.us.auth0.com/userinfo', {
    //         method: 'GET',
    //         headers: {
    //             Authorization: 'Bearer ' + (await getAccessTokenSilently())
    //         }
    //     });

    //     // console.log(res.body.json());
    //     console.log(res.json());

    //     setUserInfo(res);
    // }, [ users ]));

    return (
        <div className={styles.root}>
            <SideNav navButtonGroups={navButtonGroups} />

            <div className={styles.content}>
                <div className={styles.topNav}>
                    <MuiTextField
                        variant="standard"
                        placeholder="Search"
                        helperText="Who are you grateful for?"
                        onChange={e => {}}
                        FormHelperTextProps={{
                            className: styles.searchHelperText
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>

                {isAuthenticated ? (
                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >
                        <FormProvider {...formMethods}>
                            <TextField<GratitudeFormValues>
                                name="to"
                                label="To"
                                required
                                hideRequiredIndicator
                            />

                            <TextField<GratitudeFormValues>
                                name="body"
                                label="Body"
                                required
                                hideRequiredIndicator
                            />
                        </FormProvider>

                        <Button
                            variant="contained"
                            type="submit"
                        >
                            Save
                        </Button>
                    </form>
                ) : (
                    <p>
                        please

                        <Button
                            onClick={() => loginWithRedirect()}
                            variant="outlined"
                        >
                            login
                        </Button>

                        to write a thank you.
                    </p>
                )}

                <Button onClick={async () => {
                    console.log(await fetchData('Users'));
                }}>
                    Fetch data
                </Button>
            </div>
        </div>
    );
}
