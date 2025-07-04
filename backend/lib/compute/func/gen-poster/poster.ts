// lambda/upload.ts
import { S3 } from 'aws-sdk';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { BedrockRuntimeClient, InvokeModelCommand, Trace } from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
    region: process.env.BEDROCK_REGION
})

const s3Client = new S3();
const bucketName = process.env.BUCKET_NAME!;
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

// export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
export const handler: APIGatewayProxyHandler = async (event) => {

    console.log("===============[GENERATE POSTER]==================")
    // console.log(JSON.parse(event.body || '{}'))

    const body = JSON.parse(event.body || '{}');
    const { prompt } = body;

    if (!prompt) {
        return { 
            statusCode: 400, 
            headers,
            body: JSON.stringify({
                message: 'Missing prompt'
            }),
        }
    }

    // const prompt = `Create a stunning cinematic poster for a movie titled "${title}". The plot is: ${description}. Use vibrant colors and dramatic lighting.`;
    console.log("[prompt]", prompt)

    const guardrailsParams = {
        trace: Trace.DISABLED,
        guardrailIdentifier: process.env.GUARDRAIL_IDENTIFIER || '',
        guardrailVersion: 'DRAFT'
    }

    const command = new InvokeModelCommand({
        modelId: "amazon.titan-image-generator-v1",
        contentType: "application/json",
        accept: "application/json", // "image/png",
        body: JSON.stringify({
            // prompt,
            // cfg_scale: 10,
            // steps: 30,
            textToImageParams: {text: prompt},
            taskType: "TEXT_IMAGE",
            imageGenerationConfig: {
                cfgScale: 8,
                seed: 42,
                quality: "standard",
                width: 512,
                height: 512,
                numberOfImages: 1
            }

        }),
        ...guardrailsParams,
    })

    try {

        const bedRockResponse = await bedrockClient.send(command);
        console.log("[Bedrock Response]", JSON.parse(Buffer.from(bedRockResponse.body).toString()))

        const base64Image = JSON.parse(Buffer.from(bedRockResponse.body).toString()).images[0];
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const key = `posters/${uuidv4()}.png`;

        await s3Client.putObject({
            Bucket: bucketName,
            Key: key,
            Body: imageBuffer,
            ContentType: `image/png`
        }).promise();
        console.log(`Object "${key}" uploaded to "${bucketName}".`)

        const posterUrl = s3Client.getSignedUrl('getObject', {
            Bucket: bucketName,
            Key: key,
            Expires: 60 * 5 // 5 minutes
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Image generated successfully.', 
                posterUrl
            })
        };
        
    } catch (error) {
        
        console.log("===============[GENERATE POSTER - ERROR]==================")
        console.error(error)

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                message: `Failed to generate poster using AWS Bedrock. ${error instanceof Error ? error.message : "Unknown error"}`,
            })
        }

    }
};