import {
    ImageList, ImageListItem
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Gratitude } from '../../database/db';

import styles from './Gallery.module.scss';


interface GalleryProps {
    gratitudes: Gratitude[];
}

export default function Gallery({ gratitudes }: GalleryProps) {
    const history = useHistory();

    // TODO if possible, prevent rerenders when a dialog opens and dont use state for this
    const [ heights, setHeights ] = useState<number[]>([]);

    useEffect(() => {
        setHeights(
            [ ...Array(gratitudes.length) ].map(() => Math.random() * 20 + 15)
        );
    }, [ gratitudes ]);

    return (
        <ImageList
            sx={{ width: '100%' }}
            cols={3}
            gap={16}
            variant="masonry"
            className={styles.list}
        >
            {gratitudes.map((gratitude, index) => (
                <ImageListItem
                    key={gratitude.id}
                    onClick={() => history.push(`${history.location.pathname}/${gratitude.id}`)}
                    className={styles.image}
                >
                    <img
                        style={{ height: `${heights?.[index]}vw` || 300 }}
                        src={gratitude.imageUrl}
                        // height={`${heights?.[index]}vw`} // TODO make work
                        alt={gratitude.body}
                        loading="lazy"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}
