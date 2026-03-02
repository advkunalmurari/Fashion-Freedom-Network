import React, { useRef, useEffect } from 'react';
import { Play } from 'lucide-react';

interface ExploreVideoTileProps {
    src: string;
}

export const ExploreVideoTile: React.FC<ExploreVideoTileProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current?.play().catch(() => { });
                    } else {
                        videoRef.current?.pause();
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative group">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
            />
            <div className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-3 h-3 fill-white" />
            </div>
        </div>
    );
};
