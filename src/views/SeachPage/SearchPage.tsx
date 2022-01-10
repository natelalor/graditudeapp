import { Chip, InputAdornment, TextField as MuiTextField } from '@material-ui/core';
import { LocalOfferOutlined } from '@material-ui/icons';
import {
    FC, useCallback, useEffect, useState
} from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import api from '../../api';
import Gallery from '../../components/Gallery/Gallery';
import { RoutedDialogProps } from '../../components/RoutedDialog/RoutedDialog';
import { Gratitude } from '../../database/db';
import useAsyncEffect from '../../utils/useAsyncEffect';
import { GratitudeDialog } from '../AccountPage/components/GratitudeDialog';

import styles from './SearchPage.module.scss';


export interface SearchPageParams {
    gratitudeId: string | undefined;
}

export function SearchPage({ match, history }: RouteComponentProps<SearchPageParams>) {
    const [ tags, setTags ] = useState<string[]>((history.location.state as any)?.tags || []);
    const [ tagSearchValue, setTagSearchValue ] = useState('');

    const [ gratitudes, setGratitudes ] = useState<Gratitude[]>([]);

    useAsyncEffect(useCallback(async () => {
        if (tags.length) {
            setGratitudes(await api.gratitude.searchGratitudesByTags(tags));
        } else {
            setGratitudes([]); // set to empty if we want to remove results when they x out all the tags
        }
    }, [ tags ]));

    useEffect(() => {
        if ((history.location.state as any)?.tags) {
            setTags((history.location.state as any)?.tags);
        }
    }, [ history.location.state ]);

    return (
        <div className={styles.root}>
            <MuiTextField
                variant="standard"
                placeholder="Tags"
                value={tagSearchValue}
                onChange={(event) => {
                    setTagSearchValue(event.target.value);
                }}
                onKeyDown={event => {
                    if ((event.code === 'Enter' || event.code === 'Space') && tagSearchValue) {
                        event.preventDefault();

                        setTags(tags.concat([ tagSearchValue ]));
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
            />

            <div>
                {tags.map(tag => (
                    <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => setTags(tags.filter(value => value !== tag))}
                    />
                ))}
            </div>

            <Gallery gratitudes={gratitudes} />

            {/* TODO since htis is reused, maybe abstract into own component */}

            {Object.entries(dialogRoutes).map(([ path, DialogComponent ]) => (
                <Route
                    key={path}
                    path={`${match.path}/${path}`}
                    children={({ history, location, match: dialogMatch }) => (
                        <DialogComponent
                            closeTo={match.url}
                            history={history}
                            location={location}
                            match={dialogMatch as RoutedDialogProps['match']}
                        />
                    )}
                />
            ))}
        </div>
    );
}

type DialogRoutes = {
    [path: string]: FC<Omit<RoutedDialogProps, 'title' | 'children'>>;
};

const dialogRoutes: DialogRoutes = {
    ':gratitudeId': GratitudeDialog
};
