import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as logs from 'aws-cdk-lib/aws-logs'
// const path = require('path');
import path from 'path';
import { RemovalPolicy } from 'aws-cdk-lib';

type CreateFunctionsProps = {
    appName: string;
    stageName: string;
}


export function createFunctions(scope: Construct, props: CreateFunctionsProps){

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

    new logs.LogGroup(scope, `${props.appName}-log-group`, {
        logGroupName: `/aws/lambda/${props.appName}-${props.stageName}`,
        retention: logs.RetentionDays.ONE_WEEK,
        removalPolicy: RemovalPolicy.DESTROY
    })

    return { pingFunc }

}