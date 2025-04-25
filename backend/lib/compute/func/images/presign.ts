// lambda/presign.ts
import { S3 } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';

const s3Presign = new S3();
const bucketPresign = process.env.BUCKET_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {

    console.log("================[Image Presign]===============")

    const filename = event.queryStringParameters?.filename;

    
    if (!filename) {
        return { statusCode: 400, body: 'Missing filename query parameter' };
    }
    
    console.log("Filename", filename)
    
    const url = s3Presign.getSignedUrl('getObject', {
        Bucket: bucketPresign,
        Key: `uploads/${filename}`,
        Expires: 60 * 5 // 5 minutes
    });

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        body: JSON.stringify({ url })
    };
};