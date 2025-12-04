interface StepIndicatorProps {
    currentStep: 'upload' | 'convert' | 'download';
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { id: 'upload', label: '1. Upload', number: 1 },
        { id: 'convert', label: '2. Convert', number: 2 },
        { id: 'download', label: '3. Download', number: 3 },
    ];

    const currentIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        {/* Step Circle */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div
                                className={`
                  flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200
                  ${index <= currentIndex
                                        ? 'bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-soft-md'
                                        : 'bg-slate-100 text-slate-400'
                                    }
                `}
                            >
                                {step.number}
                            </div>
                            <span
                                className={`
                  text-xs sm:text-sm font-medium transition-colors hidden sm:inline
                  ${index <= currentIndex ? 'text-slate-900' : 'text-slate-400'}
                `}
                            >
                                {step.label}
                            </span>
                            {/* Mobile: Show only on current step */}
                            <span
                                className={`
                  text-xs font-medium transition-colors sm:hidden
                  ${index === currentIndex ? 'text-slate-900' : 'hidden'}
                `}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Arrow */}
                        {index < steps.length - 1 && (
                            <svg
                                className={`w-4 h-4 sm:w-6 sm:h-6 mx-2 sm:mx-4 transition-colors ${index < currentIndex ? 'text-brand-500' : 'text-slate-300'
                                    }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
