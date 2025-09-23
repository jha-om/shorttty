import type { User } from "@/types";
import supabase, { getUserDetails } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
        // after refreshing supabase fires signed_in event rather than 
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            
            try {
                setError(null);

                if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    if (session?.user) {
                        setUser(session.user as User);
                        setUserLoggedIn(true);
                    } else {
                        setUser(null);
                        setUserLoggedIn(false);
                    }
                }
                else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setUserLoggedIn(false);
                }

                setLoading(false);

            } catch (error) {
                console.error('Error in auth state change:', error);
                setError(error instanceof Error ? error.message : "Auth error occurred");
                setUser(null);
                setUserLoggedIn(false);
                setLoading(false);
            }
        });

        // to unmount the subscription when auth state changes like when we remove the 
        // interval after setting the interval in js.


        return () => subscription.unsubscribe();
    }, [])

    const refetch = () => {
        setLoading(true);
        checkUser();
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            userLoggedIn,
            error,
            refetch
        }}>
            {children}
        </AuthContext.Provider>
    )
}