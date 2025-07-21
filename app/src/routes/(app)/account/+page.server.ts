import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) {
		return redirect(302, '/login');
	}
	return {
		session: event.locals.session,
		user: event.locals.user
	};
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		
		await event.locals.supabase.auth.signOut();
		return redirect(302, '/');
	},
};