import { Fade, LinearProgress } from '@material-ui/core';


interface LoaderProps {
    className?: string;
    loading: boolean | undefined;
}

export default function Loader({ className, loading }: LoaderProps) {
    return !loading ? null : (
        <Fade
            in
            enter
            timeout={500}
        >
            <LinearProgress className={className} />
        </Fade>
    );
}
