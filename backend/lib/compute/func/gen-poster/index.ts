import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';

const bedrockClient = new BedrockRuntimeClient({
    region: process.env.BEDROCK_REGION
})

const s3Client = new S3Client({
    region: process.env.BEDROCK_REGION
})

exports.handler = async(event: any) => {

    console.log("===============[GENERATE POSTER]==================")
    // console.log("")

    const date = new Date();
    // const {title, description} = JSON.parse(event.body);
    const title = "The Final Dawn"
    const description = "A sci-fi thriller about survival after the sun vanishes."

    // console.log("title, description: ", title, description)

    const prompt = `Create a stunning cinematic poster for a movie titled "${title}". The plot is: ${description}. Use vibrant colors and dramatic lighting.`;

    // console.log("Prompt", prompt)

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

        })
    })

    

    // console.log("Command", command)
    
    try {

        const response = await bedrockClient.send(command);
        console.log("response", JSON.parse(Buffer.from(response.body).toString()))
        const base64Image = JSON.parse(Buffer.from(response.body).toString()).images[0];

        const imageBuffer = Buffer.from(base64Image, 'base64');
        const key = `posters/${uuidv4()}.png`;

        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: imageBuffer,
            ContentType: 'image/png',
            ACL: 'public-read',
        }))
        console.log(`Object "${key}" uploaded to "${process.env.BUCKET_NAME}".`)

        const imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BEDROCK_REGION}.amazonaws.com/${key}`

        const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        }

        const getObjectCommand = new GetObjectCommand(getObjectParams)
        const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, {expiresIn: 3600})

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `GEN POSTER from ${process.env.APP_NAME} at ${date.toISOString()} with body ${title}, ${description}`,
                imageUrl,
                presignedUrl,
            })
        }

    } catch (error) {

        throw error

    }

}