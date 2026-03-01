import React from 'react';
import '../styles/login.css';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="login-bg-container">
            <div className="login-overlay" />
            {/* High-Fashion Vibrant Accents - Optimized for Mobile Performance */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 40% 40%, rgba(225, 48, 108, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(131, 58, 180, 0.2) 0%, transparent 40%), radial-gradient(circle at 60% 40%, rgba(64, 93, 230, 0.1) 0%, transparent 40%)',
                zIndex: 1
            }} />
        </div>
    );
};

export default AnimatedBackground;
