import {
    CircularProgress,
    Dialog as MuiDialog, DialogProps as MuiDialogProps, DialogTitle, Fade, IconButton
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { ReactNode } from 'react';

// import PageMessage, { PageMessageContext } from '../../views/components/PageMessage'; // TODO

import styles from './Dialog.module.scss';


export interface DialogProps extends Omit<MuiDialogProps, 'title'> {
    title: ReactNode;
    loading?: boolean;
}

export function Dialog({
    children, title, loading, onClose, open, ...props
}: DialogProps) {
    // const { setDialogOpen, setPageMessage } = useContext(PageMessageContext);

    // useEffect(() => {
    //     setDialogOpen(open);

    //     setPageMessage(undefined);
    // }, [
    //     open, setDialogOpen, setPageMessage
    // ]);

    return (
        <MuiDialog
            {...props}
            open={open}
            onClose={(event, reason) => {
                if (reason === 'escapeKeyDown') {
                    onClose?.(event, reason);
                }
            }}
        >
            <DialogTitle className={styles.title}>
                {title}

                <IconButton
                    onClick={() => onClose?.({}, 'escapeKeyDown')}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            {loading ? (
                <div className={styles.loader}>
                    <Fade
                        in
                        enter
                        timeout={1000}
                    >
                        <CircularProgress />
                    </Fade>
                </div>
            ) : children}

            {/* <PageMessage
                dialog
                className={styles.pageMessage}
            /> */}
        </MuiDialog>
    );
}
