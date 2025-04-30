"use client"

import { handleSummeryGenerator } from '@/actions/posterGen.actions';

import PosterForm from '@/components/poster/PosterForm';
import React, { useState } from 'react';

const PosterPage = () => {

    const [summery, setSummery ] = useState<string | null>(null)
    const [error, setError] = useState<string>("");
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const generatePoster = async (description: string) => {
        const summeryResponse = await handleSummeryGenerator({description})
        
        if(summeryResponse.success){
            setError("")
            setSummery(JSON.stringify(summeryResponse.response))
        }else{
            setSummery(null)
            setError(summeryResponse.message)
        }

        setIsSubmitted(false)

    }

    return (
        <div className='min-h-screen p-6 bg-gray-100' >
            <div className='max-w-xl mx-auto'>
                <PosterForm 
                    title="text"
                    isSubmitted={`${isSubmitted}`}
                    setIsSubmitted={setIsSubmitted}
                    onGenerate={generatePoster}
                />

                {summery && (<p>{summery}</p>)}
                
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