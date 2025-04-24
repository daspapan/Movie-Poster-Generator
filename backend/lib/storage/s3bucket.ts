import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';

type CreateImagesBucketProps = {
    appName: string
}

export function createImagesBucket(
	scope: Construct,
	props: CreateImagesBucketProps
) {
	const fileStorageBucket = new s3.Bucket(scope, `${props.appName}-S3Bucket`, {
		publicReadAccess: true,
		// encryption: s3.BucketEncryption.S3_MANAGED,
		blockPublicAccess: new s3.BlockPublicAccess({
            blockPublicAcls: false,
            blockPublicPolicy: false,
            ignorePublicAcls: false,
            restrictPublicBuckets: false
		}),
		objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
		versioned: true,
		cors: [
			{
				allowedHeaders: ['*'],
				allowedMethods: [
					s3.HttpMethods.GET,
				],
				allowedOrigins: ['*'],
				exposedHeaders: [],
				maxAge: 3000,
			},
		],
		removalPolicy: cdk.RemovalPolicy.DESTROY,
		autoDeleteObjects: true,
	})


	return fileStorageBucket
}

export function createImgUploadBucket(
	scope: Construct,
	props: CreateImagesBucketProps
) {
	/* const fileStorageBucket = new s3.Bucket(scope, `${props.appName}-ImgUploader-S3Bucket`, {
		publicReadAccess: false,
		blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
		removalPolicy: cdk.RemovalPolicy.DESTROY,
		autoDeleteObjects: true,
	}) */

	// S3 Bucket
    const mediaBucket = new s3.Bucket(scope, `${props.appName}-MediaBucket`, {
		removalPolicy: cdk.RemovalPolicy.DESTROY,
		autoDeleteObjects: true,
		cors: [{
			allowedMethods: [
				s3.HttpMethods.GET,
				s3.HttpMethods.PUT,
				s3.HttpMethods.POST
			],
			allowedOrigins: ['*'],
			allowedHeaders: ['*']
		}]
	});
  
	// Lambda Role with S3 Access
	const lambdaRole = new iam.Role(scope, `${props.appName}-LambdaS3AccessRole`, {
		assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
	});
  
	lambdaRole.addManagedPolicy(
		iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
	);
  
	mediaBucket.grantReadWrite(lambdaRole);

	return {mediaBucket, lambdaRole}
}