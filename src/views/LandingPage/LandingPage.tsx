import { useAuth0 } from '@auth0/auth0-react';
import { Button, InputAdornment, TextField as MuiTextField } from '@material-ui/core';
import { ExpandMore, Search } from '@material-ui/icons';
import { useState } from 'react';
import {
    useForm, FormProvider
} from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import apiUtils from '../../api/ApiUtils';
import { TextField } from '../../components/form/TextField';
import { Gratitude } from '../../database/db';

import styles from './LandingPage.module.scss';
import { NavButtonGroup, SideNav } from './components/SideNav';


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

    const { isAuthenticated, loginWithRedirect } = useAuth0();

    const [ users, setUsers ] = useState<any>();

    // const fetchDataFormDynamoDb = () => {
    //     fetchData('Users');
    // };

    // const addDataToDynamoDB = async () => {
    //     const userData = {
    //         id: `${Math.random()}`
    //     };

    //     await putData('Users', userData);
    // };

    const handleSubmit = formMethods.handleSubmit(async formValues => {
        console.log(formValues);
        uuidv4();

        try {
            // const res = await fetch("https://dev-eks3f9sr.us.auth0.com/oauth/token", {
            //     "method": "POST",
            //     "headers": {
            //       "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({
            //         grant_type: 'client_credentials',
            //         client_id:"xQ2OLdoTEGL93sJBNGVbPJfY9vd4fqJg",client_secret:"1gPjfw_ljl-v4CHTAV1TZJRgW4p5INogFn6YePQqJ8Lb78ae7RG8N2sFDR1aKfMB",audience:"https://dev-eks3f9sr.us.auth0.com/api/v2/"
            //     })
            // });

            // console.log(res);

            // const json = await res.json();

            // // const token = await getAccessTokenSilently();
            // const token = json.access_token;
            // console.log(token);
            // console.log(json);

            // const users = await fetch("https://dev-eks3f9sr.us.auth0.com/api/v2/users", {
            //     "method": "GET",
            //     "headers": {
            //         "Authorization": "Bearer " + token
            //     }
            // });

            setUsers(await apiUtils.get('/users'));
            console.log(users);
        } catch (e) {
            console.log(e);
        }
    });

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
            </div>
        </div>
    );
}
