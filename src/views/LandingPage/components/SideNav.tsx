import { Button, IconButton, Tooltip, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import styles from './SideNav.module.scss';


export interface NavButtonGroup {
    title: string;
    navButtons: NavButton[]
}

interface NavButton {
    name: string;
    to: string;
    icon: FC<any>;
}

export interface SideNavProps {
    navButtonGroups: NavButtonGroup[]
}

export function SideNav({ navButtonGroups }: SideNavProps) {
    return (
        <div className={clsx(styles.root, styles.flex)}>
            <img
                className={styles.logo}
                src="logo.png"
                alt="alt"
            />

            <div className={clsx(styles.buttons, styles.flex)}>
                {navButtonGroups.map(navButtonGroup => (
                    navButtonGroup.navButtons.map(navButton => {
                        const { icon: Icon, name, to } = navButton;

                        return (
                            <Tooltip title={name} key={name} placement='right'>
                                <IconButton
                                    component={Link}
                                    to={to}
                                    color='primary'
                                    size='large'
                                    className={styles.button}
                                >
                                    <Icon
                                        className={styles.icon}
                                    />
                                </IconButton>
                            </Tooltip>
                        );
                    })
                ))}
            </div>

        </div>
    );
}
