import supabase, { supabaseUrl } from "./supabase";

interface createUrlProp {
    title: string,
    longUrl: string,
    customUrl: string,
    user_id: string,
    qrcode: File,
}

export async function getUrls(userId: string): Promise<any[]> {
    const { data, error } = await supabase.from("urls").select("*").eq("user_id", userId);

    if (error) {
        console.error("unable to load URLs");
        throw new Error(error.message);
    }

    return data || [];
}

export async function deleteUrl(id: string): Promise<any> {
    const { data, error } = await supabase.from("urls").delete().eq("id", id);

    if (error) {
        console.error("unable to delete this url");
        throw new Error(error.message);
    }

    return data;
}

export async function createUrl({ title, longUrl, customUrl, user_id, qrcode }: createUrlProp): Promise<any> {
    const short_url = Math.random().toString(36).substring(2, 8);
    const fileName = `qr-${short_url}`;
    const { error: storageError } = await supabase.storage.from(("qrs")).upload(fileName, qrcode)

    if (storageError) {
        throw new Error(storageError.message);
    }

    const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;
    console.log("qr: ", qr);

    const { data, error } = await supabase.from("urls").insert([
        {
            title,
            original_url: longUrl,
            custom_url: customUrl || null,
            user_id,
            short_url,
            qr,
        }
    ]).select();

    if (error) {
        throw new Error("Error creating short URL");
    }
    return data;
}