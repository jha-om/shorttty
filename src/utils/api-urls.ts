import supabase from "./supabase";

export async function getUrls(userId: string): Promise<any[]> {
    const { data, error } = await supabase.from("urls").select("*").eq("user_id", userId);

    if (error) {
        console.error("unable to load URLs");
        throw new Error(error.message);
    }

    return data || [];
}