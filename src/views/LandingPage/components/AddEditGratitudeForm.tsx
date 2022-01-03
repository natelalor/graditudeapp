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
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import wombot from 'wombot';

import { TextField } from '../../../components/form/TextField';
import {
    Gratitude, putGratitude, uploadFileToS3, UserMeta
} from '../../../database/db';

import AsyncAutoComplete from './AsyncAutoComplete';
import styles from './CreateGratitudeForm.module.scss';


export interface GratitudeFormValues {
    users: UserMeta[];
    tags: { value: string }[];
    body: string;
    tagInput?: string;
}

interface AddEditGratitudeFormProps {
    setGratitude: Dispatch<SetStateAction<Gratitude | undefined>>;
    onDone: () => void;
    defaultValues?: Gratitude;
    className?: string;
}

export function AddEditGratitudeForm({
    setGratitude, onDone, defaultValues, className
}: AddEditGratitudeFormProps) {
    const [ tagSearchValue, setTagSearchValue ] = useState('');
    const [ tagError, setTagError ] = useState(false);
    const [ inProgress, setInProgress ] = useState(false);
    const [ imgSrc, setImgSrc ] = useState(defaultValues?.imageUrl || '');
    const { user } = useAuth0();

    const formMethods = useForm<GratitudeFormValues>({ defaultValues: generateDefaultValues(defaultValues) });

    const { fields: userFields, append: userAppend, remove: userRemove } = useFieldArray<GratitudeFormValues, 'users'>({
        name: 'users',
        control: formMethods.control
    });

    const { fields: tagFields, append: tagAppend, remove: tagRemove } = useFieldArray<GratitudeFormValues, 'tags'>({
        name: 'tags',
        control: formMethods.control
    });

    const body = formMethods.watch('body');

    const isValidInput = tagFields.length > 0 && userFields.length > 0 && body;

    const executeImageGeneration = async () => {
        setInProgress(true);
        setImgSrc('blank.jpg');

        const generationPrompt = tagFields.reduce((prev, curr) => `${prev} ${curr.value}`, '');

        try {
            await wombot(generationPrompt, 10, (data: any) => {
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
        delete formValues.tagInput;

        // if (formValues.tags.length === 0) {
        //     setTagError(true);
        // } else {
        //     setGratitude({
        //         ...formValues,
        //         from: user?.['http://localhost:3000/user_id'],
        //         users: formValues.users.map(user => JSON.stringify(user)),
        //         tags: formValues?.tags.map(tag => tag.value)
        //     });
        //     setIsEditting(false);
        // }
        // if (inProgress || !imgSrc) {
        //     return;
        // }

        try {
            const isNewImage = imgSrc !== defaultValues?.imageUrl;

            const updatedGratitude: Gratitude = {
                ...formValues,
                imageUrl: isNewImage ? await uploadFileToS3(imgSrc) : defaultValues.imageUrl,
                id: defaultValues?.id || uuidv4(),
                from: defaultValues?.from || user?.['http://localhost:3000/user_id'],
                users: formValues.users.map(user => JSON.stringify(user)),
                tags: formValues?.tags.map(tag => tag.value)
            };

            await putGratitude(updatedGratitude);

            setGratitude(updatedGratitude); // TODO this state probably isn't necessary

            onDone();
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
            </FormProvider>

            {imgSrc && (
                <div
                    className={styles.imageDiv}
                    style={{
                        backgroundImage: `url('${imgSrc}')`,
                        filter: inProgress ? 'blur(2px) brightness(0.7);' : undefined
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
                onClick={onDone}
            >
                Cancel
            </Button>
        </form>
    );
}

function generateDefaultValues(defaultValues?: Gratitude): GratitudeFormValues | undefined {
    return defaultValues ? ({
        ...defaultValues,
        users: defaultValues.users.map(user => JSON.parse(user)),
        tags: defaultValues.tags.map(tag => ({ value: tag }))
    }) : undefined;
}
