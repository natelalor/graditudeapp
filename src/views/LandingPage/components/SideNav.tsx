import { Button, Typography } from '@material-ui/core';
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
    icon: FC;
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

            {navButtonGroups.map(navButtonGroup => (
                <div
                    key={navButtonGroup.title}
                    className={styles.group}
                >
                    <Typography variant="h5">
                        {navButtonGroup.title}
                    </Typography>

                    <div className={clsx(styles.flex, styles.buttons)}>
                        {navButtonGroup.navButtons.map(navButton => {
                            const { icon: Icon, name, to } = navButton;

                            return (
                                <Button
                                    key={name}
                                    component={Link}
                                    to={to}
                                >
                                    <Icon />

                                    {name}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
