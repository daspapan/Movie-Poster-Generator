import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
// const path = require('path');
import path from 'path';

type CreateFunctionsProps = {
    appName: string;
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
        }
    });

    return { pingFunc }

}