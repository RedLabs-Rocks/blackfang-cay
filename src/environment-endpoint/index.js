export default {

	id: 'red',

	handler: (router, { env }) => {

		console.log('🚀 RedLabs::environment - endpoint handler');

		router.get('/', async (req, res) => {

			const response = {
				"message": "RedLabs API Endpoint Extension",
				"endpoints": [
					{
						"name": "env",
						"description": "Get environment variables",
						"url": "/env"
					}
				]
			}
			
			res.json(response);
		});

		router.get('/env', async (req, res) => {
			// Only expose the environment variables you actually need
			// Be very careful about what you expose for security reasons
			const exposedEnvVars = {
				EMAIL_FROM: env.EMAIL_FROM || null,
				PUBLIC_URL: env.PUBLIC_URL || null,
				// EMAIL_TEMPLATES_PATH: env.EMAIL_TEMPLATES_PATH || null,
				// Add other non-sensitive vars you need
			};

			console.log('🚀 RedLabs::exposedEnvVars', exposedEnvVars);
			
			res.json(exposedEnvVars);
		});
	},
};
