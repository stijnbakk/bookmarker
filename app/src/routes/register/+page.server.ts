import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// If user is already logged in, redirect to feed
	if (event.locals.session) {
		return redirect(302, '/feed');
	}
	return { session: event.locals.session };
};

export const actions: Actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required' });
		}

		if (password.length < 6) {
			return fail(400, { message: 'Password must be at least 6 characters' });
		}

		const { error } = await event.locals.supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			return fail(400, { message: error.message });
		}

		return redirect(302, '/feed');
	}
};