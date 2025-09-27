import { CopyIcon, DownloadIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";

interface ActionButtonsProps {
    loading: boolean,
    handleCopy: () => Promise<void>,
    downloadImage: () => void,
    handleDelete: () => Promise<void>,
}

export default function ActionButtons({ loading, handleCopy, downloadImage, handleDelete }: ActionButtonsProps) {
    return (
        <>
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
        </>
    )
}