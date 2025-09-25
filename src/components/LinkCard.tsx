import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { CopyIcon, DownloadIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { deleteUrl } from "@/utils/api-urls"
import type { Url } from "@/pages/dashboard"

interface LinkCardProps {
    url: Url;
    onDelete?: (urlId: string) => void;
}

const LinkCard = ({ url, onDelete }: LinkCardProps) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const downloadImage = () => {
        const imageUrl = url.qr || '';
        const fileName = url.title || 'qr-code';

        const anchor = document.createElement("a");
        anchor.href = imageUrl;
        anchor.download = fileName;

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const handleCopy = async () => {
        try {
            const shortUrl = `https://shorttty.vercel.app/${url.custom_url || url.short_url}`;
            await navigator.clipboard.writeText(shortUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
        } catch (error) {
            console.error("Failed to copy URL:", error);
            setError("Failed to copy URL");
        }
    }

    const handleDelete = async () => {
        // Add confirmation dialog
        if (!confirm('Are you sure you want to delete this URL? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            await deleteUrl(url.id);

            setIsDeleted(true);
            onDelete?.(url.id);
        } catch (error) {
            console.error("Error while deleting URL:", error);
            setError(error instanceof Error ? error.message : "Failed to delete the URL");
        } finally {
            setLoading(false);
        }
    }

    if (isDeleted) {
        return null;
    }

    return (
        <div className="border border-white/20 bg-white/5 backdrop-blur-2xl rounded-lg overflow-hidden">
            {/* Error Banner - Full width at top */}
            {error && (
                <div className="bg-red-500/10 border-b border-red-500/20 p-3">
                    <p className="text-red-400 text-sm flex items-center gap-2">
                        <span className="text-red-500">⚠</span>
                        {error}
                        <button 
                            onClick={() => setError(null)}
                            className="ml-auto text-red-400 hover:text-red-300"
                        >
                            ✕
                        </button>
                    </p>
                </div>
            )}

            {/* Copy Success Banner */}
            {copySuccess && (
                <div className="bg-green-500/10 border-b border-green-500/20 p-3">
                    <p className="text-green-400 text-sm flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        URL copied to clipboard!
                    </p>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-5 p-4">
                {/* QR Code Section */}
                <div className="flex-shrink-0">
                    <img
                        src={url.qr}
                        alt="QR code"
                        className="h-32 w-32 object-contain ring-2 ring-[#e85d04] rounded-lg bg-white p-2"
                    />
                </div>

                {/* Content Section */}
                <Link to={`/link/${url.id}`} className="flex flex-col flex-1 min-w-0">
                    <span className="text-2xl lg:text-3xl font-extrabold hover:underline cursor-pointer text-white truncate">
                        {url.title || 'Untitled'}
                    </span>
                    <span className="sm:text-lg md:text-[19px] lg:text-2xl text-[#e85d04] font-bold hover:underline cursor-pointer transition-all duration-300 truncate">
                        www.shorttty.vercel.in/{url.custom_url || url.short_url}
                    </span>
                    <span className="flex items-center gap-1 hover:underline cursor-pointer text-gray-300 break-all">
                        {url.original_url}
                    </span>
                    <span className="flex items-end font-extralight text-sm text-gray-400 mt-auto pt-2">
                        {new Date(url.created_at).toLocaleString()}
                    </span>
                </Link>

                {/* Action Buttons - Properly aligned */}
                <div className="flex flex-row gap-2 max-w-fit">
                    <Button
                        variant="ghost"
                        onClick={handleCopy}
                        title="Copy short URL"
                        className="h-10 w-10 p-0 hover:bg-blue-500/10"
                        disabled={loading}
                    >
                        <CopyIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={downloadImage}
                        title="Download QR Code"
                        className="h-10 w-10 p-0 hover:bg-green-500/10"
                        disabled={loading}
                    >
                        <DownloadIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleDelete}
                        disabled={loading}
                        title="Delete URL"
                        className="h-10 w-10 p-0 hover:bg-red-500/10 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Trash2Icon className="h-4 w-4 text-red-500" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default LinkCard