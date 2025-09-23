import supabase from "./supabase";

export async function getUrls(userId: string) {
    const { data, error } = await supabase.from("urls").select("*").eq("user_id", userId);

    if (error) {
        console.error("error while selecting all URLs");
        throw new Error(error.message);
    }

    return data;
}