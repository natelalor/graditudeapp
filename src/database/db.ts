import * as AWS from 'aws-sdk';


const configuration = {
    region: 'us-east-2',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID
};

AWS.config.update(configuration);

const docClient = new AWS.DynamoDB.DocumentClient();

const dynamodb = new AWS.DynamoDB();

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

export interface User {
    id: string;
    email: string;
    email_verified: boolean; // eslint-disable-line
    family_name: string; // eslint-disable-line
    given_name: string; // eslint-disable-line
    ['http://localhost:3000/user_id']: string;
    ['http://localhost:3000/user_metadata']: { isNew: boolean };
    locale: string;
    name: string;
    nickname: string;
    picture: string;
    sub: string;
    updated_at: string; // eslint-disable-line
}

export interface Gratitude {
    id: string;
    userIds: string[];
    from: string;
    body: string;
}

export const putGratitude = (gratitude: Gratitude) => {
    putData('Gratitude', gratitude);
};

export const query = async (tableName: string, searchTerm: string) => {
    const params = {
        Statement: `SELECT * FROM ${tableName} WHERE contains("lowercaseName", '${searchTerm}') OR contains("lowercaseEmail", '${searchTerm}')`,
        ConsistentRead: true || false
    };

    console.log(params);

    return await dynamodb.executeStatement(params).promise();
};
