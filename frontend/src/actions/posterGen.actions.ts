import axios from "axios";

import cdkOutput from '@/../../cdk-outputs.json';
const output = cdkOutput[`MPG-Prod-Stack`]

console.log("[API-URL]",output.ApiUrl)

type PosterGenReqParams = {
    title: string;
    description: string;
};

type PosterGenResParams = {
    message: string; 
    posterUrl: string;
}

export async function handlePosterGenerator({title, description}:PosterGenReqParams): Promise<PosterGenResParams> {

    try {

        const response = await axios.post(`${output.ApiUrl}generate`, {
            title, description
        },{
            headers: {
                'Content-Type': 'application/json',
            },
        })
    
        return {
            message: response.data.message,
            posterUrl: response.data.posterUrl
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