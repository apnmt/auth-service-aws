const AWS = require('aws-sdk');

// Initialize CognitoIdentityServiceProvider.
const cognito = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
});

const USERPOOLID = process.env.COGNITO_USER_POOL_ID;

exports.handler = async (event, context) => {
    const requestBody = JSON.parse(event.body);
    console.log(requestBody);
    const EMAIL = requestBody.email;
    const USERNAME = requestBody.username;
    const PASSWORD = requestBody.password;
    const createUserParams = {
        UserPoolId: USERPOOLID,
        Username: USERNAME,
        UserAttributes: [{
            Name: "email",
            Value: EMAIL,
        },
        {
            Name: "email_verified",
            Value: "true",
        },
        ],
        TemporaryPassword: PASSWORD,
    };

    let createUserResponse = await cognito.adminCreateUser(createUserParams).promise();
    console.log(JSON.stringify(createUserResponse, null, 2));

    let setUserPasswordParams = {
        Password: PASSWORD,
        UserPoolId: USERPOOLID,
        Username: USERNAME,
        Permanent: true
    };
    let setUserPasswordResponseBody = await cognito.adminSetUserPassword(setUserPasswordParams).promise();
    console.log(JSON.stringify(setUserPasswordResponseBody, null, 2));

    let userGroupParams = {
        UserPoolId: USERPOOLID,
        Username: USERNAME,
        GroupName: "user"
    }
    let addUserToGroupResponseBody = await cognito.adminAddUserToGroup(userGroupParams).promise()
    console.log(JSON.stringify(addUserToGroupResponseBody, null, 2));

    const response = {
        "statusCode": 200,
        "body": JSON.stringify(createUserResponse),
        "isBase64Encoded": false
    };
    return response
}
