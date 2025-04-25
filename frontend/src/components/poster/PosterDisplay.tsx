"use client";

import Image from 'next/image';
import React from 'react'

interface PosterDisplayProps {
    imageUrl: string | null;
}

const PosterDisplay = ({imageUrl}:PosterDisplayProps) => {

    if(!imageUrl) return null;

    return (
        <div className='mt-6 text-center'>
            <h2 className='text-lg font-semibold mb-2'>Generated Poster</h2>
            <Image
                src={imageUrl}
                alt='Generated Poster'
                width={512} height={512}
                className='max-w-full mx-auto rounded shadow-lg'
            />
        </div>
    )
}

export default PosterDisplay