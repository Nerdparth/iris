"use server";

// import { createClient } from "@/utils/supabase/server";

export default async function getOrganizationMembers(orgUuid: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}organisation/organisation-members?uuid=${orgUuid}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (response.status === 302) {
        throw new Error("User not authorized");
    }

    if (!response.ok && response.status !== 302) {
        throw new Error(response.statusText);
    }

    const data = await response.json();


    const userEmails = await Promise.all(data.map(async (member: any) => {
        return await getUserEmailById(member.userId);
    }));

    data.forEach((member: any, index: number) => {
        member.email = userEmails[index];
    });

    console.log("Organization members with emails:", data);

    return data;
}

import { createClient } from "@supabase/supabase-js";


function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

async function getUserEmailById(userId: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) throw error;

    return data.user?.email ?? null;
}