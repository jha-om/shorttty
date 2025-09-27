import { UAParser } from "ua-parser-js";
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

export async function getClicks(url_id: string): Promise<any> {
    const { data, error } = await supabase
        .from("clicks")
        .select("*")
        .eq("url_id", url_id)
        .select()

    if (error) {
        console.error("unable to load stats");
        throw new Error(error.message);
    }    
    return data;
}

const parser = new UAParser();

export const storeClicks = async ({ id }: { id: string, originalURL: string }): Promise<any> => {
    try {
        const res = parser.getResult();
        const device = res.device?.type || "desktop";
        const response = await fetch("https://ipapi.co/json");
        const { city, country_name: country } = await response.json();

        console.log(city, country);

        const { data: clickData, error: clickError } = await supabase.from("clicks").insert({
            url_id: id,
            city,
            country,
            device
        }).select();

        if (clickError) {
            console.error("error inserting click: ", clickError);
            throw new Error(clickError.message);
        }

        console.log("clicked stored successfully", clickData);
        return clickData;
    } catch (error) {
        console.error("Error clicking this url", error);
        throw error;
    }
}