import { Button, Typography } from '@material-ui/core';
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
        <div className={styles.flex}>
            <img
                className={styles.logo}
                src="/public/logo.png"
                alt="alt"
            />

            {navButtonGroups.map(navButtonGroup => (
                <div key={navButtonGroup.title}>
                    <Typography component="h4">
                        {navButtonGroup.title}
                    </Typography>

                    <div className={styles.flex}>
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
