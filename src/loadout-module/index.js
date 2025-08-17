import EmailManagement from './email-management.vue';

export default {
	id: 'redlabs-rocket-loadout',
	name: 'RedLabs Rocket Loadout 🚀🚀🚀',
	icon: 'rocket_launch',
	description: 'Enhanced loadout (settings and features) for your Directus instance. EMAIL_FROM override + Email hook. More to come!??',
	color: '#FFA439',
	routes: [
		{
			path: '',
			component: EmailManagement,
			beforeEnter() {
				return `/red/email-management`;
			},
		},
		{
			path: '/red/email-management',
			component: EmailManagement,
		},

	],

	/* Only admin users can access the email management module */
	preRegisterCheck(user) {
		return user.admin_access === true;
	},
};
