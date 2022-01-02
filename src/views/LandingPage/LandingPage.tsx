/* eslint camelcase: "off" */
import { useAuth0 } from '@auth0/auth0-react';
import {
    Alert,
    Avatar,
    AvatarGroup,
    Badge,
    Button, Chip, CircularProgress, IconButton, InputAdornment, Paper, TextField as MuiTextField, Tooltip, Typography
} from '@material-ui/core';
import { RemoveCircleOutline, LocalOfferOutlined } from '@material-ui/icons';
import { useState } from 'react';
import {
    useForm, FormProvider, useFieldArray
} from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import wombot from 'wombot';

import { TextField } from '../../components/form/TextField';
import {
    Gratitude, putData, putGratitude, uploadFileToS3, UserMeta
} from '../../database/db';

import styles from './LandingPage.module.scss';
import AsyncAutoComplete from './components/AsyncAutoComplete';


interface GratitudeFormValues {
    users: UserMeta[];
    tags: { value: string }[];
    from: string;
    body: string;
}

export function LandingPage() {
    const formMethods = useForm<GratitudeFormValues>();

    const body = formMethods.watch('body');

    const { fields: userFields, append: userAppend, remove: userRemove } = useFieldArray<GratitudeFormValues, 'users'>({
        name: 'users',
        control: formMethods.control
    });

    const { fields: tagFields, append: tagAppend, remove: tagRemove } = useFieldArray<GratitudeFormValues, 'tags'>({
        name: 'tags',
        control: formMethods.control
    });

    const generationPrompt = tagFields.reduce((prev, curr) => `${prev} ${curr.value}`, '');

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
    const [ inProgress, setInProgress ] = useState(false);

    async function executeImageGeneration() {
        setInProgress(true);
        setImgSrc('blank.jpg');

        try {
            const res = await wombot(generationPrompt, 10, (data: any) => {
                data.state === 'generated' && setInProgress(false);

                const photoUrl = data?.task?.photo_url_list?.at(-1);
                photoUrl && setImgSrc(photoUrl);
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
    }

    const handleSubmit = formMethods.handleSubmit(async formValues => {
        if (inProgress) {
            return;
        }

        try {
            const imageUrl = await uploadFileToS3(imgSrc);

            const gratitude: Gratitude = {
                id: uuidv4(),
                ...formValues,
                imageUrl,
                tags: formValues.tags.map(tag => tag.value)
            };

            await putGratitude(gratitude);

            console.log('success');
        } catch (error) {
            console.log(error);
        }
    });

    return (
        <div className={styles.root}>
            {!imgSrc && (
                <Paper
                    className={styles.paper}
                    elevation={14}
                >
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
                            onClick={() => (generationPrompt ? executeImageGeneration() : setTagError(true))}
                        >
                            Generate
                        </Button>
                    </form>
                </Paper>
            )}

            {imgSrc && (
                <Paper
                    className={styles.paper}
                    elevation={14}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            maxWidth: '100%',
                            flexWrap: 'wrap',
                            gap: '12px'
                        }}
                    >
                        <img
                            src={imgSrc}
                            alt="todo"
                            className={styles.image}
                        />

                        <div className={styles.caption}>
                            {inProgress ? (
                                <Alert
                                    severity="warning"
                                    className={styles.alert}
                                >
                                    Processing...

                                    <CircularProgress
                                        color="inherit"
                                        size={20}
                                    />
                                </Alert>
                            ) : (
                                <Alert
                                    severity="success"
                                    className={styles.alert}
                                >Complete
                                </Alert>
                            )}

                            <div className={styles.body}>
                                <Typography>
                                    {body}
                                </Typography>
                            </div>

                            <AvatarGroup
                                max={4}
                                className={styles.avatars}
                            >
                                {userFields.map((field) => (
                                    <Tooltip
                                        title={field.name}
                                        key={field.id}
                                    >
                                        <Avatar
                                            alt={field.name}
                                            src={field.picture}
                                            className={styles.avatar}
                                        />
                                    </Tooltip>
                                ))}
                            </AvatarGroup>

                            <div>
                                {tagFields.map((tagField, index) => (
                                    <Chip
                                        key={tagField.id}
                                        label={tagField.value}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* <div style={{
                        background: `url(${imgSrc})`,
                        height: '400px',
                        width: '400px',
                        backgroundSize: 'cover'
                    }} /> */}

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            alignItems: 'center'
                        }}
                    >
                        <Button
                            onClick={() => {
                                setImgSrc('');
                            }}
                        >
                            Edit
                        </Button>

                        <Button
                            onClick={() => executeImageGeneration()}
                        >
                            Regenerate
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={inProgress}
                        >
                            Save
                        </Button>

                    </div>
                </Paper>
            )}
        </div>
    );
}

// const UploadImageToS3WithNativeSdk = () => {

//     const [progress , setProgress] = useState(0);
//     const [selectedFile, setSelectedFile] = useState(null);

//     const handleFileInput = (e) => {
//         setSelectedFile(e.target.files[0]);
//     }

//     const uploadFile = (file) => {

//         const params = {
//             ACL: 'public-read',
//             Body: file,
//             Bucket: S3_BUCKET,
//             Key: file.name
//         };

//         myBucket.putObject(params)
//             .on('httpUploadProgress', (evt) => {
//                 setProgress(Math.round((evt.loaded / evt.total) * 100))
//             })
//             .send((err) => {
//                 if (err) console.log(err)
//             })
//     }


//     return <div>
//         <div>Native SDK File Upload Progress is {progress}%</div>
//         <input type="file" onChange={handleFileInput}/>
//         <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
//     </div>
// }

// export default UploadImageToS3WithNativeSdk;
