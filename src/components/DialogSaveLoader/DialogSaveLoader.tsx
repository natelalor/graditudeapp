import Loader from '../Loader/Loader';

import styles from './DialogSaveLoader.module.scss';


export interface DialogSaveLoaderProps {
    loading: boolean;
}

export function DialogSaveLoader({ loading }: DialogSaveLoaderProps) {
    return (
        <Loader
            className={styles.loader}
            loading={loading}
        />
    );
}
