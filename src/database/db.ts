import * as AWS from 'aws-sdk';


const configuration = {
    region: 'us-east-2',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID
};

AWS.config.update(configuration);
const docClient = new AWS.DynamoDB.DocumentClient();

export const fetchData = (tableName: any) => {
    const params = {
        TableName: tableName
    };

    docClient.scan(params, (err, data) => {
        if (!err) {
            console.log(data);
        } else {
            console.log(err);
        }
    });
};

export const fetchGratitude = (user: any) => {
    const params = {
        TableName: 'Gratitude',
        KeyConditionExpression: '#from = :email',
        ExpressionAttributeNames: {
            '#from': 'from'
        },
        ExpressionAttributeValues: {
            ':email': user.email
        }
    };

    docClient.query(params, (err, data) => {
        if (err) {
            console.log('Unable to query. Error:', JSON.stringify(err, null, 2));
        } else {
            console.log('Query succeeded.');
            data.Items?.forEach((item) => {
                console.log(item);
            });
        }
    });
};

export const putData = (tableName: any, data: any) => {
    const params = {
        TableName: tableName,
        Item: data
    };

    docClient.put(params, (err, data) => {
        if (err) {
            console.log('Error', err);
        } else {
            console.log('Success', data);
        }
    });
};

export interface Gratitude {
    id: string;
    to: string;
    from: string;
    body: string;
}

export const putGratitude = (gratitude: Gratitude) => {
    putData('Gratitude', gratitude);
};
