import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { fetchData, putData } from '../../database/db';

import styles from './LandingPage.module.scss';
import { Star } from './components/Star';


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
            <Button
                component={Link}
                to="/login"
                variant="contained"
            >
                Login
            </Button>

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
    );
}
