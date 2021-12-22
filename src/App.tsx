import React from 'react';
import logo from './logo.svg';
import './App.css';
import { fetchData, putData } from './db';


function App() {

  const fetchDataFormDynamoDb = () => {
    fetchData('Users');
  };

  const addDataToDynamoDB = async () => {
    const userData = {
      id: `${Math.random()}`
    }
    
    await putData('Users' , userData);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <button onClick={() => fetchDataFormDynamoDb()}> Fetch </button>

        <button onClick={() => addDataToDynamoDB()}> Put </button>
      </header>
    </div>
  );
}

export default App;
