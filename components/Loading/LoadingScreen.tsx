"use client";

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
    imageFolder: string;
    totalFrames: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ imageFolder, totalFrames }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const images = Array.from({ length: totalFrames }, (_, index) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = `${imageFolder}/${index + 1}.webp`;

                img.onload = () => {
                    resolve(img);
                };

                img.onerror = () => {
                    resolve(img);
                };
            });
        });

        let loadedImages = 0;

        const updateProgress = () => {
            loadedImages += 1;
            const percentage = Math.floor((loadedImages / totalFrames) * 100);
            setProgress(percentage);
            if (loadedImages === totalFrames) {
                setIsLoading(false);
            }
        };

        images.forEach(imagePromise => {
            imagePromise.then(updateProgress).catch(() => updateProgress());
        });

        // Cleanup function
        return () => {

        };
    }, [imageFolder, totalFrames]);

    return (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-[999] bg-black transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
            {isLoading && (
                <div className="text-white text-2xl">
                    <div className="mb-4">Loading... {progress}%</div>
                    <div className="w-full bg-gray-700 h-2 rounded">
                        <div
                            className="bg-green-500 h-full rounded"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoadingScreen;
