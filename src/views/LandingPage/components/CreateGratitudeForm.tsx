import {
    AvatarGroup, Tooltip, Badge, IconButton, Avatar, InputAdornment, Chip, TextField as MuiTextField, Button
} from '@material-ui/core';
import { RemoveCircleOutline, LocalOfferOutlined } from '@material-ui/icons';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import { TextField } from '../../../components/form/TextField';
import { UserMeta } from '../../../database/db';

import AsyncAutoComplete from './AsyncAutoComplete';
import styles from './CreateGratitudeForm.module.scss';


export interface GratitudeFormValues {
    users: UserMeta[];
    tags: { value: string }[];
    body: string;
}

interface CreateGratitudeFormProps {
    setWipGratitude: Dispatch<SetStateAction<GratitudeFormValues | undefined>>;
    setIsEditting: Dispatch<SetStateAction<boolean>>;
    defaultValues?: GratitudeFormValues;
}

export function CreateGratitudeForm({ setWipGratitude, setIsEditting, defaultValues }: CreateGratitudeFormProps) {
    const [ tagSearchValue, setTagSearchValue ] = useState('');
    const [ tagError, setTagError ] = useState(false);

    const formMethods = useForm<GratitudeFormValues>({ defaultValues });

    const { fields: userFields, append: userAppend, remove: userRemove } = useFieldArray<GratitudeFormValues, 'users'>({
        name: 'users',
        control: formMethods.control
    });

    const { fields: tagFields, append: tagAppend, remove: tagRemove } = useFieldArray<GratitudeFormValues, 'tags'>({
        name: 'tags',
        control: formMethods.control
    });

    const handleSubmit = formMethods.handleSubmit(formValues => {
        if (formValues.tags.length === 0) {
            setTagError(true);
        } else {
            setWipGratitude(formValues);
            setIsEditting(false);
        }
    });

    return (
        <form
            className={styles.form}
            id="appreciation-form"
            onSubmit={(event) => {
                if (tagFields.length === 0) {
                    setTagError(true);
                    event.preventDefault();
                } else {
                    handleSubmit(event);
                }
            }}
        >
            <FormProvider {...formMethods}>
                <AsyncAutoComplete userAppend={userAppend} />

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
                            event.preventDefault();

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

                <div>
                    {tagFields.map((tagField, index) => (
                        <Chip
                            key={tagField.id}
                            label={tagField.value}
                            onDelete={() => tagRemove(index)}
                        />
                    ))}
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
                onClick={handleSubmit}
            >
                Generate
            </Button>
        </form>
    );
}
