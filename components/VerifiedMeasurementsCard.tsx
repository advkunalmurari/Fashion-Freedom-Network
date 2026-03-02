import React from 'react';
import { ARMeasurementBadge } from './ARMeasurementBadge';
import { ARBodyMeasurements } from '../types';

interface VerifiedMeasurementsCardProps {
    measurements: ARBodyMeasurements;
    className?: string;
}

/**
 * A dedicated card component for displaying AR-verified measurements.
 * Wraps the expanded mode of ARMeasurementBadge for a consistent profile experience.
 */
const VerifiedMeasurementsCard: React.FC<VerifiedMeasurementsCardProps> = ({
    measurements,
    className = ''
}) => {
    return (
        <div className={`verified-measurements-card ${className}`}>
            <ARMeasurementBadge measurements={measurements} expanded />
        </div>
    );
};

export default VerifiedMeasurementsCard;
