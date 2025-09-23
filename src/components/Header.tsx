import useFetch from "@/hooks/use-fetch";
import { Link2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { Button } from "./ui/button";

const Header = () => {
    const navigate = useNavigate();

    const { loading, userLoggedIn } = useFetch();
    return (
        <nav className="p-7 border max-w-4xl md:max-w-5xl mx-auto rounded-full border-b-white/25 bg-white/5 backdrop-blur-2xl flex justify-between items-center">
            <div>
                <Link to={"/"}>
                    <div className="flex items-center">
                        <Link2Icon className="-rotate-45 w-10 h-10" color="#e85d04" />
                        <span className="hidden md:inline-block ml-2 text-xl text-white">shorttty</span>
                    </div>
                </Link>
            </div>

            <div className="flex gap-2 items-center">
                {loading ? (
                    <div className="w-20 h-10 bg-white/10 rounded animate-pulse"></div>
                ) : userLoggedIn ? (
                    <Dropdown />
                ) : (
                    <Button 
                        onClick={() => navigate('/auth')}
                        className="bg-[#e85d04]/70 hover:bg-[#e85d04]/90 text-white"
                    >
                        Login
                    </Button>
                )}
            </div>
        </nav>
    )
}

export default Header