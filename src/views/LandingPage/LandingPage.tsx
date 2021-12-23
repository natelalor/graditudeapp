import { useAuth0 } from '@auth0/auth0-react';
import { Button, InputAdornment, TextField as MuiTextField } from '@material-ui/core';
import { ExpandMore, Search } from '@material-ui/icons';
import {
    useForm, FormProvider
} from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

// import { fetchData, Gratitude, putData } from '../../database/db';
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

    // const fetchDataFormDynamoDb = () => {
    //     fetchData('Users');
    // };

    // const addDataToDynamoDB = async () => {
    //     const userData = {
    //         id: `${Math.random()}`
    //     };

    //     await putData('Users', userData);
    // };

    const handleSubmit = formMethods.handleSubmit(formValues => {
        console.log(formValues);
        uuidv4();
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
                        id="gratitude-form"
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

                <Button
                    form="gratitude-form"
                    variant="contained"
                    type="submit"
                >
                    Save
                </Button>
            </div>
        </div>
    );
}
