import CreateLink from "@/components/CreateLink";
import LinkCard from "@/components/LinkCard";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { getClicksFromUrl } from "@/utils/api-clicks";
import { getUrls } from "@/utils/api-urls";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

export interface Url {
    id: string;
    user_id: string;
    original_url: string;
    short_url: string;
    custom_url?: string;
    title?: string;
    created_at: string;
    qr?: string,
}

interface Click {
    id: string,
    url_id: string,
    created_at: string,
    city?: string,
    country?: string,
    device?: string,
}

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [urls, setUrls] = useState<Url[]>([]);
    const [clicks, setClicks] = useState<Click[]>([]);
    const [loadingUrls, setLoadingUrls] = useState(false);
    const [loadingClicks, setLoadingClicks] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, loading:authLoading } = useAuth();
    
    // fetching urls and no. of clicks for that urls when user is available;
    useEffect(() => {
        const fetchUrls = async () => {
            if (!user?.id) {
                return;
            }

            try {
                setLoadingUrls(true);
                setError(null);
                const urlsData = await getUrls(user.id);
                setUrls(urlsData || []);
            } catch (error) {
                console.error("error in fetching urls", error);
                setError(error instanceof Error ? error.message : "failed to fetch urls")
            } finally {
                setLoadingUrls(false);
            }
        }
        
        fetchUrls();
    }, [user?.id]);
    
    useEffect(() => {
        const fetchClicks = async () => {
            if (!urls.length) {
                return;
            }
            
            try {
                setLoadingClicks(true);
                setError(null);
                const urlIds = urls.map(url => url.id);
                const clicksData = await getClicksFromUrl(urlIds);
                setClicks(clicksData || []);
            } catch (error) {
                console.error("error fetching clicks", error);
                setError(error instanceof Error ? error.message : "failed to fetch clicks")
            } finally {
                setLoadingClicks(false);
            }
        }
        fetchClicks();
    }, [urls])

    const handleUrlDelete = (deletedUrlId: string) => {
        setUrls(prevUrls => prevUrls.filter(url => url.id !== deletedUrlId))
        setClicks(prevClicks => prevClicks.filter(click => click.url_id !== deletedUrlId));
    }
    // now filtering according to the user filters
    const filteredUrls = urls.filter(url => (
        url.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.original_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.custom_url?.toLowerCase().includes(searchQuery.toLowerCase())
    ));

    if (authLoading) {
        return <Loading />
    }

    return (
        <div className="md:max-w-7xl lg:max-w-6xl mx-auto flex flex-col gap-10">
            
            {/* link state */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white/5 backdrop-blur-2xl">
                    <CardHeader>
                        <CardTitle>Links Created</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{urls.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur-2xl">
                    <CardHeader>
                        <CardTitle>Total Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{clicks.length}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between">
                <h1 className="md:text-2xl text-3xl font-semibold text-pretty">My Links</h1>
                    <CreateLink />
            </div>

            <div className="relative">
                <Input
                    className="p-6 md:text-xl text-2xl backdrop-blur-3xl"
                    type="text"
                    placeholder="Filter links"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Filter className="absolute top-2 right-2 p-1 w-8 h-8" />
            </div>

            {/* error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400">Error: {error}</p>
                </div>
            )}

            {/* all the filtered urls */}
            {(filteredUrls || []).map((url, i) => {
                return (
                    <>
                        {console.log(url)}
                        <LinkCard key={i} url={url} onDelete={handleUrlDelete} />
                    </>
                )
            })}
        </div>
    )
}

export default Dashboard