import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { LinkIcon, LogOut, UserCircle2Icon } from "lucide-react";
import { signOut } from "../utils/supabase";
import { Link } from "react-router-dom";

export default function Dropdown() {
    const { user } = useAuth();

    const handleSignout = async () => {
        try {
            await signOut();
            window.location.href = '/'
        } catch (error: any) {
            throw new Error("Error while signin out the user, try again later:)", error)
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full overflow-hidden"><UserCircle2Icon className="w-10 h-10 cursor-pointer" /></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{user?.user_metadata?.full_name} Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={'/dashboard'}>
                    <DropdownMenuItem className="flex justify-between"
                    >Mah Links
                        <LinkIcon />
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                    onClick={async () => await handleSignout()}
                    className="text-red-500 flex justify-between">Logout
                    <LogOut className="text-red-500" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}