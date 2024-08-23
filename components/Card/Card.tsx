"use client"

import './Card.css'
import React, { useState, useCallback } from 'react';

interface CardProps {
    title: string;
    content: string;
    color: string;
    icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, content, color, icon }) => {
    const [transform, setTransform] = useState<string>('rotateX(0deg) rotateY(0deg)');

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const { offsetWidth: width, offsetHeight: height } = e.currentTarget;
        const { left, top } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const rotateX = ((y / height) - 0.5) * 20;
        const rotateY = ((x / width) - 0.5) * -20;

        setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
        e.currentTarget.style.setProperty('--x', `${x}px`);
        e.currentTarget.style.setProperty('--y', `${y}px`);
        e.currentTarget.style.setProperty('--clr', color);
    }, [color]);

    const handleMouseLeave = useCallback(() => {
        setTransform('rotateX(0deg) rotateY(0deg)');
    }, []);

    return (
        <div
            className="card"
            style={{ '--transform': transform } as React.CSSProperties}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="card-gradient" />
            <div className="card-content flex flex-col justify-center h-full space-y-6">
                <div className='flex items-center gap-4'>
                    <div className="icon">{icon}</div>
                    <h2 className="title">{title}</h2>
                </div>
                <p className="description text-left">{content}</p>
            </div>
        </div>
    );
};

export default Card;
