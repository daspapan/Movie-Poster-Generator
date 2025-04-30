import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CDKContext } from '../types';
import { createImagesBucket, createImgUploadBucket } from './storage/s3bucket';
import { createAuth } from './auth/cognito';
import { createFunctions } from './compute/functions';
import { createAPIGateway } from './apigateway/api-stack';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { createGuardrail } from './AI/guardrail';


export class BackendStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: cdk.StackProps, context: CDKContext){
        super(scope, id, props);

        const appName = `${context.appName}-${context.stage}`;
        console.log(`AppName -> ${appName}`)

        console.log(JSON.stringify(context, null, 2))


        // Cognito Setup
        /*const auth = createAuth(this, {
            appName: appName,
        });*/


        // S3 Bucket
        /*const bucket = createImagesBucket(this, {
            appName: appName,
        })*/
        const uploadBucket = createImgUploadBucket(this, {
            appName: appName,
        })

        const guardrail = createGuardrail(this, {
            appName: appName
        })


        // NodejsFunction & LambdaFunction
        const computeStack = createFunctions(this, {
            appName: appName,
            stageName: context.stage,
            awsRegion: context.env.region,
            posterBucket: uploadBucket.mediaBucket,
            imgUploadBucket: uploadBucket.mediaBucket,
            lambdaRole: uploadBucket.lambdaRole,
            guardrail: guardrail,
        }); 


        const api = createAPIGateway(this, {
            appName: appName,
            stageName: context.stage,
            pingLambdaIntegration: new LambdaIntegration(computeStack.pingFunc),
            generatePosterLambdaIntegration: new LambdaIntegration(computeStack.genPosterFunc),
            generateSummeryLambdaIntegration: new LambdaIntegration(computeStack.genSummeryFunc),
            imageUploadHandlerLambdaIntegration: new LambdaIntegration(computeStack.imageUploadFunc),
            imagePreSignHandlerLambdaIntegration: new LambdaIntegration(computeStack.imagePreSignFunc)
        })


        // S3 Bucket
        new cdk.CfnOutput(this, 'BucketName', {value: uploadBucket.mediaBucket.bucketName})
        // API Endpoint
        new cdk.CfnOutput(this, 'ApiUrl', {value: api.api.url})
        new cdk.CfnOutput(this, 'ApiKeyId', {value: api.apiKey.keyId})



    }

}