import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user && !loading) {
            const currentPath = location.pathname + location.search;
            navigate(`/auth?redirect=${encodeURIComponent(currentPath)}`);
        }
    }, [user, loading, navigate, location])

    if (loading) {
        return (
            <Loading />
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            {children}
        </>
    )

}