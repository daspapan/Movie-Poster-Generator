import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CDKContext } from '../types';
import { createImagesBucket } from './storage/s3bucket';
import { createAuth } from './auth/cognito';
import { createFunctions } from './compute/functions';
import { createAPIGateway } from './apigateway/api-stack';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';


export class BackendStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: cdk.StackProps, context: CDKContext){
        super(scope, id, props);

        const appName = `${context.appName}-${context.stage}`;
        console.log(`AppName -> ${appName}`)

        console.log(JSON.stringify(context, null, 2))


        // Cognito Setup
        const auth = createAuth(this, {
            appName: appName,
        });


        // NodejsFunction & LambdaFunction
        const computeStack = createFunctions(this, {
            appName: appName,
        }); 


        // S3 Bucket
        const bucket = createImagesBucket(this, {
            appName: appName,
            authenticatedRole: auth.identityPool.authenticatedRole,
        })

        const api = createAPIGateway(this, {
            appName: appName,
            stageName: context.stage,
            pingLambdaIntegration: new LambdaIntegration(computeStack.pingFunc),
        })


        // S3 Bucket
        new cdk.CfnOutput(this, 'BucketName', {value: bucket.bucketName})
        // API Endpoint
        new cdk.CfnOutput(this, 'ApiUrl', {value: api.api.url})
        new cdk.CfnOutput(this, 'ApiKeyId', {value: api.apiKey.keyId})


    }

}