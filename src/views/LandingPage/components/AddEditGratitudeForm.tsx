import { useAuth0 } from '@auth0/auth0-react';
import {
    AvatarGroup,
    Tooltip,
    Badge,
    IconButton,
    Avatar,
    InputAdornment,
    Chip,
    TextField as MuiTextField,
    Button,
    CircularProgress
} from '@material-ui/core';
import { RemoveCircleOutline, LocalOfferOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import wombot from 'wombot';

import { generationTypeDisplay } from '../../../api/enums';
import { TextField } from '../../../components/form/TextField';
import {
    Gratitude, putGratitude, uploadFileToS3FromUrl, User
} from '../../../database/db';
import { renderEnumOptions } from '../../../utils/renderEnumOptions';

import AsyncAutoComplete from './AsyncAutoComplete';
import styles from './CreateGratitudeForm.module.scss';


export type GratitudeFormValues = Omit<Gratitude, 'users' | 'tags'> & {
    users: User[];
    tags: { value: string }[];
    tagInput?: string;
}

interface AddEditGratitudeFormProps {
    onDone: (updatedGratitude?: Gratitude) => void;
    defaultValues?: GratitudeFormValues;
    className?: string;
}

export function AddEditGratitudeForm({
    onDone, defaultValues, className
}: AddEditGratitudeFormProps) {
    const [ tagSearchValue, setTagSearchValue ] = useState('');
    const [ tagError, setTagError ] = useState(false);
    const [ inProgress, setInProgress ] = useState(false);
    const [ imgSrc, setImgSrc ] = useState(defaultValues?.imageUrl || '');
    const { user } = useAuth0();
    const { enqueueSnackbar } = useSnackbar();

    const formMethods = useForm<GratitudeFormValues>({ defaultValues });

    const { fields: userFields, append: userAppend, remove: userRemove } = useFieldArray<GratitudeFormValues, 'users', 'key'>({
        name: 'users',
        control: formMethods.control,
        keyName: 'key'
    });

    const { fields: tagFields, append: tagAppend, remove: tagRemove } = useFieldArray<GratitudeFormValues, 'tags'>({
        name: 'tags',
        control: formMethods.control
    });

    const body = formMethods.watch('body');
    const generationType = formMethods.watch('generationType');

    const isValidInput = tagFields.length > 0 && userFields.length > 0 && body;

    const executeImageGeneration = async () => {
        if (!isValidInput) {
            enqueueSnackbar('Please add tags and body text to generate an image');
            return;
        }

        setInProgress(true);
        setImgSrc('blank.jpg');

        const generationPrompt = tagFields.reduce((prev, curr) => `${prev} ${curr.value}`, '');

        try {
            await wombot(generationPrompt, generationType, (data: any) => {
                data.state === 'generated' && setInProgress(false);

                const photoUrl = data?.task?.photo_url_list?.at(-1);
                photoUrl && setImgSrc(photoUrl);
            }, {
                final: false,
                identify_key: 'AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw' // eslint-disable-line
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = formMethods.handleSubmit(async formValues => {
        if (!imgSrc) {
            enqueueSnackbar('Please generate an image first');
            return;
        }

        delete formValues.tagInput; // TODO

        try {
            const isNewImage = imgSrc !== defaultValues?.imageUrl;

            const updatedGratitude: Gratitude = {
                ...formValues,
                imageUrl: isNewImage ? await uploadFileToS3FromUrl(imgSrc) : defaultValues.imageUrl,
                id: defaultValues?.id || uuidv4(),
                from: defaultValues?.from || user?.['http://localhost:3000/user_id'],
                createdAt: defaultValues?.createdAt || new Date().toUTCString(),
                updatedAt: new Date().toUTCString(),
                users: formValues.users.map(user => user.id),
                tags: formValues?.tags.map(tag => tag.value)
            };

            await putGratitude(updatedGratitude);

            onDone(updatedGratitude);
        } catch (error) {
            console.log(error);
        }
    });

    return (
        <form
            className={clsx(styles.form, className)}
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

                <TextField<GratitudeFormValues>
                    name="generationType"
                    label="State"
                    required
                    hideRequiredIndicator
                    select
                >
                    {/* TODO fix images not showing on edit with default values */}

                    {renderEnumOptions(generationTypeDisplay)}
                </TextField>
            </FormProvider>

            {imgSrc && (
                <div
                    className={styles.imageDiv}
                    style={{
                        backgroundImage: `url('${imgSrc}')`,
                        filter: inProgress ? 'brightness(0.7)' : undefined
                    }}
                >
                    {inProgress ? (
                        <CircularProgress
                            color="inherit"
                            size={50}
                        />
                    ) : null}
                </div>
            )}

            <Button
                variant="contained"
                onClick={executeImageGeneration}
                disabled={!isValidInput}
            >
                {imgSrc ? 'Regenerate image' : 'Generate image'}
            </Button>

            <Button
                variant="contained"
                type="submit"
                // disabled={!imgSrc && !inProgress}
            >
                Save
            </Button>

            <Button
                variant="contained"
                onClick={() => onDone()}
            >
                Cancel
            </Button>
        </form>
    );
}
