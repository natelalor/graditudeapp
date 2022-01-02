import { useAuth0 } from '@auth0/auth0-react';
import {
    Alert, CircularProgress, Typography, AvatarGroup, Tooltip, Avatar, Chip, Button
} from '@material-ui/core';
import {
    useState, useEffect, Dispatch, SetStateAction, useCallback
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import wombot from 'wombot';

import { uploadFileToS3, Gratitude, putGratitude } from '../../../database/db';

import { GratitudeFormValues } from './CreateGratitudeForm';
import styles from './CreateGratitudeForm.module.scss';


interface GratitudeWipDisplayProps {
    wipGratitude: GratitudeFormValues | undefined;
    setIsEditting: Dispatch<SetStateAction<boolean>>;
}

export function GratitudeWipDisplay({ wipGratitude, setIsEditting }: GratitudeWipDisplayProps) {
    const [ imgSrc, setImgSrc ] = useState('');
    const [ inProgress, setInProgress ] = useState(false);
    const { user } = useAuth0();

    const executeImageGeneration = useCallback(async () => {
        setInProgress(true);
        setImgSrc('blank.jpg');

        if (!wipGratitude) {
            return;
        }

        const generationPrompt = wipGratitude.tags.reduce((prev, curr) => `${prev} ${curr.value}`, '');

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
    }, [ wipGratitude ]);

    async function saveToDb() {
        if (inProgress || !wipGratitude) {
            return;
        }

        try {
            const imageUrl = await uploadFileToS3(imgSrc);

            const gratitude: Gratitude = {
                id: uuidv4(),
                imageUrl,
                from: user?.['http://localhost:3000/user_id'],
                ...wipGratitude,
                users: wipGratitude.users.map(user => JSON.stringify(user)),
                tags: wipGratitude?.tags.map(tag => tag.value)
            };

            await putGratitude(gratitude);

            console.log('success');
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // update image when wip gratitude is updated
        wipGratitude && executeImageGeneration();
    }, [ wipGratitude, executeImageGeneration ]);

    return (
        <>
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

                    <Typography>
                        {wipGratitude?.body}
                    </Typography>

                    <AvatarGroup
                        max={4}
                        className={styles.avatars}
                    >
                        {wipGratitude?.users.map((field) => (
                            <Tooltip
                                title={field.name}
                                key={field.userId}
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
                        {wipGratitude?.tags.map(tagField => (
                            <Chip
                                key={tagField.value}
                                label={tagField.value}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    alignItems: 'center'
                }}
            >
                <Button
                    onClick={() => setIsEditting(true)}
                    disabled={inProgress}
                >
                    Edit
                </Button>

                <Button
                    onClick={() => executeImageGeneration()}
                    disabled={inProgress}
                >
                    Regenerate
                </Button>

                <Button
                    onClick={saveToDb}
                    disabled={inProgress}
                >
                    Save
                </Button>

            </div>
        </>
    );
}
