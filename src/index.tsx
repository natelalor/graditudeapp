import AWS, { ConfigurationOptions } from 'aws-sdk';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.scss';
import App from './App';
import Auth0ProviderWithHistory from './auth/Auth0ProviderWithHistory';
import reportWebVitals from './reportWebVitals';


const configuration: ConfigurationOptions = {
    region: 'us-east-2',
    secretAccessKey: process.env.GRAT_SECRET_ACCESS_KEY,
    accessKeyId: process.env.GRAT_ACCESS_KEY_ID
};

AWS.config.update(configuration);

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Auth0ProviderWithHistory>
                <App />
            </Auth0ProviderWithHistory>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
