import React from 'react';
import '../styles/login.css';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="login-bg-container">
            <div className="login-overlay" />
            {/* High-Fashion Vibrant Accents */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '60%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(225, 48, 108, 0.15) 0%, transparent 60%)',
                filter: 'blur(100px)',
                zIndex: 1
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '5%',
                width: '50%',
                height: '50%',
                background: 'radial-gradient(circle, rgba(131, 58, 180, 0.2) 0%, transparent 60%)',
                filter: 'blur(120px)',
                zIndex: 1
            }} />
            <div style={{
                position: 'absolute',
                top: '40%',
                right: '20%',
                width: '40%',
                height: '40%',
                background: 'radial-gradient(circle, rgba(64, 93, 230, 0.1) 0%, transparent 60%)',
                filter: 'blur(80px)',
                zIndex: 1
            }} />
        </div>
    );
};

export default AnimatedBackground;
