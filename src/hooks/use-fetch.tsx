import { useEffect, useState } from "react";
import { getUserDetails } from "@/utils/supabase";

interface User {
    id: string,
    email?: string,
    name?: string,
}

const useFetch = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkUser = async () => {
        try {
            setLoading(true);
            setError(null);

            const userDetails = await getUserDetails();
            if (userDetails?.id) {
                setUser(userDetails);
                setUserLoggedIn(true);
            } else {
                setUser(null);
                setUserLoggedIn(false);
            }
        } catch (error) {
            console.error('Error checking user:', error);
            setError(error instanceof Error ? error.message : "failed to check the user");
            setUserLoggedIn(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        checkUser();
    }, [])

    const refetch = () => {
        checkUser();
    }

    return {
        user,
        loading,
        userLoggedIn,
        error,
        refetch,
        checkUser
    }
}

export default useFetch