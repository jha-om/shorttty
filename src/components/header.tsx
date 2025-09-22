import { Link2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "./dropdown";
import { Button } from "./ui/button";

const Header = () => {
    const navigate = useNavigate();
    const userLoggedIn = true;

    return (
        <nav className="p-7 border max-w-4xl md:max-w-5xl mx-auto rounded-full border-b-white/25 bg-white/5 backdrop-blur-2xl flex justify-between items-center">
            <div>
                <Link to={"/"}>
                    <div className="flex items-center">
                        <Link2Icon className="-rotate-45 w-10 h-10" color="blue" />
                        <span className="hidden md:inline-block ml-2 text-xl">shorttty</span>
                    </div>
                </Link>
            </div>

            <div className="flex gap-2 items-center">
                <div>
                    {userLoggedIn ? (
                        <div className="flex items-center">
                            <Dropdown />
                        </div>
                    ) : (
                        <Button onClick={() => navigate('/auth')}>Login</Button>
                    )}
                </div>

            </div>
        </nav>
    )
}

export default Header