import classes from './App.module.scss';
import { Star } from './components/Star';
import { fetchData, putData } from './database/db';


function App() {
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
        <div className="App">
            <header className={classes.root}>
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
            </header>
        </div>
    );
}

export default App;
