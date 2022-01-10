import {
    Autocomplete, TextField, CircularProgress, InputAdornment, Avatar
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import clsx from 'clsx';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { query, User } from '../../database/db';

import styles from './SearchBar.module.scss';


export default function SearchBar() {
    const [ users, setUsers ] = useState<Partial<User>[]>([]);
    const [ value ] = useState<Partial<User>>({});
    const [ loading, setLoading ] = useState(false);
    const [ inputValue, setInputValue ] = useState('');
    const history = useHistory();

    return (
        <Autocomplete
            value={value}
            inputValue={inputValue}
            getOptionLabel={(option) => option.name || ''}
            options={users}
            loading={loading}
            open={!!inputValue}
            onChange={(event, newValue) => {
                if (newValue && typeof newValue !== 'string') {
                    setInputValue('');

                    history.push(`/account/${newValue.id}`);

                    // newValue is of type User
                    // do something with the selected value
                }
            }}
            onKeyDown={event => {
                if ((event.code === 'Enter') && inputValue) {
                    event.preventDefault();
                    history.push({
                        pathname: '/search',
                        state: {
                            tags: [ inputValue ]
                        }
                    });
                }
            }}
            freeSolo
            renderOption={(props, option) => (
                <li
                    {...props}
                    key={option.id}
                    className={clsx(props.className, styles.usersSearchBox)}
                >
                    <Avatar
                        alt={option.name}
                        src={option.picture}
                    />

                    {option.name}
                </li>
            )}
            onInputChange={async (event, newInputValue) => {
                setInputValue(newInputValue);
                setLoading(true);

                setUsers(await query('Users', newInputValue) as User[]);

                setLoading(false);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    placeholder="Search"
                    helperText="Who are you grateful for?"
                    FormHelperTextProps={{
                        className: styles.searchHelperText
                    }}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <>
                                {loading ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={20}
                                    />
                                ) : null}

                                {params.InputProps.endAdornment}
                            </>
                        )
                    }}
                />
            )}
        />
    );
}
