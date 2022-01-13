import { useAuth0 } from '@auth0/auth0-react';
import {
    Avatar, Badge, IconButton, styled, Tooltip
} from '@material-ui/core';
import clsx from 'clsx';
import { FC, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { UserContext } from '../../../App';

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
    const { isAuthenticated } = useAuth0();
    const { user } = useContext(UserContext);
    const history = useHistory();

    return (
        <div className={clsx(styles.root, styles.flex)}>
            {isAuthenticated ? (
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    variant="dot"
                >
                    <Avatar
                        alt={user?.name}
                        src={user?.picture}
                        className={styles.logo}
                        onClick={() => history.push(`/account/${user?.id || ''}`)}
                    />
                </StyledBadge>
            ) : (
                <img
                    className={styles.logo}
                    src="logo.png"
                    alt="alt"
                />
            )}

            <div className={clsx(styles.buttons, styles.flex)}>
                {navButtonGroups.map(navButtonGroup => (
                    navButtonGroup.navButtons.map(navButton => {
                        const { icon: Icon, name, to } = navButton;

                        return (
                            <Tooltip
                                title={name}
                                key={name}
                                placement="right"
                            >
                                <IconButton
                                    component={Link}
                                    to={to}
                                    color="primary"
                                    size="large"
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

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: 'rgb(159, 217, 124)',
        color: 'rgb(159, 217, 124)',
        height: '12px',
        width: '12px',
        borderRadius: '50%',
        boxShadow: '0 0 0 2px rgb(31, 31, 31)',
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""'
        }
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0
        }
    }
}));
