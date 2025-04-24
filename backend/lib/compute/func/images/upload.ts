// lambda/upload.ts
import { S3 } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3();
const bucketName = process.env.BUCKET_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {

    console.log("================[Image Upload]===============")
    console.log(JSON.parse(event.body || '{}'))

    const body = JSON.parse(event.body || '{}');
    const { filename, fileContentBase64 } = body;

    
    if (!filename || !fileContentBase64) {
        return { statusCode: 400, body: 'Missing filename or file content' };
    }
    
    // console.log("filename", filename)
    // console.log("fileContentBase64", fileContentBase64)

    const buffer = Buffer.from(fileContentBase64, 'base64');
    const key = `uploads/${uuidv4()}_${filename.toLowerCase()}`

    await s3.putObject({
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ContentType: 'application/octet-stream'
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Upload successful', filename })
    };
};