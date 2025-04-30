import axios from "axios";

import cdkOutput from '@/../../cdk-outputs.json';
const output = cdkOutput[`MPG-Prod-Stack`]

console.log("[API-URL]",output.ApiUrl)

type PosterGenReqParams = {
    title?: string;
    description: string;
};

type PosterGenResParams = {
    success: boolean;
    message: string; 
    response?: object;
    posterUrl?: string | null;
}

export async function handlePosterGenerator({description}:PosterGenReqParams): Promise<PosterGenResParams> {

    try {
        // console.log('Just Showing Title: ', title);

        const response = await axios.post(`${output.ApiUrl}generate/poster`, {
            prompt: description
        },{
            headers: {
                'Content-Type': 'application/json',
            },
        })

        console.log("Response", response)
    
        return {
            success: true,
            message: response.data.message,
            posterUrl: response.data.posterUrl
        }
        
    } catch (error: unknown) {
        // throw error
        console.error(error);

        if(axios.isAxiosError(error)){
            return {
                success: false,
                message: `Error ${error.response?.data.message || 'Something when wrong.'}`,
                posterUrl: null
            }
        }else{
            return {
                success: false,
                message: error as string,
                posterUrl: null
            }

        }

        
    }
}


export async function handleSummeryGenerator({description}:PosterGenReqParams): Promise<PosterGenResParams> {

    try {
        // console.log('Just Showing Title: ', title);

        const response = await axios.post(`${output.ApiUrl}generate/summery`, {
            prompt: description
        },{
            headers: {
                'Content-Type': 'application/json',
            },
        })

        console.log("Response", response)
    
        return {
            success: true,
            message: response.data.message,
            response: response.data.response
        }
        
    } catch (error: unknown) {
        // throw error
        console.error(error);

        if(axios.isAxiosError(error)){
            return {
                success: false,
                message: `Error ${error.response?.data.message || 'Something when wrong.'}`,
                posterUrl: null
            }
        }else{
            return {
                success: false,
                message: error as string,
                posterUrl: null
            }

        }

        
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