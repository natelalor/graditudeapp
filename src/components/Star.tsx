import { HTMLAttributes, ReactNode, useState } from 'react';

import classes from './Star.module.scss';


export interface StarProps extends HTMLAttributes<HTMLDivElement> {
    brightness?: number;
    diameter: number;
    children?: ReactNode;
}

export function Star({
    brightness = 1, diameter, children, ...props
}: StarProps) {
    const [ lumens, setLumens ] = useState(brightness);

    function handleClick() {
        setLumens(lumens - 0.1);
        console.log(lumens);
    }

    return (
        <div
            className={classes.root}
            onClick={handleClick}
            style={{
                background: `rgba(255, 255, 255, ${lumens})`,
                width: `${diameter}px`,
                height: `${diameter}px`
            }}
            {...props}
        >
            {children}
        </div>
    );
}
