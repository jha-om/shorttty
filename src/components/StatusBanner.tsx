interface StatusBannerProps {
    error?: string | null;
    copySuccess?: boolean,
    onClearError?: () => void;
}

const StatusBanner = ({ error, copySuccess, onClearError }: StatusBannerProps) => {
    if (!error && !copySuccess) {
        return null;
    }

    return (
        <>
            {error && (
                <div className="bg-red-500/10 border-b border-red-500/20 p-3">
                    <p className="text-red-400 text-sm flex items-center gap-2">
                        <span className="text-red-500">⚠</span>
                        {error}
                        <button
                            onClick={onClearError}
                            className="ml-auto text-red-400 hover:text-red-300"
                        >
                            ✕
                        </button>
                    </p>
                </div>
            )}

            {copySuccess && (
                <div className="bg-green-500/10 border-b border-green-500/20 p-3">
                    <p className="text-green-400 text-sm flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        URL copied to clipboard!
                    </p>
                </div>
            )}
        </>
    )
}

export default StatusBanner;