import { InputAdornment, TextField } from '@material-ui/core';
import { ExpandMore, Search } from '@material-ui/icons';

import { fetchData, putData } from '../../database/db';

import styles from './LandingPage.module.scss';
import { NavButtonGroup, SideNav } from './components/SideNav';
import { Star } from './components/Star';


const navButtonGroups: NavButtonGroup[] = [
    {
        title: 'Actions',
        navButtons: [
            {
                name: 'Login',
                to: '/login',
                icon: ExpandMore
            },
            {
                name: 'My account',
                to: '/account',
                icon: ExpandMore
            },
            {
                name: 'Feed',
                to: '/feed',
                icon: ExpandMore
            }
        ]
    },
    {
        title: 'Links',
        navButtons: [
            {
                name: 'Research',
                to: '/research',
                icon: ExpandMore
            },
            {
                name: 'More info',
                to: '/info',
                icon: ExpandMore
            },
            {
                name: 'Contact',
                to: '/contact',
                icon: ExpandMore
            }
        ]
    }
];


export function LandingPage() {
    const fetchDataFormDynamoDb = () => {
        fetchData('Users');
    };

    const addDataToDynamoDB = async () => {
        const userData = {
            id: `${Math.random()}`
        };

        await putData('Users', userData);
    };

    return (
        <div className={styles.root}>
            <SideNav navButtonGroups={navButtonGroups} />

            <div className={styles.content}>
                <div className={styles.topNav}>
                    <TextField
                        variant="standard"
                        placeholder="Search"
                        helperText="Who are you grateful for?"
                        onChange={e => {}}
                        FormHelperTextProps={{
                            className: styles.searchHelperText
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>

                <Star diameter={500} />

                <Star
                    diameter={100}
                    onClick={() => fetchDataFormDynamoDb()}
                >
                    Fetch
                </Star>

                <Star
                    diameter={30}
                    onClick={() => addDataToDynamoDB()}
                >
                    Put
                </Star>
            </div>
        </div>
    );
}
