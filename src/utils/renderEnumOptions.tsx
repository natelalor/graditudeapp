import { MenuItem } from '@material-ui/core';
import { ReactNode } from 'react';


export function renderEnumOptions(options: { [key: string]: ReactNode }) {
    return Object.entries(options).map(([ value, display ]) => (
        <MenuItem
            value={value}
            key={value}
        >
            {display}
        </MenuItem>
    ));
}
