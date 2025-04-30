"use client"

import Link from 'next/link';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FaSpinner, FaFileImage } from 'react-icons/fa';

interface PosterFormProps {
    title: string;
    isSubmitted: string;
    setIsSubmitted: Dispatch<SetStateAction<boolean>>;
    onGenerate: (description: string) =>  void;
}

const PosterForm = ({title, isSubmitted, setIsSubmitted, onGenerate}:PosterFormProps) => {

    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitted(true)
        onGenerate(description)
    }

    const default_text = [
        {
            title_text: "Generate image using AI",
            helping_text: "Create a stunning cinematic poster for a movie titled <q>[title]</q>. The plot is: <q>[description]</q>. Use vibrant colors and dramatic lighting.",
            button_text: "Generate Image"
        },{
            title_text: "Generate text using AI",
            helping_text: "Summarize the following text in a concise paragraph: \n\n[TEXT/PROMPT].",
            button_text: "Generate Summery Report"
        },
    ]

    return (
        <>
            <form 
                onSubmit={handleSubmit}
                className='space-y-4 bg-white p-6 rounded-xl shadow'
            >
                <h2 className='text-xl font-semibold'>
                    {title === "image" ? default_text[0].title_text : default_text[1].title_text}
                </h2>

                

                <textarea 
                    placeholder='Enter your prompt'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className='w-full border p-2 rounded'
                    required
                />

                <span className='w-full text-sm text-gray-700'><strong>Sample Text:</strong> {title === "image" ? default_text[0].helping_text : default_text[1].helping_text}</span>

                <br/>

                <button
                    type='submit'
                    className={`flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${isSubmitted === "true" ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitted === "true"}
                >
                    {isSubmitted === "true" ? (<FaSpinner className="spinner" />) : (<FaFileImage />)}
                    {title === "image" ? default_text[0].button_text : default_text[1].button_text}
                </button>

                <div className='text-sm font-bold text-gray-500 mt-4'>

                    <Link
                        className='text-blue-600 hover:underline'
                        href={`/${title === "text" ? "poster":"summery"}`}
                    >
                        Click Here 
                    </Link>
                    {' '}
                    to generate {title === "text" ? "poster":"summery"} using AI
                </div>

            </form>
        </>
    )
}

export default PosterForm