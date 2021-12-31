import { useAuth0 } from '@auth0/auth0-react';
import {
    Avatar,
    AvatarGroup,
    Badge,
    Button, Chip, IconButton, InputAdornment, TextField as MuiTextField, Tooltip
} from '@material-ui/core';
import {
    ExpandMore, RemoveCircleOutline, Search, BungalowOutlined, FaceOutlined, VolunteerActivismOutlined
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




interface GratitudeFormValues {
    userIds: {value: string, name: string, picture: string}[];
    tags: {value: string}[];
    from: string;
    body: string;
}

interface User {
    lowercaseEmail: string;
    locale: string;
    given_name: string; // eslint-disable-line
    family_name: string; // eslint-disable-line
    'http://localhost:3000/user_id': string;
    picture: string;
    email: string;
    name: string;
    email_verified: boolean, // eslint-disable-line
    updated_at: string; // eslint-disable-line
    'http://localhost:3000/user_metadata': {
        isNew: boolean;
    };
    lowercaseName: string;
    nickname: string;
    id: string;
    sub: string;
}

export function LandingPage() {
    const formMethods = useForm<GratitudeFormValues>();

    const { fields: userFields, append: userAppend, remove: userRemove } = useFieldArray<GratitudeFormValues, "userIds">({
        name: 'userIds',
        control: formMethods.control
    });
    
    const { fields: tagFields, append: tagAppend, remove: tagRemove } = useFieldArray<GratitudeFormValues, "tags">({
        name: 'tags',
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

    const [ users, setUsers ] = useState<User[]>([]);
    const [ showUsers, setShowUsers ] = useState(false);
    const [ userSearchValue, setUserSearchValue ] = useState('');
    const [ tagSearchValue, setTagSearchValue ] = useState('');


    console.log(users);

    const handleSubmit = formMethods.handleSubmit(async formValues => {
        console.log(formValues);

        try {
            setUsers(await apiUtils.get('/users'));
        } catch (e) {
            console.log(e);
        }
    });

    return (
        <div className={styles.root}>
            {/* <div className={styles.content}> */}
                <div className={styles.topNav}>
                    <MuiTextField
                        variant="standard"
                        placeholder="Search"
                        helperText="Who are you grateful for?"
                        value={userSearchValue}
                        onChange={async (event) => {
                            setUserSearchValue(event.target.value);
                            setUsers(await query('Users', event.target.value) as User[]);
                        }}
                        onFocus={() => setShowUsers(true)}
                        onBlur={() => {
                            setTimeout(() => setShowUsers(false), 150); // 150ms delay to allow for click. todo fix
                        }}
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

                {showUsers && users.map(user => (
                    <div
                        key={user.id}
                        className={styles.usersSearchBox}
                        onClick={() => {
                            // if (users.filter())
                            userAppend({
                                value: user.id,
                                name: user.name,
                                picture: user.picture
                            });

                            setUserSearchValue('');
                            setUsers([]);
                        }}
                    >
                        <Avatar
                            alt={user.name}
                            src={user.picture}
                        />

                        {user.name}
                    </div>
                ))}

                <MuiTextField
                    variant="standard"
                    placeholder="Tags"
                    helperText="What are you grateful for?"
                    value={tagSearchValue}
                    onChange={(event) => {
                        setTagSearchValue(event.target.value);
                    }}
                    onKeyDown={event => {
                        if (event.code === 'Enter' || event.code === 'Space') {
                            tagAppend({ value: tagSearchValue });
                            setTagSearchValue('');
                        }
                    }}
                />

                {isAuthenticated ? (
                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >
                        <FormProvider {...formMethods}>
                            <div className={styles.todo}>
                                <AvatarGroup
                                    max={4}
                                    className={styles.avatars}
                                >
                                    {userFields.map((field, index) => (
                                        <Tooltip title={field.name} key={field.id}>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right'
                                                }}
                                                badgeContent={(
                                                    <div className={styles.delButton}>
                                                        <IconButton
                                                            onClick={() => {
                                                                userRemove(index);
                                                            }}
                                                            size="small"
                                                        >
                                                            <RemoveCircleOutline color="error" />
                                                        </IconButton>
                                                    </div>
                                                )}
                                            >
                                                <Avatar
                                                    alt={field.name}
                                                    src={field.picture}
                                                    className={styles.avatar}
                                                />
                                            </Badge>
                                        </Tooltip>
                                    ))}
                                </AvatarGroup>

                                <div>
                                    {tagFields.map((tagField, index) => (
                                        <Chip
                                            key={tagField.id}
                                            label={tagField.value}
                                            onDelete={() => tagRemove(index)}
                                        />
                                    ))}
                                </div>
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
            {/* </div> */}
        </div>
    );
}
