import type { Url } from "@/pages/dashboard";
import { useState } from "react";

export interface UseUrlOperationsProps {
    url: Url,
    onDelete?: (urlId: string) => void;
}

export const useUrlOperations = ({ url, onDelete }: UseUrlOperationsProps) => {
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
            
            const { deleteUrl } = await import("@/utils/api-urls");
            await deleteUrl(url.id);

            setIsDeleted(true);
            onDelete?.(url.id);

            if (!onDelete) {
                window.location.href = '/dashboard'
            }
        } catch (error) {
            console.error("Error while deleting URL:", error);
            setError(error instanceof Error ? error.message : "Failed to delete the URL");
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        error,
        loading,
        isDeleted,
        copySuccess,
        downloadImage,
        handleCopy,
        handleDelete,
        clearError,
        setError,
    }
}