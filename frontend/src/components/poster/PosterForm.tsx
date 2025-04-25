"use client"

import React, { useState } from 'react'

interface PosterFormProps {
    onGenerate: (title: string, description: string) =>  void;
}

const PosterForm = ({onGenerate}:PosterFormProps) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onGenerate(title, description)
    }

    return (
        <>
            <form 
                onSubmit={handleSubmit}
                className='space-y-4 bg-white p-6 rounded-xl shadow'
            >
                <h2 className='text-xl font-semibold'>
                    Create a Poster
                </h2>

                <input 
                    type='text'
                    placeholder='Enter poster title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='w-full border p-2 rounded'
                    required
                />

                <textarea 
                    placeholder='Enter poster description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className='w-full border p-2 rounded'
                    required
                />

                <button
                    type='submit'
                    className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
                >
                    Generate Poster
                </button>
            </form>
        </>
    )
}

export default PosterForm