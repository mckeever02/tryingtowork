import { supabase } from './supabase';

export async function getPlaceDetails(placeId: string | undefined) {
    if (!placeId) {
        console.error('Attempted to fetch place details with undefined placeId');
        return null;
    }

    const { data, error } = await supabase
        .from('Places')
        .select('*')
        .eq('place_id', placeId)
        .single();

    if (error) throw error;
    return data;
}

export async function updatePlaceDetails(placeId: string, details: any) {
    const { data, error } = await supabase
        .from('place_details')
        .upsert({ place_id: placeId, ...details })
        .select();

    if (error) throw error;
    return data;
}

// Add more functions as needed for upvoting, downvoting, etc.