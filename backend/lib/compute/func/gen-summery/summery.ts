// func/gen-summery/summery.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { BedrockRuntimeClient, InvokeModelCommand, Trace } from '@aws-sdk/client-bedrock-runtime';

const bedrockClient = new BedrockRuntimeClient({
    region: process.env.BEDROCK_REGION
})

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

// export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
export const handler: APIGatewayProxyHandler = async (event) => {

    console.log("===============[GENERATE SUMMERY]==================")
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
        modelId: "meta.llama3-8b-instruct-v1:0",
        contentType: "application/json",
        accept: "application/json", // "image/png",
        body: JSON.stringify({
            prompt,
            max_gen_len: 512,
            temperature: 0.5,
            top_p: 0.9
        }),
        ...guardrailsParams,
    })

    try {

        const bedRockResponse = await bedrockClient.send(command);
        console.log("[Bedrock Response]", JSON.parse(Buffer.from(bedRockResponse.body).toString()))

        const response = JSON.parse(Buffer.from(bedRockResponse.body).toString());
        

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Text summery generated successfully.', 
                response
            })
        };
        
    } catch (error) {
        
        console.log("===============[GENERATE SUMMERY - ERROR]==================")
        console.error(error)

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                message: `Failed to generate summery using AWS Bedrock. ${error instanceof Error ? error.message : "Unknown error"}`,
            })
        }

    }
};