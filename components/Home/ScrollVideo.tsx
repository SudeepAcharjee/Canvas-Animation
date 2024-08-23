"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';


interface ScrollVideoProps {
    videoSrc: string;
    className?: string;
    containerHeight?: string;
}

const ScrollVideo: React.FC<ScrollVideoProps> = ({
    videoSrc,
    className = '',
    containerHeight = '200vh',
}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const videoWrapperRef = useRef<HTMLDivElement | null>(null);
    const blackContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const videoElement = videoRef.current;
        const videoWrapper = videoWrapperRef.current;
        const container = containerRef.current;
        const blackContainer = blackContainerRef.current;

        if (!videoElement || !videoWrapper || !container || !blackContainer) return;

        videoElement.preload = 'auto'; // Preload the video

        const duration = videoElement.duration || 1;

        ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: `+=5000`,
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
                const progress = self.progress || 0;

                // Update the video playback until 50% scroll progress
                if (progress <= 0.5) {
                    videoElement.currentTime = progress * duration;
                }

                // Scaling and text appearance between 50% and 80% scroll progress
                if (progress > 0.5 && progress <= 0.8) {
                    const scaleProgress = (progress - 0.5) / 0.3; // Normalize progress between 0 and 1
                    const scale = 1 - scaleProgress * 0.8; // Scale from 1 to 0.2
                    const opacity = 1 - scaleProgress; // Fade out the video

                    // Calculate when text should start appearing
                    const textAppearanceProgress = (scaleProgress - 0.7) / 0.3;
                    const textOpacity = textAppearanceProgress < 0 ? 0 : textAppearanceProgress > 1 ? 1 : textAppearanceProgress;

                    gsap.to(videoWrapper, {
                        scale,
                        x: `calc(50vw - 15vw)`,
                        y: `calc(${container.offsetHeight}px - 75px)`,
                        borderRadius: '50%',
                        backgroundColor: 'black',
                        opacity,
                        duration: 0.1,
                        ease: 'power1.out',
                    });

                    // Show the black container with text when scaling has reached 70%
                    gsap.to(blackContainer, {
                        opacity: textOpacity, // Fade in the black container with text
                        duration: 0.1,
                        ease: 'power1.out',
                    });
                } else if (progress > 0.8) {
                    // Ensure the final state of scaling and text appearance
                    gsap.to(videoWrapper, {
                        scale: 0.2,
                        x: `calc(50vw - 15vw)`,
                        y: `calc(${container.offsetHeight}px - 75px)`,
                        borderRadius: '50%',
                        backgroundColor: 'black',
                        opacity: 0,
                        duration: 0.1,
                        ease: 'power1.out',
                    });

                    gsap.to(blackContainer, {
                        opacity: 1, // Ensure the black container is fully visible
                        duration: 0.1,
                        ease: 'power1.out',
                    });
                } else {
                    // Reset the video wrapper and black container if scrolling back up
                    gsap.to(videoWrapper, {
                        scale: 1,
                        x: 0,
                        y: 0,
                        borderRadius: '0%',
                        backgroundColor: 'transparent',
                        opacity: 1,
                        duration: 0.1,
                        ease: 'power1.in',
                    });

                    gsap.to(blackContainer, {
                        opacity: 0,
                        duration: 0.1,
                        ease: 'power1.in',
                    });
                }
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [containerHeight]);

    return (
        <div ref={containerRef} className={`relative h-[${containerHeight}] ${className}`}>
            <div
                ref={videoWrapperRef}
                className='flex items-center justify-center h-[100vh] md:h-screen'
                style={{
                    // transition: 'all 1s ease',
                    backgroundColor: 'transparent',
                    borderRadius: '0%',
                }}
            >
                <video ref={videoRef} className="w-full h-full object-cover">
                    <source src={videoSrc} type="video/mp4" />
                </video>
            </div>
            <div
                ref={blackContainerRef}
                className='absolute inset-0 flex items-center justify-center'
                style={{
                    backgroundColor: 'black',
                    opacity: 0, // Initially hidden
                    transition: 'opacity 0.1s ease',
                }}
            >
                <Image src='/images/logo.svg' alt='LOGO' width={0} height={0} className='w-[300px] h-[150px]' />
            </div>
            <button className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-black text-white rounded-full border border-white">
                Explore More
            </button>
        </div>
    );
};

export default ScrollVideo;
