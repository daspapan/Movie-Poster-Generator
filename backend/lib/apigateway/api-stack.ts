
import { Construct } from 'constructs';
import { ApiKey, ApiKeySourceType, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

type APIGatewayProps = {
    appName: string;
    stageName: string;
    pingLambdaIntegration: LambdaIntegration;
}

export function createAPIGateway(scope: Construct, props: APIGatewayProps) {

    const api = new RestApi(scope, `${props.appName}-API`, {
        restApiName: `${props.appName}-API`,
        description: `This is a ${props.appName} API for sending out posts.`,
        deployOptions: {
            stageName: props.stageName.toLocaleLowerCase() as string
        },
        defaultCorsPreflightOptions: {
            allowOrigins: ['*'],
            allowMethods: ['*'],
            allowHeaders: ['*'],
            allowCredentials: true,
        },
        // apiKeySourceType: ApiKeySourceType.HEADER  
    });

    const apiKey = ""; //new ApiKey(scope, `${props.appName}-ApiKey`)


    const pingResource = api.root.addResource('ping')
    pingResource.addMethod('GET', props.pingLambdaIntegration);

    return {api, apiKey}
    
}