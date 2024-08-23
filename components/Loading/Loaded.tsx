"use client"

import { useEffect, useState } from 'react';
import SmoothScroll from '../utils/smoothScroll';
import ImageScroll from '../Home/ScrollImage';
import LoadingScreen from './LoadingScreen';

const LOADED = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Handle the loading state
    useEffect(() => {
        const handleLoad = () => {
            // Check the actual images and set loading to false
            setIsLoading(false);
        };

        // Preload all images
        const preloadImages = async () => {
            const images = Array.from({ length: 358 }, (_, index) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = `/video/arm/${index + 1}.webp`;

                    img.onload = () => resolve(img);
                    img.onerror = () => reject(img);
                });
            });

            try {
                await Promise.all(images);
                handleLoad();
            } catch {
                handleLoad(); // Even if one image fails, we should proceed
            }
        };

        preloadImages();
    }, []);

    return (
        <section>
            {isLoading && <LoadingScreen imageFolder="/video/arm" totalFrames={358} />}
            <SmoothScroll>
                <div className="overflow-hidden bg-black">
                    {!isLoading && (
                        <ImageScroll imageFolder="/video/arm" totalFrames={358} containerHeight="100vh" />
                    )}
                </div>
            </SmoothScroll>
        </section>
    );
};

export default LOADED;
