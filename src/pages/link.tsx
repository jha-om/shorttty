import Loading from "@/components/Loading";
import { useAuth } from "@/hooks/use-auth";
import { getClicks } from "@/utils/api-clicks";
import { getUrl } from "@/utils/api-urls";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Link = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, error: authError, loading: authLoading } = useAuth();

    const [error, setError] = useState<string | null>(null);
    const [urlData, setUrlData] = useState<any>(null);
    const [clicksForUrl, setClicksForUrl] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [loadingClicks, setLoadingClicks] = useState(false);

    useEffect(() => {
        const fetchUrl = async () => {
            if (!id || !user?.id) {
                console.log("missing id or user.id", { id, userId: user!.id });
                return;
            }

            try {
                setError(null);
                setLoading(true);
                if (!urlData) {
                    return <Loading />
                }
                const response = await getUrl(id, user.id);

                setUrlData(response);

            } catch (error) {
                console.error("failed to get long url with this id");
                setError(error instanceof Error ? error.message : "failed to get long url with this id");
            } finally {
                setLoading(false);
            }
        }
        fetchUrl();
    }, [id, user?.id]);

    useEffect(() => {
        const fetchUrlClicks = async () => {
            if (!id || !urlData) {
                return;
            }
            try {
                setError(null);
                setLoadingClicks(true);

                const response = await getClicks(id);

                setClicksForUrl(response || []);

            } catch (error) {
                console.error("failed to get long url with this id");
                setError(error instanceof Error ? error.message : "failed to get long url with this id");
            } finally {
                setLoadingClicks(false);
            }
        }
        fetchUrlClicks();
    }, [urlData, id]);

    if (loading || authLoading) {
        return <Loading />
    }

    if (authError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
                    <p className="text-gray-600 mb-4">{authError}</p>
                    <button
                        onClick={() => navigate('/auth')}
                        className="bg-[#e85d04] text-white px-4 py-2 rounded hover:bg-[#e85d04]/80"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (error && !urlData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Link Not Found</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#e85d04] text-white px-4 py-2 rounded hover:bg-[#e85d04]/80"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!urlData) {
        return <Loading />
    }

    const link = urlData?.custom_url || urlData?.short_url || [];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side - URL Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {urlData.title || 'Untitled Link'}
                        </h1>
                        <p className="text-[#e85d04] text-xl font-semibold">
                            shorttty.vercel.app/{link}
                        </p>
                        <p className="text-gray-400 break-all mt-2">
                            {urlData.original_url}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Created: {new Date(urlData.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    
                    {/* QR Code */}
                    {urlData.qr && (
                        <div className="text-center">
                            <img 
                                src={urlData.qr} 
                                alt="QR Code" 
                                className="mx-auto bg-white p-4 rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Right side - Analytics */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Analytics</h2>
                    
                    {loadingClicks ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e85d04] mx-auto"></div>
                            <p className="text-gray-400 mt-2">Loading analytics...</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-white text-lg mb-4">
                                Total Clicks: <span className="text-[#e85d04] font-bold">{clicksForUrl.length}</span>
                            </p>
                            
                            {clicksForUrl.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-white font-semibold">Recent Clicks:</h3>
                                    {clicksForUrl.slice(0, 10).map((click, index) => (
                                        <div key={index} className="bg-white/5 p-3 rounded border border-white/20">
                                            <p className="text-white text-sm">
                                                {click.city ? `${click.city}, ` : ''}{click.country || 'Unknown Location'}
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                {click.device || 'desktop'} • {new Date(click.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}



export default Link