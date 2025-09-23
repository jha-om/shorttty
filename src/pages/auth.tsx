import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signInWithGithub } from "../utils/supabase";

const Auth = () => {
    const [getquery] = useSearchParams();
    const longURL = getquery.get('createNew');
    const navigate = useNavigate();

    // after user clicks on the login show the page where the user have to click on signin/signup with github
    // and if user before coming to the signup/login page, entered any url to shorten it we'll take the query param, do login first then resume the shortening of the URL.

    const { user, loading } = useAuth();

    useEffect(() => {
        if (user?.id && longURL) {
            navigate(`/dashboard/?createNew=${encodeURIComponent(longURL)}`)
        } else if (user?.id) {
            navigate('/dashboard');
        }
    }, [navigate, longURL, user])


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
            <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
                <div className="text-white text-lg">
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    // If user is not logged in, show login button
    return (
        <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
            <div >
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