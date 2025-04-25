import { Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as logs from 'aws-cdk-lib/aws-logs'
// const path = require('path');
import path from 'path';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

type CreateFunctionsProps = {
    appName: string;
    stageName: string;
    awsRegion: string;
    posterBucket: Bucket;
    imgUploadBucket: Bucket;
    lambdaRole: iam.Role;
}


export function createFunctions(scope: Construct, props: CreateFunctionsProps){

    // aws logs tail /aws/lambda/MPG-Prod-PingFunc --follow
    const pingFunc = new NodejsFunction(scope, `${props.appName}-PingFunc`, {
        functionName: `${props.appName}-PingFunc`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(
            __dirname,
            './func/ping/index.ts'
        ),
        environment: {
            APP_NAME: props.appName
        },
    });



    // aws logs tail /aws/lambda/MPG-Prod-ImgUploadFunc --follow
    const imageUploadFunc = new NodejsFunction(scope, `${props.appName}-ImgUploadFunc`, {
        functionName: `${props.appName}-ImgUploadFunc`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        // code: Code.fromAsset('lambda'),
        entry: path.join(
            __dirname,
            './func/images/upload.ts'
        ),
        environment: {
            APP_NAME: props.appName,
            BUCKET_REGION: props.awsRegion, 
            BUCKET_NAME: props.imgUploadBucket.bucketName
        },
        role: props.lambdaRole
    });
    
    /* imageUploadFunc.addToRolePolicy(new iam.PolicyStatement({
        actions: ['s3:*'],
        resources: [props.imgUploadBucket.bucketArn as string]
    })) */

    // aws logs tail /aws/lambda/MPG-Prod-ImgPreSignFunc --follow
    const imagePreSignFunc = new NodejsFunction(scope, `${props.appName}-ImgPreSignFunc`, {
        functionName: `${props.appName}-ImgPreSignFunc`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        // code: Code.fromAsset('lambda'),
        entry: path.join(
            __dirname,
            './func/images/presign.ts'
        ),
        environment: {
            APP_NAME: props.appName,
            BUCKET_REGION: props.awsRegion, 
            BUCKET_NAME: props.imgUploadBucket.bucketName
        },
        role: props.lambdaRole
    });

    imagePreSignFunc.addToRolePolicy(new iam.PolicyStatement({
        actions: ['s3:*'],
        resources: [props.imgUploadBucket.bucketArn as string]
    }))
    
    
    

    // aws logs tail /aws/lambda/MPG-Prod-GenPosterFunc --follow
    const genPosterFunc = new NodejsFunction(scope, `${props.appName}-GenPosterFunc`, {
        functionName: `${props.appName}-GenPosterFunc`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        timeout: Duration.minutes(3),
        entry: path.join(
            __dirname,
            './func/gen-poster/poster.ts'
        ),
        environment: {
            APP_NAME: props.appName,
            BEDROCK_REGION: props.awsRegion, 
            BUCKET_NAME: props.imgUploadBucket.bucketName
        },
        role: props.lambdaRole
    })
    
    // props.posterBucket.grantPut(genPosterFunc)
    // props.posterBucket.grantWrite(genPosterFunc)
    // props.posterBucket.grantRead(genPosterFunc)

    genPosterFunc.addToRolePolicy(new iam.PolicyStatement({
        actions: [
            'bedrock:*',
            's3:*'
        ],
        resources: [
            props.posterBucket.bucketArn as string,
            "*"
        ]
    })) 

    new logs.LogGroup(scope, `${props.appName}-log-group`, {
        logGroupName: `/aws/lambda/${props.appName}-${props.stageName}`,
        retention: logs.RetentionDays.ONE_WEEK,
        removalPolicy: RemovalPolicy.DESTROY
    })

    return { pingFunc, imageUploadFunc, imagePreSignFunc, genPosterFunc }

}