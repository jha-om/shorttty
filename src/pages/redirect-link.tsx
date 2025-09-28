import { storeClicks } from "@/utils/api-clicks";
import { getLongURL } from "@/utils/api-urls";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const RedirectLink = () => {
    const { id } = useParams();
    const [longUrl, setLongUrl] = useState<string>("");
    const [urlData, setUrlData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const [loadingStats, setLoadingStats] = useState(false);

    // getting the long url first;
    useEffect(() => {
        const fetchLongUrls = async () => {
            try {
                setError(null);
                setLoading(true);

                const response = await getLongURL(id || "")
                
                if (response && response.original_url) {   
                    setUrlData(response);
                    setLongUrl(response.original_url)
                } else {
                    console.error("No url found for this id: ", id);
                    setError("Url not found");
                }
            } catch (error) {
                console.error("failed to get long url with this id");
                setError(error instanceof Error ? error.message : "failed to get long url with this id");
            } finally {
                setLoading(false);
            }
        }
        if (id) {   
            fetchLongUrls();
        }
    }, [id]);

    // now getting the stats for that particular short_url
    useEffect(() => {
        const fetchStats = async () => {
            if (!urlData?.id || !longUrl) {
                return;
            }
            try {
                setError(null);
                setLoadingStats(true);

                await storeClicks({
                    id: urlData.id,
                    originalURL: longUrl
                })

                if (longUrl) {
                    window.location.href = longUrl;
                }

            } catch (error) {
                console.error("failed to get long url with this id");
                setError(error instanceof Error ? error.message : "failed to get long url with this id");
            } finally {
                setLoadingStats(false);
            }
        }
        fetchStats();
    }, [urlData, longUrl]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e85d04] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Redirecting...</p>
                </div>
            </div>
        )
    }

    if (error && !longUrl) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Link Not Found</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <a 
                        href="/"
                        className="bg-[#e85d04] text-white px-4 py-2 rounded hover:bg-[#e85d04]/80 transition-colors"
                    >
                        Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e85d04] mx-auto"></div>
                <p className="mt-4 text-gray-600">
                    {loadingStats ? "Processing redirect..." : "Redirecting to your destination..."}
                </p>
                {longUrl && (
                    <p className="mt-2 text-sm text-gray-500">
                        If you're not redirected automatically, 
                        <a 
                            href={longUrl} 
                            className="text-[#e85d04] hover:underline ml-1"
                        >
                            click here
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
}

export default RedirectLink