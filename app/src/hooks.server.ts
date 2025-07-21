import type { Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';

const handleAuth: Handle = async ({ event, resolve }) => {
	const supabase = createSupabaseServerClient(event);
	
	const {
		data: { session }
	} = await supabase.auth.getSession();

	event.locals.session = session;
	event.locals.user = session?.user ?? null;
	event.locals.supabase = supabase;

	return resolve(event);
};

export const handle: Handle = handleAuth;
