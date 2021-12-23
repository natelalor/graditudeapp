import { ExpandLess, ExpandMore } from '@material-ui/icons';

import { fetchData, putData } from '../../database/db';

import styles from './LandingPage.module.scss';
import { NavButtonGroup, SideNav } from './components/SideNav';
import { Star } from './components/Star';


const navButtonGroups: NavButtonGroup[] = [
    {
        title: 'stuff',
        navButtons: [
            {
                name: 'Login',
                to: '/login',
                icon: ExpandLess
            },
            {
                name: 'My account',
                to: '/',
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
