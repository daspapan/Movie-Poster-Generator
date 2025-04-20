import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'

type CreateImagesBucketProps = {
    appName: string
    authenticatedRole: iam.IRole
}

export function createImagesBucket(
	scope: Construct,
	props: CreateImagesBucketProps
) {
	const fileStorageBucket = new s3.Bucket(scope, `${props.appName}-S3Bucket`, {
		cors: [
			{
				allowedMethods: [
					s3.HttpMethods.POST,
					s3.HttpMethods.PUT,
					s3.HttpMethods.GET,
					s3.HttpMethods.DELETE,
					s3.HttpMethods.HEAD,
				],
				allowedOrigins: ['*'],
				allowedHeaders: ['*'],
				exposedHeaders: [
					'x-amz-server-side-encryption',
					'x-amz-request-id',
					'x-amz-id-2',
					'ETag',
				],
			},
		],
	})

	// Let signed in users Upload on their own objects in a protected directory
	const canUpdateAndReadFromOwnProtectedDirectory = new iam.PolicyStatement({
		effect: iam.Effect.ALLOW,
		actions: ['s3:PutObject', 's3:GetObject'],
		resources: [
			`arn:aws:s3:::${fileStorageBucket.bucketName}/protected/\${cognito-identity.amazonaws.com:sub}/*`,
		],
	})

	new iam.ManagedPolicy(scope, 'SignedInUserManagedPolicy-test', {
		description: 'managed Policy to allow upload access to s3 bucket by signed in users.',
		statements: [canUpdateAndReadFromOwnProtectedDirectory],
		roles: [props.authenticatedRole],
	})

	return fileStorageBucket
}