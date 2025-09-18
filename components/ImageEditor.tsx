import React, { useState, useCallback } from 'react';
import * as agentService from '../services/agentService';
import SparklesIcon from './icons/SparklesIcon';
import DownloadIcon from './icons/DownloadIcon';
import XIcon from './icons/XIcon';
import UploadIcon from './icons/UploadIcon';

const ImageEditor: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('Make the background a vibrant cyberpunk city at night.');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [baseImage, setBaseImage] = useState<{ url: string, data: string, mimeType: string } | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                const base64Data = result.split(',')[1];
                setBaseImage({
                    url: result,
                    data: base64Data,
                    mimeType: file.type,
                });
                setEditedImageUrl(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleEdit = useCallback(async () => {
        if (!prompt || !baseImage || isLoading) return;
        setIsLoading(true);
        setError(null);
        setEditedImageUrl(null);

        try {
            const base64Bytes = await agentService.editImage(baseImage.data, baseImage.mimeType, prompt);
            setEditedImageUrl(`data:image/png;base64,${base64Bytes}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt, baseImage, isLoading]);

    const handleDownload = () => {
        if (!editedImageUrl) return;
        const link = document.createElement('a');
        link.href = editedImageUrl;
        link.download = 'crewai-edited-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="h-full w-full flex flex-col md:flex-row gap-6">
            {/* Controls & Input Image */}
            <div className="md:w-1/3 flex flex-col gap-4">
                <div className="font-semibold text-text-primary">
                    1. Upload Image
                </div>
                <div className="flex-1 flex flex-col items-center justify-center bg-surface border-2 border-dashed border-border rounded-xl shadow-inner p-4 relative aspect-square group">
                    {baseImage ? (
                        <>
                           <img src={baseImage.url} alt="Input" className="w-full h-full object-contain rounded-lg" />
                           <label htmlFor="image-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl">
                               Change Image
                           </label>
                        </>
                    ) : (
                         <label htmlFor="image-upload" className="flex flex-col items-center justify-center text-center text-text-secondary cursor-pointer">
                            <UploadIcon className="h-10 w-10 mb-4 opacity-50"/>
                            <p className="font-semibold">Click to upload</p>
                            <p className="text-xs mt-1">PNG, JPG, WEBP, etc.</p>
                        </label>
                    )}
                     <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
                 <div className="font-semibold text-text-primary mt-2">
                    2. Describe Your Edit
                </div>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Add a futuristic helmet to the person."
                    className="w-full bg-surface border-2 border-border rounded-xl p-3 resize-none focus:outline-none focus:ring-0 focus:border-primary/50 placeholder-text-secondary/80 text-sm transition-all duration-200 shadow-inner"
                    rows={4}
                    disabled={isLoading}
                />
                <button
                    onClick={handleEdit}
                    disabled={isLoading || !prompt.trim() || !baseImage}
                    className="w-full flex items-center justify-center gap-2 bg-cta text-white font-bold text-base py-3 px-4 rounded-lg transition-all duration-200 hover:brightness-110 active:scale-95 shadow-md hover:shadow-lg hover:shadow-glow-cta disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SparklesIcon className="h-5 w-5" />
                    <span>{isLoading ? 'Applying Edit...' : 'Apply Edit'}</span>
                </button>
            </div>
            
             {/* Output */}
            <div className="flex-1 flex flex-col items-center justify-center bg-surface border border-border rounded-xl shadow-inner p-4 relative aspect-square">
                 {isLoading && (
                    <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center rounded-xl animate-pulse">
                        <SparklesIcon className="h-12 w-12 text-primary opacity-75" />
                        <p className="mt-4 text-text-secondary">Working on your masterpiece...</p>
                    </div>
                )}
                {error && !isLoading && (
                    <div className="text-center text-error">
                        <XIcon className="h-10 w-10 mx-auto mb-2" />
                        <p className="font-semibold">Editing Failed</p>
                        <p className="text-xs mt-1">{error}</p>
                    </div>
                )}
                {editedImageUrl && !isLoading && (
                    <>
                        <img
                            src={editedImageUrl}
                            alt="Edited by AI"
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                            onClick={handleDownload}
                            className="absolute bottom-4 right-4 flex items-center gap-2 text-sm font-semibold text-primary bg-surface/80 backdrop-blur-sm px-3 py-2 rounded-md hover:bg-background transition-colors border border-border active:scale-95"
                        >
                            <DownloadIcon className="h-5 w-5" />
                            <span>Download</span>
                        </button>
                    </>
                )}
                 {!editedImageUrl && !isLoading && !error && (
                     <div className="text-center text-text-secondary">
                        <SparklesIcon className="h-12 w-12 mx-auto mb-4 opacity-50"/>
                        <p>Your edited image will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageEditor;
