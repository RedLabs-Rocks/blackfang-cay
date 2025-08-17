const colRedLoadout = 'red_loadout';

export default ({ filter, action }, {env, services, getSchema}) => {
	filter('email.send', async (payload, meta, context) => {
		console.log('🚀 ReadLabs::EmailHook::filter');

		const { accountability } = context;
		const { ItemsService } = services;

		const redLoadoutSvc = new ItemsService(colRedLoadout, {
			schema: await getSchema(),
			 accountability
		});

		let rLoadout = {};
		try {
			rLoadout = await redLoadoutSvc.readSingleton({});
			console.log('🚀 RedLabs::EmailHook::readSingleton', rLoadout);
		} catch (error) {
			console.log('🚀 RedLabs::EmailHook::readSingleton ******************* ERROR **************************');
			console.log('🚀 RedLabs::EmailHook::readSingleton *** Error - Extension has most likely not been initialized');
			console.log('🚀 RedLabs::EmailHook::readSingleton *** Error - Note: We swallow the error and return the payload so that existing functionality is not affected');
			console.log('🚀 RedLabs::EmailHook::readSingleton *** Error', error);
			console.log('🚀 RedLabs::EmailHook::readSingleton ******************* ERROR **************************');
		}

		if (rLoadout.email_override && rLoadout.email_override === true) {
			return {
				...payload,
				from: {
					name: rLoadout.email_name,
					address: rLoadout.email_address,
				},
			};
		} else {
			return payload;
		}

	});
};
