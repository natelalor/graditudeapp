import { useAuth0 } from '@auth0/auth0-react';
import {
    Button, IconButton, InputAdornment, TextField as MuiTextField, Tooltip
} from '@material-ui/core';
import {
    AddCircleOutline, ExpandMore, RemoveCircleOutline, Search
} from '@material-ui/icons';
import { useState } from 'react';
import {
    useForm, FormProvider, useFieldArray
} from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import apiUtils from '../../api/ApiUtils';
import { TextField } from '../../components/form/TextField';
import { fetchData, putData, query } from '../../database/db';

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

// type GratitudeFormValues = Omit<Gratitude, 'id'>;

interface GratitudeFormValues {
    userIds: {value: string}[];
    from: string;
    body: string;
}

export function LandingPage() {
    const formMethods = useForm<GratitudeFormValues>();

    const { fields, append, remove } = useFieldArray<GratitudeFormValues>({
        name: 'userIds',
        control: formMethods.control
    });

    const { isAuthenticated, loginWithRedirect, user } = useAuth0();

    if (user?.['http://localhost:3000/user_metadata']?.isNew) {
        putData('Users', {
            ...user,
            lowercaseName: user.name?.toLowerCase(),
            lowercaseEmail: user.email?.toLowerCase(),
            id: user?.['http://localhost:3000/user_id'] || uuidv4()
        });
    }

    const [ users, setUsers ] = useState<any>();

    console.log(users);

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
                            <div className={styles.dbaContainer}>
                                {fields.map((field, index) => (
                                    <div
                                        className={styles.dbaRow}
                                        key={field.id}
                                    >
                                        {/* <TextField
                                            name={`dbaNames.${index}.value`}
                                            label="User"
                                            size="small"
                                            required
                                            hideRequiredIndicator
                                        /> */}

                                        <MuiTextField
                                            onChange={async (event) => {
                                                // event.target.value
                                                const res = await query('Users', event.target.value);
                                                console.log(res);
                                                setUsers(setUsers(res));
                                            }}
                                        />

                                        <div className={styles.dbaButtons}>
                                            {fields.length > 1 && (
                                                <Tooltip title="Remove tag">
                                                    <IconButton
                                                        onClick={() => {
                                                            remove(index);
                                                        }}
                                                    >
                                                        <RemoveCircleOutline color="error" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {index === fields.length - 1 && (
                                                <Tooltip title="Tag additional user">
                                                    <IconButton
                                                        onClick={() => {
                                                            append({ value: '' });
                                                        }}
                                                    >
                                                        <AddCircleOutline color="secondary" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {fields.length === 0 && (
                                    <Tooltip title="Tag a user">
                                        <IconButton
                                            onClick={() => {
                                                append({ value: '' });
                                            }}
                                        >
                                            <AddCircleOutline color="secondary" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>


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

                <Button
                    onClick={async () => {
                        console.log(await fetchData('Users'));
                    }}
                >
                    Fetch data
                </Button>
            </div>
        </div>
    );
}
