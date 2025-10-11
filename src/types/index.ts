export interface User {
    id: string,
    email?: string,
    name?: string,
    user_metadata?: {
        full_name?: string,
        avatar_url?: string,
        user_name?: string,
    }
}

export interface AuthContextType{
    user: User | null;
    loading: boolean,
    userLoggedIn: boolean,
    error: string | null,
    refetch: () => void,
}