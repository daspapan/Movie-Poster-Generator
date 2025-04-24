import { GetObjectAclCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {APIGatewayProxyHandler} from 'aws-lambda';
import { error } from 'console';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = process.env.BUCKET_NAME
const s3 = new S3Client({
    region: process.env.AWS_REGION
})

export const handler = async(event: any) => {

    console.log("================[Image Upload]===============")
    console.log(JSON.parse(event))

    try {

        const body = JSON.parse(event.body);
        const {fileContent, fileType} = body

        console.log("fileContent", fileContent)
        console.log("fileType", fileType)

        if(!fileContent || !fileType){
            return {
                statusCode: 400,
                body: JSON.stringify({error: "fileContent and fileType are required."})
            }
        }

        const buffer = Buffer.from(fileContent, 'base64')
        const key = `uploads/${uuidv4()}.${fileType.toLowerCase()}`

        console.log("Key", key)

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: `image/${fileType.toLowerCase()}`
        })

        console.log("COmmand", command)

        await s3.send(command)

        console.log(`Object "${key}" uploaded to "${BUCKET_NAME}".`)

        const url = await getSignedUrl(s3, new GetObjectAclCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        }), { expiresIn: 3600 })

        return {
            statusCode: 200,
            body: JSON.stringify({url})
        }
        
    } catch (error) {

        console.error("Upload Error", error)

        return {
            statusCode: 500,
            body: JSON.stringify({error: "Upload failed."})
        }
        
    }
}

/* export const handler: APIGatewayProxyHandler = async(event) => {
    const method = event.httpMethod;
    const path = event.path;

    if(method === 'POST' && path.endsWith('upload')) {
        const key = `${uuidv4()}.jpg`;
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: 'image/jpeg',
        })
        const url = await getSignedUrl(s3, command, {expiresIn: 300})

        return {
            statusCode: 200,
            body: JSON.stringify({uploadUrl: url, key})
        }
    }

    return {
        statusCode: 404,
        body: 'Not Found'
    }
} */