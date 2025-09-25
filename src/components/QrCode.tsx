import { useEffect, useRef, useState } from 'react';

interface QrCodeProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    className?: string;
}

export default function QrCode({ 
    value, 
    size = 200, 
    bgColor = '#ffffff',
    className = ''
}: QrCodeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Simple QR Code generator using QR Server API
    const generateQRCode = async () => {
        if (!value || !value.trim()) {
            setError('No value provided');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Set canvas size
            canvas.width = size;
            canvas.height = size;

            // Create QR code URL using QR Server API (free service)
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(value)}&size=${size}x${size}&bgcolor=${bgColor.replace('#', '')}&format=png&ecc=M`;

            // Create image and draw on canvas
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                // Clear canvas
                ctx.clearRect(0, 0, size, size);
                
                // Draw background
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, size, size);
                
                // Draw QR code
                ctx.drawImage(img, 0, 0, size, size);
                
                setIsLoading(false);
            };

            img.onerror = () => {
                setError('Failed to generate QR code');
                setIsLoading(false);
            };

            img.src = qrUrl;

        } catch (error) {
            console.error('QR Code generation error:', error);
            setError('Failed to generate QR code');
            setIsLoading(false);
        }
    };

    // Generate QR code when value changes
    useEffect(() => {
        if (value && value.trim()) {
            generateQRCode();
        }
    }, [value, size, bgColor]);

    // Download QR code function
    const downloadQR = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    // Copy QR code as image
    const copyQR = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            canvas.toBlob((blob) => {
                if (blob) {
                    const item = new ClipboardItem({ 'image/png': blob });
                    navigator.clipboard.write([item]);
                }
            });
        } catch (error) {
            console.error('Failed to copy QR code:', error);
        }
    };

    if (!value || !value.trim()) {
        return (
            <div 
                className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
                style={{ width: size, height: size }}
            >
                <p className="text-gray-500 text-sm text-center px-4">
                    Enter a URL to generate QR code
                </p>
            </div>
        );
    }

    return (
        <div className={`relative group ${className}`}>
            {/* QR Code Canvas */}
            <canvas
                ref={canvasRef}
                className="rounded-lg shadow-lg border-2 border-white/20 bg-white"
                style={{ width: size, height: size }}
            />

            {/* Loading Overlay */}
            {isLoading && (
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg"
                    style={{ width: size, height: size }}
                >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e85d04]"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg border-2 border-red-200"
                    style={{ width: size, height: size }}
                >
                    <p className="text-red-500 text-sm text-center px-4">{error}</p>
                </div>
            )}

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <button
                    onClick={downloadQR}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                    title="Download QR Code"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </button>
                <button
                    onClick={copyQR}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                    title="Copy QR Code"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
            </div>

            {/* QR Code Info */}
            <div className="mt-2 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate" style={{ maxWidth: size }}>
                    {value}
                </p>
            </div>
        </div>
    );
}