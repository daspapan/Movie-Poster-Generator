
import { Construct } from 'constructs';
import { ApiKey, ApiKeySourceType, LambdaIntegration, RestApi, MockIntegration, IResource , PassthroughBehavior} from 'aws-cdk-lib/aws-apigateway';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

type APIGatewayProps = {
    appName: string;
    stageName: string;
    pingLambdaIntegration: LambdaIntegration;
    generatePosterLambdaIntegration: LambdaIntegration;
    imageUploadHandlerLambdaIntegration: LambdaIntegration;
    imagePreSignHandlerLambdaIntegration: LambdaIntegration;
}

export function createAPIGateway(scope: Construct, props: APIGatewayProps) {

    const api = new RestApi(scope, `${props.appName}-API`, {
        restApiName: `${props.appName}-API`,
        description: `This is a ${props.appName} API for sending out posts.`,
        deployOptions: {
            stageName: props.stageName.toLocaleLowerCase() as string
        },
        defaultCorsPreflightOptions: {
            allowOrigins: [
                '*'
            ],
            allowMethods: ['*'],
            allowHeaders: ['*'],
            allowCredentials: true,
        },
        // apiKeySourceType: ApiKeySourceType.HEADER  
    });

    const apiKey = ""; //new ApiKey(scope, `${props.appName}-ApiKey`)


    const pingResource = api.root.addResource('ping')
    pingResource.addMethod('GET', props.pingLambdaIntegration);

    const generateResource = api.root.addResource('generate')
    generateResource.addMethod('POST', props.generatePosterLambdaIntegration)

    const imgUploadResource = api.root.addResource('images');
    const upload = imgUploadResource.addResource('upload')
    upload.addMethod('POST', props.imageUploadHandlerLambdaIntegration, {
        methodResponses: [{statusCode: '200'}],
        requestParameters: {
            'method.request.header.Origin': true,
            'method.request.header.Access-Control-Request-Method': true,
            'method.request.header.Access-Control-Request-Headers': true,
        }
    })
    // addCorsOptions(upload)

    const view = imgUploadResource.addResource('view')
    view.addMethod('GET', props.imagePreSignHandlerLambdaIntegration, {
        methodResponses: [{statusCode: '200'}],
        requestParameters: {
            'method.request.header.Origin': true,
            'method.request.header.Access-Control-Request-Method': true,
            'method.request.header.Access-Control-Request-Headers': true,
        }
    })

    return {api, apiKey}
    
}

function addCorsOptions(apiResource: IResource) {
    apiResource.addMethod('OPTIONS', new MockIntegration({
        integrationResponses: [{
            statusCode: '200',
            responseParameters: {
                'method.response.header.Access-Control-Allow-Headers': "'*'",
                'method.response.header.Access-Control-Allow-Origin': "'*'",
                'method.response.header.Access-Control-Allow-Methods': "'GET,POST,OPTIONS'"
            }
        }],
        passthroughBehavior: PassthroughBehavior.NEVER,
        requestTemplates: {
            "application/json": "{\"statusCode\": 200}"
        }
}), {
        methodResponses: [{
            statusCode: '200',
            responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            }
        }]
    });
}
  