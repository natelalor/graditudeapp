import { DialogActions as MuiDialogActions } from '@material-ui/core';
import { ReactNode } from 'react';

import { DialogSaveLoader } from '../DialogSaveLoader/DialogSaveLoader';

import styles from './DialogActions.module.scss';


interface DialogActionsProps {
    children: ReactNode;
    loading?: boolean;
}

export function DialogActions({ children, loading }: DialogActionsProps) {
    return (
        <MuiDialogActions className={styles.root}>
            {children}

            <DialogSaveLoader
                loading={!!loading}
            />
        </MuiDialogActions>
    );
}
