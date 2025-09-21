import { Link2Icon } from "lucide-react"
import { Link } from "react-router-dom"

const Header = () => {
    return (
        <nav className="p-7 border rounded-full border-white/30">
            <Link to={"/"}>
                <div className="flex items-center">
                    <Link2Icon className="-rotate-45 w-10 h-10" color="blue" />
                    <span className="ml-2 text-xl">shorttty</span>
                </div>
            </Link>
        </nav>
    )
}

export default Header