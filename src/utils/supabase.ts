
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase

export async function signInWithGithub() {

    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}`
            }

        })
        if (error) {
            throw error;
        }
    } catch (error) {
        console.log("error while siginig in with Github:", error);
        throw error;
    }
}

export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
    
        if (error) {
            throw error;
        }
    } catch (error) {
        console.log("error siging out:", error);
        throw error;
    }
}

export async function getUserDetails() {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            throw sessionError;
        }
        if (!session) {
            return null;
        }
        return session.user;
    } catch (error) {
        console.log("Error getting user:", error);
        return null;
    }
}