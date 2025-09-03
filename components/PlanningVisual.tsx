import React, { useState, useEffect } from 'react';
import Loader from './Loader';

const planningSteps = [
    "Objective Received. Initializing Crew...",
    "Deconstructing Mission Goal...",
    "Analyzing Task Requirements...",
    "Allocating Agent Roles...",
    "Establishing Task Dependencies...",
    "Formulating Execution Plan...",
    "Finalizing Crew Manifest..."
];

const PlanningVisual: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= planningSteps.length - 1) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, 700);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full text-center p-4 animate-fadeInUp">
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Pulsing rings */}
                <div className="absolute w-full h-full rounded-full bg-primary/10 animate-pulse"></div>
                <div className="absolute w-2/3 h-2/3 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <Loader />
            </div>
            <h2 className="text-2xl font-semibold text-text-primary mt-8">Planning Mission</h2>
            <div className="mt-4 text-text-secondary w-full max-w-md h-6">
                <p key={currentStep} className="animate-fadeInUp text-sm">
                    {planningSteps[currentStep]}
                </p>
            </div>
        </div>
    );
};

export default PlanningVisual;
