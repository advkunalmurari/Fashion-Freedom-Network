import React, { useRef, useState } from 'react';
import { m } from 'framer-motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = "",
    onClick,
    strength = 0.5
}) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!boxRef.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = boxRef.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const pullX = (clientX - centerX) * strength;
        const pullY = (clientY - centerY) * strength;

        setPosition({ x: pullX, y: pullY });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div
            ref={boxRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="inline-block"
        >
            <m.div
                animate={{ x: position.x, y: position.y }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                onClick={onClick}
                className={className}
            >
                {children}
            </m.div>
        </div>
    );
};
