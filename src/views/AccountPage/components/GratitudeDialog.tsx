import {
    useCallback, useState
} from 'react';
import { useParams } from 'react-router-dom';

import { RoutedDialog, RoutedDialogProps } from '../../../components/RoutedDialog/RoutedDialog';
import { doCustomQuery, Gratitude } from '../../../database/db';
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

    useAsyncEffect(useCallback(async () => {
        if (gratitudeId && gratitude?.id !== gratitudeId) {
            setGratitude(undefined);

            setGratitude((await doCustomQuery('Gratitude', [
                {
                    propertyName: 'id',
                    propertyValue: gratitudeId
                }
            ]))?.[0] as Gratitude);
        }
    }, [ gratitudeId, gratitude?.id ]));

    return (
        <RoutedDialog
            title=""
            {...props}
        >
            {gratitude ? isEditting ? (
                <AddEditGratitudeForm
                    className={styles.root}
                    setGratitude={setGratitude}
                    onDone={() => setIsEditting(false)}
                    defaultValues={gratitude}
                />
            ) : (
                <GratitudeDisplay
                    className={styles.root}
                    gratitude={gratitude}
                    setIsEditting={setIsEditting}
                />
            )
                : <>loading</>}
        </RoutedDialog>
    );
}
