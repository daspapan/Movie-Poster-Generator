'use client'

import { handleMediaPreSignURL, handleMediaUpload } from '@/actions/mediaUpload.actions';
import Image from 'next/image';
import React, { useState } from 'react'


const UploadForm = () => {

    const [file, setFile] = useState<File | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string>("")
    const [viewUrl, setViewUrl] = useState<string | null>("")

    const toBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String)
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const uploadFile = async () => {
        if(!file) return;

        setSubmitted(true)

        console.log("[:::FILE:::]", file)
        // { lastModified, lastModifiedDate, name, size, , type:"image/png"

        try {

            const base64String = await toBase64(file);
            // console.log(base64String)

            const filename = file.name as string;
            const filesize = file.size.toString();
            const filetype = file.type as string;

            const response = await handleMediaUpload({filename, filesize, filetype, fileContentBase64:base64String as string})

            console.log(response.message, response.filename);

            const url = await handleMediaPreSignURL({filename: response.filename}) 
            // "58122f82-339a-47a1-9f8c-32ae512a10a4_my_dear_01_file.png"
            
            // console.log("URL", url)
            setViewUrl(url)

        } catch (error: unknown) {

            console.error(error)
            setErrorMsg(error as string)

        } finally {
            setSubmitted(false)
        }
        /* const reader = new FileReader();
        reader.onloadend = async () => {
            const base65 = (reader.result as string).split(',')[1];
            
            reader.readAsDataURL(file)
        } */
    }


    return (
        <div className='p-6 space-y-4'>
            <h1>Media Uploader</h1>

            <input type='file' onChange={(e) => setFile(e.target.files?.[0] || null)} />

            <button 
                onClick={uploadFile} 
                className='bg-blue-500 text-white px-4 py-2 rounded'
                disabled={submitted}
            >
                    Upload
            </button>

            {errorMsg && <p>{errorMsg}</p>}

            {viewUrl && (
                <div className='mt-4'>
                    <p className='font-semibold'>Uploaded Media Preview:</p>
                    {file?.type.startsWith('image') ? (
                        <>
                            <Image src={viewUrl} alt='Uploaded' width={500} height={500} className='mt-2 max-w-xs border shadow-md' />

                            <a href={viewUrl} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>
                                View uploaded file
                            </a>
                        </>
                    ) : (
                        <a href={viewUrl} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>
                            View uploaded file
                        </a>
                    )}
                </div>
            )}

        </div>
    )
}

export default UploadForm
