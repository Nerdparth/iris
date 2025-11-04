"use server";

import { createClient } from "@/utils/supabase/server";

export async function toggleIntervention(id: string, is_intervened: boolean) {
    const supabase = await createClient();


    const { data, error } = await supabase
    .from("Chats")
    .update({
        is_intervened: is_intervened,
    })
    .eq("id", id);
    if (error) {
        console.error("Error toggling intervention:", error);
    }
    return data;
}