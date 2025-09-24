import supabase from "./supabase";

export async function getClicksFromUrl(urlIds: string[]): Promise<any[]> {
    if (!urlIds.length) {
        return [];
    }
    const { data, error } = await supabase.from("clicks").select("*").in("url_id", urlIds);
    
    if (error) {
        console.error("error while selecting all URLs");
        throw new Error(error.message);
    }

    return data || [];
}