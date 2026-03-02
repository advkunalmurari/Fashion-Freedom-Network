
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, PlayCircle, Loader2 } from 'lucide-react';

export type PipelinePhase = 'INCEPTION' | 'CAPTURE' | 'POST_PROD' | 'DELIVERY';

interface ProjectPipelineProps {
    currentPhase: PipelinePhase;
    completionPercentage: number;
}

const PHASES: { id: PipelinePhase; label: string; description: string }[] = [
    { id: 'INCEPTION', label: 'Inception', description: 'Briefing & Moodboarding' },
    { id: 'CAPTURE', label: 'Capture', description: 'Production & Shooting' },
    { id: 'POST_PROD', label: 'Post-Prod', description: 'Editing & Retouching' },
    { id: 'DELIVERY', label: 'Delivery', description: 'Final Handoff' }
];

export const ProjectPipeline: React.FC<ProjectPipelineProps> = ({ currentPhase, completionPercentage }) => {
    const currentIdx = PHASES.findIndex(p => p.id === currentPhase);

    return (
        <div className="w-full bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl font-serif italic text-ffn-black">Project Pipeline</h3>
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-400">Real-time Delivery Protocol</p>
                </div>
                <div className="flex items-center space-x-3 bg-ffn-primary/5 px-4 py-2 rounded-xl border border-ffn-primary/10">
                    <Loader2 className="w-3 h-3 text-ffn-primary animate-spin" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-ffn-primary">{completionPercentage}% Complete</span>
                </div>
            </div>

            <div className="relative flex justify-between items-start">
                {/* Connector Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-50 z-0">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentIdx / (PHASES.length - 1)) * 100}%` }}
                        className="h-full bg-ffn-primary"
                    />
                </div>

                {PHASES.map((phase, idx) => {
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                        <div key={phase.id} className="relative z-10 flex flex-col items-center text-center space-y-4 max-w-[120px]">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white border-2 ${isCompleted ? 'border-ffn-primary text-ffn-primary shadow-lg shadow-ffn-primary/20' :
                                    isCurrent ? 'border-ffn-black text-ffn-black shadow-xl scale-110' :
                                        'border-gray-100 text-gray-300'
                                }`}>
                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                                    isCurrent ? <PlayCircle className="w-5 h-5 animate-pulse" /> :
                                        <Circle className="w-5 h-5" />}
                            </div>
                            <div className="space-y-1">
                                <p className={`text-[9px] font-black uppercase tracking-widest ${isCurrent ? 'text-ffn-black' : 'text-gray-400'}`}>
                                    {phase.label}
                                </p>
                                <p className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter hidden md:block leading-tight">
                                    {phase.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
