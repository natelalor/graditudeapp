import * as AWS from 'aws-sdk'
const configuration = {
    region: 'us-east-2',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID
}

AWS.config.update(configuration);
const docClient = new AWS.DynamoDB.DocumentClient()

export const fetchData = (tableName: any) => {
    var params = {
        TableName: tableName
    }

    docClient.scan(params, function (err, data) {
        if (!err) {
            console.log(data)
        } else {
            console.log(err);
        }
    })
}

export const putData = async (tableName: any , data: any) => {
    var params = {
        TableName: tableName,
        Item: data
    }
    
    docClient.put(params, function (err, data) {
        if (err) {
            console.log('Error', err)
        } else {
            console.log('Success', data)
        }
    })
}