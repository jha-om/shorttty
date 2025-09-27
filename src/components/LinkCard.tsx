import type { Url } from "@/pages/dashboard"
import { deleteUrl } from "@/utils/api-urls"
import { useState } from "react"
import { Link } from "react-router-dom"
import ActionButtons from "./ActionButtons"
import { useUrlOperations } from "@/hooks/use-url-operations"
import StatusBanner from "./StatusBanner"

interface LinkCardProps {
    url: Url;
    onDelete?: (urlId: string) => void;
}

const LinkCard = ({ url, onDelete }: LinkCardProps) => {
    const {
        error,
        loading,
        isDeleted,
        copySuccess,
        downloadImage,
        handleCopy,
        handleDelete,
        clearError,
    } = useUrlOperations({ url, onDelete });

    if (isDeleted) {
        return null;
    }

    return (
        <div className="border border-white/20 bg-white/5 backdrop-blur-2xl rounded-lg overflow-hidden">
            {/* Error Banner - Full width at top */}
            <div className="p-4 pb-0">
                <StatusBanner
                    error={error}
                    copySuccess={copySuccess}
                    onClearError={clearError}
                />
            </div>

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
                        www.shorttty.vercel.app/{url.custom_url || url.short_url}
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
                    <ActionButtons
                        loading={loading}
                        handleCopy={handleCopy}
                        downloadImage={downloadImage}
                        handleDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    )
}

export default LinkCard