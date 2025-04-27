"use client"

import { handlePosterGenerator } from '@/actions/posterGen.actions';
import PosterDisplay from '@/components/poster/PosterDisplay';
import PosterForm from '@/components/poster/PosterForm';
import React, { useState } from 'react';

const PosterPage = () => {

    const [ posterUrl, setPosterUrl ] = useState<string | null>(null)
    const [error, setError] = useState<string>("");

    const generatePoster = async (description: string) => {
        const posterResponse = await handlePosterGenerator({description})
        // console.log(posterResponse)
        if(posterResponse.success){
            setError("")
            setPosterUrl(posterResponse.posterUrl || null) // .data.posterUrl
        }else{
            setError(posterResponse.message)
        }
    }

    return (
        <div className='min-h-screen p-6 bg-gray-100' >
            <div className='max-w-xl mx-auto'>
                <PosterForm onGenerate={generatePoster}/>
                <PosterDisplay imageUrl={posterUrl} />
                {error && 
                    (<div className='mt-6 text-center'>
                        <h4 className='text-lg font-semibold mb-2 text-red-500'>{error}</h4>
                    </div>)
                }
            </div>
        </div>
    )
}

export default PosterPage