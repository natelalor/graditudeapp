import {
    useCallback, useState
} from 'react';
import { useParams } from 'react-router-dom';

import api from '../../../api';
import { RoutedDialog, RoutedDialogProps } from '../../../components/RoutedDialog/RoutedDialog';
import { doCustomQuery, Gratitude, User } from '../../../database/db';
import useAsyncEffect from '../../../utils/useAsyncEffect';
import { AddEditGratitudeForm } from '../../LandingPage/components/AddEditGratitudeForm';
import { GratitudeDisplay } from '../../LandingPage/components/GratitudeDisplay';

import styles from './GratitudeDialog.module.scss';


interface GratitudeDialogParams {
    accountId: string;
    gratitudeId?: string;
}

export function GratitudeDialog(props: Omit<RoutedDialogProps, 'title'>) {
    const { gratitudeId } = useParams<GratitudeDialogParams>();
    const [ gratitude, setGratitude ] = useState<Gratitude>();
    const [ isEditting, setIsEditting ] = useState(false);
    const [ users, setUsers ] = useState<User[]>([]);

    useAsyncEffect(useCallback(async () => {
        if (gratitudeId && gratitude?.id !== gratitudeId) {
            setGratitude(undefined);

            // is it necessary to fetch here or can we pass with state? Should just fetch users
            const gratitude = (await doCustomQuery('Gratitude', [
                {
                    propertyName: 'id',
                    propertyValue: gratitudeId
                }
            ]))?.[0] as Gratitude;

            setGratitude(gratitude);
            setUsers(await api.users.getUsersByIds(gratitude.users));
        }
    }, [ gratitudeId, gratitude?.id ]));

    return (
        <RoutedDialog
            title=""
            {...props}
            onClose={() => {
                setTimeout(() => setIsEditting(false), 250);
            }}
        >
            {gratitude ? isEditting ? (
                <AddEditGratitudeForm
                    className={styles.root}
                    defaultValues={{
                        ...gratitude,
                        tags: gratitude?.tags.map(tag => ({ value: tag })) || [],
                        users
                    }}
                    onDone={(updatedGratitude?: Gratitude) => {
                        setIsEditting(false);
                        updatedGratitude && setGratitude(updatedGratitude);
                    }}
                />
            ) : (
                <GratitudeDisplay
                    className={styles.root}
                    gratitude={gratitude}
                    setIsEditting={setIsEditting}
                    users={users}
                />
            )
                : <>loading</>}
        </RoutedDialog>
    );
}
