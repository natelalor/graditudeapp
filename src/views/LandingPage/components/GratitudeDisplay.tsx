import {
    Typography, AvatarGroup, Tooltip, Avatar, Chip, Button
} from '@material-ui/core';
import { Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router-dom';

import { Gratitude, User } from '../../../database/db';

import styles from './GratitudeDisplay.module.scss';


interface GratitudeDisplayProps {
    gratitude: Gratitude;
    users: User[];
    setIsEditting: Dispatch<SetStateAction<boolean>>;
    className?: string;
}

export function GratitudeDisplay({
    gratitude, users, setIsEditting, className
}: GratitudeDisplayProps) {
    const history = useHistory();

    return (
        <div className={className}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '100%',
                    flexWrap: 'wrap',
                    gap: '24px'
                }}
            >
                <div
                    className={styles.imageDiv}
                    style={{ backgroundImage: `url('${gratitude.imageUrl}')` }}
                />

                <div className={styles.caption}>
                    <div className={styles.bodyAndTags}>
                        <Typography>
                            {gratitude.body}
                        </Typography>

                        <div>
                            {gratitude.tags.map(tagField => (
                                <Chip
                                    key={tagField}
                                    label={tagField}
                                    onClick={() => history.push({
                                        pathname: '/search',
                                        state: {
                                            tags: [ tagField ]
                                        }
                                    })}
                                />
                            ))}
                        </div>
                    </div>

                    <AvatarGroup
                        max={4}
                        className={styles.avatars}
                    >
                        {users.map((user) => (
                            <Tooltip
                                title={user.name}
                                key={user.id}
                            >
                                <Avatar
                                    alt={user.name}
                                    src={user.picture}
                                    className={styles.avatar}
                                    onClick={() => {
                                        history.push(`/account/${user.id}`);
                                    }}
                                />
                            </Tooltip>
                        ))}
                    </AvatarGroup>
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
                >
                    Edit
                </Button>
            </div>
        </div>
    );
}
