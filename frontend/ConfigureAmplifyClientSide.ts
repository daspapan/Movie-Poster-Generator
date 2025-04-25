"use client";

import { Amplify } from "aws-amplify";
import { ResourcesConfig } from "@aws-amplify/core";
import cdkOutput from './cdk-outputs.json';

const output = cdkOutput[`MPG-Prod-Stack`]

console.log("MPG-Prod-Stack", output)

const config: ResourcesConfig = {
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || "",
            userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || "",
            identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || "",
            signUpVerificationMethod: "code"
        },
    },
}

Amplify.configure(config, {ssr: true})

export default function ConfigureAmplifyClientSide(){
    return null
}