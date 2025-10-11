import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signInWithGithub } from "../utils/supabase";
import Loading from "@/components/Loading";

const Auth = () => {
    const [getquery] = useSearchParams();
    const longURL = getquery.get('createNew');
    const navigate = useNavigate();
    // after user clicks on the login show the page where the user have to click on signin/signup with github
    // and if user before coming to the signup/login page, entered any url to shorten it we'll take the query param, do login first then resume the shortening of the URL.

    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user?.id) {    
            if (longURL) {
                navigate(`/dashboard/?createNew=${encodeURIComponent(longURL)}`)
            } else {
                navigate('/dashboard');
            }
        }
    }, [navigate, loading, longURL, user])


    const handleGithubSignIn = async () => {
        try {
            await signInWithGithub();
            // After successful sign in, the useEffect will handle the redirect
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    // If user is not logged in, show login button
    return (
        <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
            <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                    {longURL ? 'Sign in to shorten your URL' : 'Welcome to shorttty'}
                </h2>

                {longURL && (
                    <p className="text-gray-300 mb-6 break-all">
                        URL to shorten: <span className="text-blue-300">{longURL}</span>
                    </p>
                )}

                <Button
                    onClick={handleGithubSignIn}
                    className="w-full h-11 bg-gray-800 hover:bg-gray-700 text-white cursor-pointer"
                >
                    <div>
                        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <title>GitHub</title>
                            <path fill={"#f0f0f5"} d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                    </div> Continue with GitHub
                </Button>
            </div>
        </div>
    );
};

export default Auth