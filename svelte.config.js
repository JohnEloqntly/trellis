import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			runtime: 'nodejs20.x'
		})
	},
	preprocess: vitePreprocess(),
	onwarn: (warning, handler) => {
		// Suppress accessibility warnings during build
		if (warning.code === 'a11y-click-events-have-key-events') return;
		if (warning.code === 'a11y-no-noninteractive-element-interactions') return;
		if (warning.code === 'a11y-no-noninteractive-tabindex') return;
		if (warning.code === 'a11y-label-has-associated-control') return;
		if (warning.code === 'a11y-missing-attribute') return;
		if (warning.code === 'css-unused-selector') return;
		handler(warning);
	}
};

export default config; 