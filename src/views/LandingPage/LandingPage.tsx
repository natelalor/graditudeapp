/* eslint camelcase: "off" */
import { useAuth0 } from '@auth0/auth0-react';
import {
    Avatar,
    AvatarGroup,
    Badge,
    Button, Chip, IconButton, InputAdornment, TextField as MuiTextField, Tooltip
} from '@material-ui/core';
import { RemoveCircleOutline, LocalOfferOutlined } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import {
    useForm, FormProvider, useFieldArray
} from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import wombot from 'wombot';

import { TextField } from '../../components/form/TextField';
import { putData } from '../../database/db';

import styles from './LandingPage.module.scss';
import AsyncAutoComplete from './components/AsyncAutoComplete';


interface GratitudeFormValues {
    userIds: {value: string, name: string, picture: string}[];
    tags: {value: string}[];
    from: string;
    body: string;
}

export function LandingPage() {
    const formMethods = useForm<GratitudeFormValues>();

    const { fields: userFields, append: userAppend, remove: userRemove } = useFieldArray<GratitudeFormValues, 'userIds'>({
        name: 'userIds',
        control: formMethods.control
    });

    const { fields: tagFields, append: tagAppend, remove: tagRemove } = useFieldArray<GratitudeFormValues, 'tags'>({
        name: 'tags',
        control: formMethods.control
    });

    const { user } = useAuth0();

    if (user?.['http://localhost:3000/user_metadata']?.isNew) {
        putData('Users', {
            ...user,
            lowercaseName: user.name?.toLowerCase(),
            lowercaseEmail: user.email?.toLowerCase(),
            id: user?.['http://localhost:3000/user_id'] || uuidv4()
        });
    }

    const [ tagSearchValue, setTagSearchValue ] = useState('');
    const [ imgSrc, setImgSrc ] = useState('');
    const [ tagError, setTagError ] = useState(false);

    const handleSubmit = formMethods.handleSubmit(async formValues => {
        const generationPrompt = formValues.tags.reduce((prev, curr) => `${prev} ${curr.value}`, '');

        try {
            const res = await wombot(generationPrompt, 10, (data: any) => {
                // Callback for intermediary results, useful for debugging
                console.log(data);
                if (data && data.task?.photo_url_list) {
                    const photoUrlList = data.task.photo_url_list;
                    setImgSrc(photoUrlList[photoUrlList.length - 1]);
                }
            }, {
                final: true, // Download the final image
                inter: false, // Download the intermediary results,
                download_dir: './generated/', // Where to download images
                identify_key: 'AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw' // Available (as of writing this) by looking at the requests made on the website
            });

            console.log(res);
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        console.log(`imgSrc change to ${imgSrc}`);
    }, [ imgSrc ]);

    return (
        <div className={styles.root}>
            <form
                className={styles.form}
                onSubmit={(e) => {
                    if (tagFields.length === 0) {
                        setTagError(true);
                        e.preventDefault();
                    } else {
                        handleSubmit(e);
                    }
                }}
            >
                <FormProvider {...formMethods}>
                    <AsyncAutoComplete userAppend={userAppend} />

                    <MuiTextField
                        variant="standard"
                        placeholder="Tags"
                        FormHelperTextProps={tagError ? undefined : {
                            className: styles.searchHelperText
                        }}
                        value={tagSearchValue}
                        onChange={(event) => {
                            setTagSearchValue(event.target.value);
                        }}
                        onKeyDown={event => {
                            if ((event.code === 'Enter' || event.code === 'Space') && tagSearchValue) {
                                tagAppend({ value: tagSearchValue });
                                setTagError(false);
                                setTagSearchValue('');
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocalOfferOutlined />
                                </InputAdornment>
                            )
                        }}
                        error={tagError}
                        helperText={tagError ? 'Please add at least one tag to generate the image' : 'What are you grateful for?'}
                    />

                    <div className={styles.todo}>
                        <AvatarGroup
                            max={4}
                            className={styles.avatars}
                        >
                            {userFields.map((field, index) => (
                                <Tooltip
                                    title={field.name}
                                    key={field.id}
                                >
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
                        multiline
                    />
                </FormProvider>

                <Button
                    variant="contained"
                    type="submit"
                >
                    Save
                </Button>
            </form>

            {imgSrc && (
                <img
                    src={imgSrc}
                    alt="todo"
                    className={styles.image}
                />
            )}
        </div>
    );
}
