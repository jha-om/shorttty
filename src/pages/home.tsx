import AccordionComponent from "@/components/According"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const [longURL, setLongURL] = useState("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!longURL.trim()) {
            alert("Please enter a URL");
            return;
        }
        
        try {
            // to parse the url is even an actual URL or not.
            new URL(longURL);
        } catch {
            alert("Please enter a valid URL");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            if (user?.id && longURL) {
                navigate(`/dashboard/?createNew=${encodeURIComponent(longURL)}`)
            } else {
            navigate(`/auth?createNew=${encodeURIComponent(longURL)}`); // Navigate to auth with URL
        }
        } catch (error) {
            console.log("naviagation error:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="h-[calc(100vh-150px)] flex flex-col items-center justify-between max-w-4xl mx-auto px-4 py-8 overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 w-full">
                <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                        <span>shorttty</span><span>,</span> URL
                    </h2>
                </div>

                <div className="w-full max-w-3xl mx-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row w-full gap-3"
                    >
                        <Input
                            value={longURL}
                            onChange={(e) => setLongURL(e.target.value)}
                            type="url"
                            placeholder="Enter the long ass URL"
                            className="h-14 flex-1 px-6 py-4 text-white placeholder:text-gray-400 bg-white/10 border-white/20 rounded-lg backdrop-blur-2xl"
                            disabled={isSubmitting}
                        />
                        <Button
                            disabled={isSubmitting || !longURL.trim()}
                            className="h-14 px-8 bg-[#e85d04]/70 hover:bg-[#e85d04]/90 cursor-pointer text-white transition-colors duration-300 rounded-lg"
                            type="submit"
                        >
                            {isSubmitting ? "Processing..." : "Shortit"}
                        </Button>
                    </form>
                </div>
            </div>

            <div className="w-full max-h-[50vh]">
                <AccordionComponent />
            </div>
        </div>
    )
}

export default Home