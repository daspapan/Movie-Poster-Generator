/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.s3.ap-south-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: '*.execute-api.ap-south-1.amazonaws.com', // Replace with your region if needed
            }
        ]
    }
};

export default nextConfig;
