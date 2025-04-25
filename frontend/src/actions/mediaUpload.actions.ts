import axios from "axios";

import cdkOutput from '@/../../cdk-outputs.json';
const output = cdkOutput[`MPG-Prod-Stack`]

console.log("[API-URL]",output.ApiUrl)

type MediaUploadParameters = {
    filename: string;
    filesize: string;
    filetype: string;
    fileContentBase64: string;
};

type MediaUploadResponse = {
    message: string; 
    filename: string;
}

export async function handleMediaUpload({filename, filesize, filetype, fileContentBase64}:MediaUploadParameters): Promise<MediaUploadResponse> {

    try {

        const response = await axios.post(`${output.ApiUrl}images/upload`, {
            filename,
            filesize,
            filetype,
            fileContentBase64
        },{
            headers: {
                'Content-Type': 'application/json',
                // Add any other custom headers your API Gateway expects
                // 'YourCustomHeader': 'HeaderValue'
            },
        })
        console.log("Upload successful...")
    
        return {
            message: "File upload successful",
            filename: response.data.filename
        }
        
    } catch (error) {
        throw error
    }
}


export async function handleMediaPreSignURL({filename}:{filename:string}): Promise<string | null> {

    try {

        const url = `${output.ApiUrl}images/view?filename=${encodeURIComponent(filename)}`
        console.log("presign url:",url)

        const response = await axios.get(url)
        console.log(response.data.url)

        return response.data.url
        
    } catch (error) {
        throw error
    }

}