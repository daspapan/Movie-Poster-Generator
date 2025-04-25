"use client"

import { handlePosterGenerator } from '@/actions/posterGen.actions';
import PosterDisplay from '@/components/poster/PosterDisplay';
import PosterForm from '@/components/poster/PosterForm';
import React, { useState } from 'react';

const PosterPage = () => {

    const [ posterUrl, setPosterUrl ] = useState<string | null>(null)

    const generatePoster = async (title: string, description: string) => {
        const posterResponse = await handlePosterGenerator({title, description})
        console.log(posterResponse.message, posterResponse.posterUrl)
        setPosterUrl(posterResponse.posterUrl) // .data.posterUrl
    }

    return (
        <div className='min-h-screen p-6 bg-gray-100' >
            <div className='max-w-xl mx-auto'>
                <PosterForm onGenerate={generatePoster}/>
                <PosterDisplay imageUrl={posterUrl} />
            </div>
        </div>
    )
}

export default PosterPage