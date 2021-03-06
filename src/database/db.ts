/* eslint camelcase: "off" */
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import { GenerationType } from '../api/enums';


export interface User {
    id: string;
    email: string;
    email_verified: boolean;
    family_name: string;
    given_name: string;
    ['http://localhost:3000/user_id']: string;
    ['http://localhost:3000/user_metadata']: { isNew: boolean };
    locale: string;
    name: string;
    nickname: string;
    picture: string;
    sub: string;
    updated_at: string;
    bio?: string;
    userName?: string; // TODO assert unique then use this to prettify URL
}

export interface Gratitude {
    id: string;
    createdAt: string;
    updatedAt: string;
    users: string[];
    tags: string[];
    imageUrl: string;
    from: string;
    body: string;
    generationType: GenerationType;
}

const CORS_PREFIX = 'https://infinite-ravine-44623.herokuapp.com/';
const S3_BUCKET = 'gratitude-app';
const REGION = 'us-east-2';

const configuration = {
    region: 'us-east-2',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID
};

AWS.config.update(configuration);

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION
});

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

export const doCustomQuery = async (tableName: string, conditions: {
    propertyName: string;
    propertyValue: string;
    type?: 'OR' | 'AND';
}[]) => {
    const params = {
        Statement: `SELECT * FROM ${tableName} WHERE ${conditions.reduce((prev, curr) => `${prev}${prev === '' ? '' : curr.type || 'OR'} contains("${curr.propertyName}", '${curr.propertyValue}')`, '')}`,
        ConsistentRead: true || false
    };

    const res = await dynamodb.executeStatement(params).promise();

    return res.Items?.map(item => AWS.DynamoDB.Converter.unmarshall(item));
};

export const fetchGratitude = async (userId: string) => {
    const params = {
        Statement: `SELECT * FROM ${'Gratitude'} WHERE contains("from", '${userId}')`,
        ConsistentRead: true || false
    };

    const res = await dynamodb.executeStatement(params).promise();

    return res.Items?.map(item => AWS.DynamoDB.Converter.unmarshall(item)) as Gratitude[];
};

export const putData = (tableName: string, data: any) => {
    const params = {
        TableName: tableName,
        Item: data
    };

    return docClient.put(params).promise();
};

export const putGratitude = (gratitude: Gratitude) => putData('Gratitude', gratitude);

export const updateUser = (userId: string, fields: {
    name: string;
    value: any;
}[]) => {
    const ExpressionAttributeValues: {[key: string]: string} = {};
    let UpdateExpression = 'SET ';

    fields.forEach((field, index) => {
        const [ [ , attributeName ], [ , value ] ] = Object.entries(field);

        ExpressionAttributeValues[`:${attributeName}`] = value;
        UpdateExpression += `${attributeName} = :${attributeName}`;

        if (index + 1 < fields.length) {
            UpdateExpression += ', ';
        }
    });

    const params = {
        TableName: 'Users',
        UpdateExpression,
        ExpressionAttributeValues,
        Key: {
            id: userId
        }
    };

    return docClient.update(params).promise();
};

export const query = async (tableName: string, searchTerm: string) => {
    const params = {
        Statement: `SELECT * FROM ${tableName} WHERE contains("lowercaseName", '${searchTerm}') OR contains("lowercaseEmail", '${searchTerm}')`,
        ConsistentRead: true || false
    };

    const res = await dynamodb.executeStatement(params).promise();

    return res.Items?.map(item => AWS.DynamoDB.Converter.unmarshall(item));
};

export const queryById = async (tableName: string, searchTerm: string) => {
    const params = {
        Statement: `SELECT * FROM ${tableName} WHERE id = '${searchTerm}'`,
        ConsistentRead: true || false
    };

    const res = await dynamodb.executeStatement(params).promise();

    return res.Items?.map(item => AWS.DynamoDB.Converter.unmarshall(item))[0];
};

export const queryByIds = async (tableName: string, ids: string[]) => {
    if (ids.length === 0) {
        return [];
    }

    const params = {
        RequestItems: {
            [tableName]: {
                Keys: ids.map(id => ({ id: { S: id } }))
            }
        },
        ReturnConsumedCapacity: 'TOTAL'
    };

    const res = await dynamodb.batchGetItem(params).promise();

    return res.Responses?.[tableName].map(item => AWS.DynamoDB.Converter.unmarshall(item));
};

export const queryByTags = async (tableName: string, searchTerm: string) => {
    const params = {
        Statement: `SELECT * FROM ${tableName} WHERE contains("tags", '${searchTerm}')`,
        ConsistentRead: true || false
    };

    const res = await dynamodb.executeStatement(params).promise();

    return res.Items?.map(item => AWS.DynamoDB.Converter.unmarshall(item));
};

export const uploadFileToS3FromUrl = async (fileUrl: string) => {
    const res = await fetch(CORS_PREFIX + fileUrl);

    if (!res.body) {
        throw new Error('no image');
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileExtension = fileUrl.split('?')[0].slice(-4);
    const fileKey = `art/${uuidv4() + fileExtension}`;

    const params = {
        Body: buffer,
        Bucket: S3_BUCKET,
        Key: fileKey
    };

    await myBucket.putObject(params).promise();

    return `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileKey}`;
};

export const uploadFileToS3 = async (file: File) => {
    const fileExtension = file.name.split('?')[0].slice(-4);
    const fileKey = `users/${uuidv4() + fileExtension}`;

    const params = {
        Body: file,
        Bucket: S3_BUCKET,
        Key: fileKey
    };

    await myBucket.putObject(params).promise();

    return `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileKey}`;
};
