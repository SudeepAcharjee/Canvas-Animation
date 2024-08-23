"use client";

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from "next/link";

interface ScrollImageProps {
    imageFolder: string;
    totalFrames: number;
    className?: string;
    containerHeight?: string;
}

const ImageScroll: React.FC<ScrollImageProps> = ({
    imageFolder,
    totalFrames,
    className = '',
    containerHeight = '200vh',
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const blackContainerRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Preload images
        const loadImages = async () => {
            const imgPromises = Array.from({ length: totalFrames }, (_, index) => {
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.src = `${imageFolder}/${index + 1}.webp`;
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                });
            });

            try {
                const loadedImages = await Promise.all(imgPromises);
                setImages(loadedImages);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to load images:', error);
                setIsLoading(false);
            }
        };

        loadImages();
    }, [imageFolder, totalFrames]);

    useEffect(() => {
        if (isLoading || !images.length) return;

        gsap.registerPlugin(ScrollTrigger);
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const blackContainer = blackContainerRef.current;
        const buttonElement = buttonRef.current;

        if (!canvas || !container || !blackContainer || !buttonElement) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawImage = (img: HTMLImageElement) => {
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgAspect = img.width / img.height;
            const canvasAspect = canvasWidth / canvasHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasAspect > imgAspect) {
                drawWidth = canvasWidth;
                drawHeight = drawWidth / imgAspect;
                offsetX = 0;
                offsetY = (canvasHeight - drawHeight) / 2;
            } else {
                drawHeight = canvasHeight;
                drawWidth = drawHeight * imgAspect;
                offsetX = (canvasWidth - drawWidth) / 2;
                offsetY = 0;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        const totalScrollLength = totalFrames * 20;

        const updateFrame = (progress: number) => {
            const frameIndex = Math.ceil(progress * totalFrames) - 1;
            if (frameIndex >= 0 && frameIndex < images.length) {
                drawImage(images[frameIndex]);
            }
        };

        ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: `+=${totalScrollLength}`,
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
                const progress = self.progress || 0;

                // Update frame based on scroll progress
                updateFrame(progress);

                if (progress <= 1) {
                    const scaleProgress = Math.min((progress - 0.5) / 0.3, 1);
                    const opacity = 1 - scaleProgress;

                    const textAppearanceProgress = (scaleProgress - 0.7) / 0.3;
                    const textOpacity = textAppearanceProgress < 0 ? 0 : textAppearanceProgress > 1 ? 1 : textAppearanceProgress;

                    gsap.to(blackContainer, {
                        opacity: textOpacity,
                        duration: 0.1,
                        ease: 'power1.out',
                    });

                    gsap.to(buttonElement, {
                        opacity: progress > 0.9 ? 1 : 0,
                        y: progress > 0.9 ? 0 : 50,
                        duration: 0.3,
                        ease: 'power1.out',
                    });
                } else {
                    gsap.to(blackContainer, {
                        opacity: 1,
                        duration: 0.1,
                        ease: 'power1.out',
                    });

                    gsap.to(buttonElement, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        ease: 'power1.out',
                    });
                }
            },
        });

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [images, isLoading, totalFrames]);

    return (
        <div ref={containerRef} className={`relative h-[${containerHeight}] ${className}`}>
            {isLoading ? (
                <div className='flex items-center justify-center h-full'>
                    <div className='text-white text-2xl'>Loading...</div>
                </div>
            ) : (
                <canvas ref={canvasRef} className='absolute inset-0 object-cover' />
            )}
            <div
                ref={blackContainerRef}
                className='absolute inset-0 flex items-center justify-center'
                style={{
                    backgroundColor: 'black',
                    opacity: 0,
                    transition: 'opacity 0.1s ease',
                }}
            >
                <span className='text-white text-3xl'>
                    <img src='/images/logo.svg' alt='LOGO' width={300} height={150} />
                </span>
            </div>
            <button
                ref={buttonRef}
                className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-black text-white rounded-full border border-white opacity-0"
            >
                <Link href='#explore'>Explore More</Link>
            </button>
        </div>
    );
};

export default ImageScroll;
