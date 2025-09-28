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
                {/* left side - Enhanced with more content */}
                <div className="flex flex-col gap-6 border border-white/20 bg-white/5 backdrop-blur-2xl p-5 rounded-lg">
                    {/* URL Information Card */}
                    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-lg border py-6 shadow-sm p-5">
                        {/* title - big text */}
                        <div className="p-2 space-y-4">
                            <h1 className="text-2xl sm:text-3xl text-white font-bold mb-2 leading-tight">
                                {urlData.title || "Untitled Link"}
                            </h1>
                            
                            {/* Short URL with copy button */}
                            <div className="flex items-center justify-between gap-2 text-[#e85d04] border border-white/5 bg-white/5 rounded-lg relative p-3 sm:text-sm md:text-xl lg:text-2xl font-semibold">
                                <span className="text-sm sm:text-base md:text-lg font-semibold truncate flex-1 pr-[26px]">
                                    shorttty.vercel.app/{link}
                                </span>
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
                            <p className="mt-4 text-gray-300 break-all">
                                {original_url.charAt(original_url.length - 1) === '/' ? original_url.slice(0, original_url.length - 1) : original_url}
                            </p>
                            
                            {/* created at - normal text */}
                            <p className="text-gray-400 break-all mt-2 text-sm">
                                Created: {new Date(urlData.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    {urlData.qr && (
                        <div className="text-center bg-white/5 border border-white/10 rounded-lg p-6">
                            <h3 className="text-white font-medium mb-4">QR Code</h3>
                            <div className="flex justify-center mb-4">
                                <img 
                                    src={urlData.qr}
                                    alt="QR code"
                                    className="w-[232px] h-[232px] bg-white object-contain ring-2 ring-[#e85d04] rounded-lg p-3"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mb-4">Scan to visit link</p>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2 justify-center">
                                <ActionButtons
                                    loading={urlOperations?.loading}
                                    downloadImage={urlOperations?.downloadImage}
                                    handleCopy={urlOperations?.handleCopy}
                                    handleDelete={urlOperations?.handleDelete}
                                />
                            </div>
                        </div>
                    )}

                    {/* Quick Stats Summary - NEW SECTION */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <h3 className="text-white font-medium mb-4">📊 Quick Overview</h3>
                        
                        {loadingClicks ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e85d04]"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {/* Total Clicks */}
                                <div className="text-center bg-gradient-to-br from-[#e85d04]/10 to-transparent border border-[#e85d04]/20 rounded-lg p-4">
                                    <p className="text-2xl font-bold text-[#e85d04] mb-1">
                                        {clicksData?.length || 0}
                                    </p>
                                    <p className="text-xs text-gray-400">Total Clicks</p>
                                </div>

                                {/* Unique Locations */}
                                <div className="text-center bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-lg p-4">
                                    <p className="text-2xl font-bold text-blue-400 mb-1">
                                        {clicksData?.length ? new Set(clicksData.map(click => `${click.city}, ${click.country}`).filter(Boolean)).size : 0}
                                    </p>
                                    <p className="text-xs text-gray-400">Locations</p>
                                </div>

                                {/* Today's Clicks */}
                                <div className="text-center bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-lg p-4">
                                    <p className="text-2xl font-bold text-green-400 mb-1">
                                        {clicksData?.filter(click => {
                                            const today = new Date();
                                            const clickDate = new Date(click.created_at);
                                            return clickDate.toDateString() === today.toDateString();
                                        }).length || 0}
                                    </p>
                                    <p className="text-xs text-gray-400">Today</p>
                                </div>

                                {/* This Week */}
                                <div className="text-center bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-lg p-4">
                                    <p className="text-2xl font-bold text-purple-400 mb-1">
                                        {clicksData?.filter(click => {
                                            const weekAgo = new Date();
                                            weekAgo.setDate(weekAgo.getDate() - 7);
                                            return new Date(click.created_at) >= weekAgo;
                                        }).length || 0}
                                    </p>
                                    <p className="text-xs text-gray-400">This Week</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Link Information - NEW SECTION */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                        <h3 className="text-white font-medium mb-4">🔗 Link Details</h3>
                        
                        <div className="space-y-3">
                            {/* Short URL Type */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">URL Type:</span>
                                <span className="text-white text-sm font-medium">
                                    {urlData.custom_url ? "Custom URL" : "Generated"}
                                </span>
                            </div>

                            {/* Has QR Code */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">QR Code:</span>
                                <span className="text-white text-sm font-medium">
                                    {urlData.qr ? "✅ Available" : "❌ Not Generated"}
                                </span>
                            </div>

                            {/* URL Length */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Short Code:</span>
                                <span className="text-white text-sm font-medium">
                                    {link.length} characters
                                </span>
                            </div>

                            {/* Last Click */}
                            {clicksData && clicksData.length > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Created At:</span>
                                    <span className="text-white text-sm font-medium">
                                        {new Date(clicksData[0].created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            )}

                            {/* Status */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Status:</span>
                                <span className="text-green-400 text-sm font-medium">
                                    🟢 Active
                                </span>
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
                                <div className="space-y-6">
                                    {/* Total Clicks - Enhanced */}
                                    <div className="bg-gradient-to-r from-[#e85d04]/10 to-transparent border border-[#e85d04]/20 rounded-lg p-6">
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold text-white mb-2">Total Clicks</h3>
                                            <p className="text-4xl font-bold text-[#e85d04]">{clicksData.length}</p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Last click: {clicksData.length > 0 ? new Date(clicksData[0].created_at).toLocaleString() : 'Never'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Analytics Summary Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Unique Locations */}
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                            <h4 className="text-white font-medium mb-2">📍 Locations</h4>
                                            <p className="text-2xl font-bold text-[#e85d04]">
                                                {new Set(clicksData.map(click => `${click.city}, ${click.country}`).filter(Boolean)).size}
                                            </p>
                                            <p className="text-gray-400 text-xs">Unique locations</p>
                                        </div>

                                        {/* Device Types */}
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                            <h4 className="text-white font-medium mb-2">📱 Devices</h4>
                                            <div className="space-y-1">
                                                {Object.entries(
                                                    clicksData.reduce((acc, click) => {
                                                        const device = click.device || 'desktop';
                                                        acc[device] = (acc[device] || 0) + 1;
                                                        return acc;
                                                    }, {} as Record<string, number>)
                                                ).map(([device, count]) => (
                                                    <div key={device} className="flex justify-between text-sm">
                                                        <span className="text-gray-300 capitalize">{device}</span>
                                                        <span className="text-[#e85d04] font-medium">{count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Clicks - Limited to 5 */}
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-white font-medium">Recent Activity</h4>
                                        </div>
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {clicksData.slice(0, 3).map((click, i) => (
                                                <div key={click.id || i} className="bg-white/5 rounded-md p-3 hover:bg-white/10 transition-colors">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex-1">
                                                            <p className="text-white text-sm font-medium">
                                                                📍 {click.city ? `${click.city}, ` : ''}{click.country || 'Unknown'}
                                                            </p>
                                                            <p className="text-gray-400 text-xs">
                                                                📱 {click.device || 'desktop'}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-gray-300 text-xs">
                                                                {new Date(click.created_at).toLocaleDateString()}
                                                            </p>
                                                            <p className="text-gray-400 text-xs">
                                                                {new Date(click.created_at).toLocaleTimeString([], { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit' 
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location Chart - Enhanced */}
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                        <h4 className="text-white font-medium mb-4">📊 Geographic Distribution</h4>
                                        <Location 
                                            clicksData={clicksData
                                                .filter(click => click.city && click.country)
                                                .map(click => ({
                                                    city: click.city!,
                                                    country: click.country!,
                                                    device: click.device || 'desktop',
                                                    created_at: click.created_at
                                                }))} 
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center items-center min-h-[400px]">
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