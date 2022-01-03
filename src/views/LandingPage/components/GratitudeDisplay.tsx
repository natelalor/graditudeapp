import {
    Alert, CircularProgress, Typography, AvatarGroup, Tooltip, Avatar, Chip, Button
} from '@material-ui/core';
import {
    useState, useEffect, Dispatch, SetStateAction, useCallback
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import wombot from 'wombot';

import {
    uploadFileToS3, Gratitude, putGratitude, UserMeta
} from '../../../database/db';
import { PartialGratitude } from '../LandingPage';

import styles from './GratitudeDisplay.module.scss';


interface GratitudeDisplayProps {
    gratitude: PartialGratitude | undefined;
    setIsEditting: Dispatch<SetStateAction<boolean>>;
    className?: string;
}

export function GratitudeDisplay({ gratitude, setIsEditting, className }: GratitudeDisplayProps) {
    const [ imgSrc, setImgSrc ] = useState(gratitude?.imageUrl || '');
    const [ inProgress, setInProgress ] = useState(false);

    const executeImageGeneration = useCallback(async () => {
        setInProgress(true);
        setImgSrc('blank.jpg');

        if (!gratitude) {
            return;
        }

        const generationPrompt = gratitude.tags.reduce((prev, curr) => `${prev} ${curr}`, '');

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
    }, [ gratitude ]);

    async function saveToDb() {
        if (inProgress || !gratitude) {
            return;
        }

        try {
            const imageUrl = await uploadFileToS3(imgSrc);

            const updatedGratitude: Gratitude = {
                ...gratitude,
                id: uuidv4(),
                imageUrl
            };

            await putGratitude(updatedGratitude);

            console.log('success');
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // update image when wip gratitude is updated
        if (gratitude) {
            gratitude.imageUrl && setImgSrc(gratitude.imageUrl);
            !imgSrc && executeImageGeneration();
        }
    }, [
        gratitude, executeImageGeneration, imgSrc
    ]);

    return (
        <div className={className}>
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
                        {gratitude?.body}
                    </Typography>

                    <AvatarGroup
                        max={4}
                        className={styles.avatars}
                    >
                        {gratitude?.users.map((userString) => {
                            const userMeta = JSON.parse(userString) as UserMeta;

                            return (
                                <Tooltip
                                    title={userMeta.name}
                                    key={userMeta.userId}
                                >
                                    <Avatar
                                        alt={userMeta.name}
                                        src={userMeta.picture}
                                        className={styles.avatar}
                                    />
                                </Tooltip>
                            );
                        })}
                    </AvatarGroup>

                    <div>
                        {gratitude?.tags.map(tagField => (
                            <Chip
                                key={tagField}
                                label={tagField}
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
        </div>
    );
}