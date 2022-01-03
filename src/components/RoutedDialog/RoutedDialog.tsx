import { RouteChildrenProps } from 'react-router-dom';

import { AccountPageParams } from '../../views/AccountPage/AccountPage';
import { Dialog, DialogProps } from '../Dialog/Dialog';
import { DialogSaveLoader } from '../DialogSaveLoader/DialogSaveLoader';


export interface RoutedDialogProps<
    TParams extends AccountPageParams = AccountPageParams
> extends RouteChildrenProps<TParams>, Omit<DialogProps, 'open'> {
    closeTo: string;
    saveLoading?: boolean;
}

export function RoutedDialog({
    closeTo, match, history, onClose, saveLoading, children, ...props
}: RoutedDialogProps) {
    const open = !!match;

    return (
        <Dialog
            {...props}
            open={open}
            onClose={(event, reason) => {
                if (reason === 'escapeKeyDown') {
                    history.replace(closeTo);
                    onClose?.(event, reason);
                }
            }}
        >
            {children}

            <DialogSaveLoader
                loading={!!saveLoading}
            />
        </Dialog>
    );
}
