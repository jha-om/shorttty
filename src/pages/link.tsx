import Loading from "@/components/Loading";
import StatusBanner from "@/components/StatusBanner";
import { useAuth } from "@/hooks/use-auth";
import { useUrlOperations } from "@/hooks/use-url-operations";
import { getUrl } from "@/utils/api-urls";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type Click, type Url } from "./dashboard";
import ActionButtons from "@/components/ActionButtons";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { getClicks } from "@/utils/api-clicks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Location from "@/components/Location";

export default function Link() {
    const { id } = useParams();
    const { user, loading: authLoading, error: authError } = useAuth();
    const navigate = useNavigate();

    const [urlData, setUrlData] = useState<Url>();
    const [loading, setLoading] = useState(false);
    const [clicksData, setClicksData] = useState<Click[]>([]);
    const [loadingClicks, setLoadingClicks] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const urlOperations = useUrlOperations({
        url: urlData as Url,
        onDelete: () => navigate('/dashboard')
    });

    useEffect(() => {
        const fetchUrl = async () => {
            if (!id || !user?.id) {
                navigate('/dashboard');
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await getUrl(id, user.id);

                setUrlData(response);
            } catch (error) {
                console.error("failed to get the url data", error);
                setError(error instanceof Error ? error.message : "failed to get the url data");
            } finally {
                setLoading(false);
            }
        }
        fetchUrl();
    }, [id, user?.id, navigate]);

    useEffect(() => {
        const fetchClicks = async () => {
            if (!id) {
                navigate('/dashboard');
                return;
            }

            try {
                setLoadingClicks(true);
                setError(null);

                const response = await getClicks(id);

                setClicksData(response || []);
            } catch (error) {
                console.error("failed to get the url clicks info", error);
                setError(error instanceof Error ? error.message : "failed to get url clicks info");
            } finally {
                setLoadingClicks(false);
            }
        }
        fetchClicks();
    }, [id, navigate]);

    if (loading || authLoading) {
        return (
            <Loading />
        )
    }

    if (authError) {
        return (
            <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
                    <p className="text-gray-600"></p>
                    <button
                        onClick={() => navigate('/auth')}
                        className="bg-[#e85d04] text-white px-4 py-2 rounded hover:bg-[#e85d04]/80"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
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

    const link = urlData.custom_url || urlData.short_url || '';
    const original_url = urlData.original_url;

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
            {/* status banner */}
            <StatusBanner
                error={urlOperations?.error}
                copySuccess={urlOperations?.copySuccess}
                onClearError={urlOperations?.clearError}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 transition">
                {/* left side */}
                <div className="flex flex-col justify-between min-h-[calc(100vh-210px)] border border-white/20 bg-white/5 backdrop-blur-2xl p-5 rounded-lg overflow-hidden">
                    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-lg border py-6 shadow-sm overflow-hidden p-5">
                        {/* title - big text */}
                        <div className="p-2 space-y-4">
                            <h1 className="text-2xl sm:text-3xl text-white font-bold mb-2 leading-tight">
                                {urlData.title || "Untitled Link"}
                            </h1>
                            {/* trimmed url - medium text */}

                            <div className="flex items-center justify-between gap-2 text-[#e85d04] border border-white/5 bg-white/5 rounded-lg relative p-3 sm:text-sm md:text-xl lg:text-2xl font-semibold">
                                <span className="text-sm sm:text-base md:text-lg font-semibold truncate flex-1 pr-[26px]">shorttty.vercel.app/{link}</span>
                                <div className="absolute right-2">
                                    <Button
                                        variant="ghost"
                                        onClick={urlOperations.handleCopy}
                                        title="Copy short URL"
                                        className="h-10 w-10 p-0 hover:bg-blue-500/10"
                                        disabled={loading}
                                    >
                                        <CopyIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* original url - normal text */}
                            <p className="mt-4">
                                {original_url.charAt(original_url.length - 1) === '/' ? original_url.slice(0, original_url.length - 1) : original_url}
                            </p>
                            {/* created at - normal text */}
                            <p className="text-gray-400 break-all mt-2 text-sm">
                                Created: {new Date(urlData.created_at).toLocaleString()}
                            </p>

                        </div>
                    </div>
                    <div className="p-6 pt-0 text-center space-y-4">
                        {/* qr show */}
                        <div className="text-center">
                            {/* copy download delete buttons */}
                            {urlData.qr && (
                                <>
                                    <img src={urlData.qr}
                                        alt="QR code"
                                        // className="max-w-[200px] bg-white object-contain ring-2 ring-[#e85d04] rounded-lg p-2"
                                        className="w-64 h-5w-64 bg-white object-contain ring-2 ring-[#e85d04] rounded-lg p-3 mx-auto"
                                    />
                                    <p className="text-xs text-gray-400 mt-2">Scan to visit link</p>
                                </>
                            )}
                            <div className="flex gap-2 mt-4 mb-2 justify-center">
                                <ActionButtons
                                    loading={urlOperations?.loading}
                                    downloadImage={urlOperations?.downloadImage}
                                    handleCopy={urlOperations?.handleCopy}
                                    handleDelete={urlOperations?.handleDelete}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                {/* right side */}
                <div className="min-h-[calc(100vh-210px)] border border-white/20 backdrop-blur-2xl p-5 rounded-lg overflow-hidden space-y-6">
                    <Card className="bg-transparent border-none">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-4xl font-extrabold text-white">Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col justify-center">
                            {loadingClicks ? (
                                <div className="flex justify-center items-center min-h-[400px]">
                                    <Loading />
                                </div>
                            ) : clicksData && clicksData.length ? (
                                <div className="space-y-4">
                                    {/* showing total clicks */}
                                    <div className="text-center mb-6">
                                        <p className="text-white text-2xl font-bold">
                                            Total Clicks: <span className="text-[#e85d04]">{clicksData.length}</span>
                                        </p>
                                    </div>
                                    {/* content of those clicks */}
                                    <div className="space-y-3">
                                        {clicksData.map((click, i) => (
                                            <div key={click.id || i} className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium">
                                                            📍 {click.city ? `${click.city}, ` : ''}{click.country || 'Unknown Location'}
                                                        </p>
                                                        <p className="text-gray-400 text-sm mt-1">
                                                            📱 {click.device || 'desktop'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gray-300 text-xs">
                                                            {new Date(click.created_at).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-gray-400 text-xs">
                                                            {new Date(click.created_at).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {clicksData.length > 5 && (
                                        <p className="text-center text-gray-400 text-sm mt-4">
                                            Showing all {clicksData.length} clicks • Scroll to see more
                                        </p>
                                    )}
                                    {/* location info line chart */}
                                    <div className="backdrop-blur-2xl">
                                        <Location clicksData={clicksData.filter(click => click.city && click.country).map(click => ({
                                            city: click.city!,
                                            country: click.country!,
                                            device: click.device || 'desktop',
                                            created_at: click.created_at
                                        }))} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center min-h-[400px]"> {/* ✅ Same height */}
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                            📊
                                        </div>
                                        <p className="text-gray-400 text-lg">No Statistics for this URL.</p>
                                        <p className="text-gray-500 text-sm mt-2">Statistics will appear here once people start clicking your link.</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}