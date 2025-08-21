<template>
	<private-view title="Email Management">

		<template #navigation>
			<navigation />
		</template>

		<template #title>
			<div class="red-rocket-header">
				<div class="flex flex-col gap-4">
					<div class="text-3xl red-heading">
						RedLabs Rocket Loadout 🚀🚀🚀
					</div>
					<div class="text-3xl red-title">
						<v-button class="header-icon" rounded disabled icon secondary>
							<v-icon name="alternate_email" />
						</v-button>
						<span class="text-3xl">
							Email Management
						</span>
					</div>
				</div>
			</div>
		</template>

		<template #actions>
			<v-button @click="onClickSaveSettings" :disabled="!isDirty">
				Save
			</v-button>
		</template>


		<div class="red-settings">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<div class="text-3xl email">
						System Email Address: <span class="full-email">{{ sysFromName }}<{{ sysFromAddress }}></span>
					</div>
				</div>
			</div>
			<br/>
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<VCheckbox
						v-model="isOverrideEmailChecked"
						@update:modelValue="onChangeOverrideEmailChecked"
						label="Override the default system email address?"
						class="email-override-checkbox"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<div class="text-3xl email">
						From Email Address: <span class="full-email">{{ redFromName }}<{{ redFromAddress }}></span>
					</div>
				</div>
			</div>

			<br/>
			<VDivider />
			<br/>

			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<h1 class="text-2xl font-bold">From Name</h1>
					<VInput v-model="fromName"
							placeholder="Email Address Name"
							class="email-input-name"
							:trim="true"
							:fullWidth="false"
							:disabled="!isOverrideEmailChecked"
					/>
					<p class="text-sm text-gray-500">
						The name that will be displayed as the <strong>From Name</strong> e.g. Olympus Support
					</p>
				</div>
				<div class="flex flex-col gap-2">
					<h1 class="text-2xl font-bold">From Address</h1>
					<VInput v-model="fromAddress"
							type="email"
							class="email-input-address"
							placeholder="Email Address"
							:trim="true"
							:fullWidth="false"
							:disabled="!isOverrideEmailChecked"
					/>
					<p class="text-sm text-gray-500">
						The email address that will be used as the <strong>From Address</strong> e.g. olympus-support@example.com
					</p>
				</div>
			</div>

		</div>

	</private-view>
</template>

<script>
import Navigation from './navigation.vue';
import { useStores, useApi } from '@directus/extensions-sdk';
import { ref, computed, onMounted, watch } from 'vue';

export default {
	components: {
		Navigation,
	},
	setup() {
		console.log('🚀 RedLabs::setup');
		const { useCollectionsStore, useNotificationsStore, useSettingsStore } = useStores();
		const collectionsStore = useCollectionsStore();
		const notify = useNotificationsStore();
		const settingsStore = useSettingsStore();
		const api = useApi();
		
		// Environment variables are not directly accessible in frontend extensions
		// We need to fetch them from our custom endpoint
		const sysFromName = ref(settingsStore.settings?.project_name || 'Directus');
		const sysFromAddress = ref('loading...');
		
		notify.add({ type: 'info', title: '🚀 Initializing' });
	
		const colRedLoadout = 'red_loadout';

		const fromName = ref('');
		const fromAddress = ref('');
		const redFromName = ref('');
		const redFromAddress = ref('');
		const isOverrideEmailChecked = ref(false);

		const initialFromName = ref('');
		const initialFromAddress = ref('');
		const initialIsOverride = ref(false);

		const isDirty = computed(() => {
			if (isOverrideEmailChecked.value !== initialIsOverride.value) return true;
			if (isOverrideEmailChecked.value === true) {
				return (
					fromName.value !== initialFromName.value ||
					fromAddress.value !== initialFromAddress.value
				);
			}
			return false;
		});

		function onChangeOverrideEmailChecked() {
			updateDisplayValues();
		}

		function updateDisplayValues() {
			if (isOverrideEmailChecked.value) {
				redFromName.value = fromName.value;
				redFromAddress.value = fromAddress.value;
			} else {
				redFromName.value = sysFromName.value;
				redFromAddress.value = sysFromAddress.value;
			}
		}

		async function loadEnvironmentVars() {
			try {
				const response = await api.get('/red/env');
				console.log('🚀 RedLabs::loadEnvironmentVars', response.data);
				sysFromAddress.value = response.data.EMAIL_FROM || 'not-configured';
				console.log('🚀 RedLabs::sysFromAddress', sysFromAddress.value);
			} catch (error) {
				console.error('Failed to fetch environment variables:', error);
				sysFromAddress.value = 'error-loading';
				notify.add({ type: 'warning', title: '🚀 Could not load environment variables' });
			}
		}

		async function initSettings() {
			const exists = collectionsStore.getCollection(colRedLoadout);
			if (!exists) {
				console.log('🚀 RedLabs::initSettings - create collection');
				await collectionsStore.upsertCollection(colRedLoadout, {
					collection: colRedLoadout,
					meta: {
						singleton: true,
						icon: 'rocket_launch',
						note: 'RedLabs Rocket Loadout 🚀🚀🚀 (enhanced settings) for directus',
						hidden: true,
					},
					schema: {},
					fields: [
						{
							field: 'email_override',
							type: 'boolean',
							meta: { interface: 'toggle', options: {} },
							schema: {},
						},
						{
							field: 'email_name',
							type: 'string',
							meta: { interface: 'input' },
							schema: {},
						},
						{
							field: 'email_address',
							type: 'string',
							meta: { interface: 'input', options: {}, special: ['email'] },
							schema: {},
						},
					],
				});
			}
		}

		async function loadSettings() {
			console.log('🚀 RedLabs::loadSettings');
			let redSettings = {};
			const response = await api.get(`/items/${colRedLoadout}`);
			redSettings = response.data.data;

			return redSettings;
		}

		async function saveSettings(redSettings) {
			console.log('🚀 RedLabs::saveSettings');
			const response = await api.patch(`/items/${colRedLoadout}`, redSettings);
			console.log('🚀 RedLabs::saveSettings - response', response);
		}

		// Watch for changes in input fields to update display in real-time
		watch([fromName, fromAddress], () => {
			if (isOverrideEmailChecked.value) {
				updateDisplayValues();
			}
		});

		// Watch for changes in the override checkbox
		watch(isOverrideEmailChecked, (newValue) => {
			console.log('🚀 RedLabs::watcher - isOverrideEmailChecked changed to:', newValue);
			updateDisplayValues();
		});

		onMounted(async () => {
			try {
				await initSettings();
				await loadEnvironmentVars();
				const redSettings = await loadSettings();

				// Initialize form fields
				isOverrideEmailChecked.value = Boolean(redSettings.email_override || false);
				fromName.value = redSettings.email_name || '';
				fromAddress.value = redSettings.email_address || '';

				// Update display values based on current settings
				updateDisplayValues();

				initialIsOverride.value = isOverrideEmailChecked.value;
				initialFromName.value = fromName.value;
				initialFromAddress.value = fromAddress.value;
			} catch (error) {
				notify.add({ type: 'error', title: '🚀 setup exception - see console' });
				console.log('🚀 RedLabs::onMounted - error: ', error);
				throw error;
			}

			notify.add({ type: 'info', title: '🚀 Settings Initialized' });

		});

		async function onClickSaveSettings() {
			console.log('🚀 RedLabs::onClickSaveSettings');
			try {
				const payload = {
					email_override: !!isOverrideEmailChecked.value,
				};
				if (isOverrideEmailChecked.value) {
					payload.email_name = fromName.value || '';
					payload.email_address = fromAddress.value || '';
				}

				await saveSettings(payload);
				notify.add({ type: 'success', title: '🚀 Settings Saved' });

        initialIsOverride.value = isOverrideEmailChecked.value;
        initialFromName.value = fromName.value;
        initialFromAddress.value = fromAddress.value;
			} catch (error) {
				console.log('🚀 RedLabs::onClickSaveSettings - error: ', error);
				notify.add({ type: 'error', title: '🚀 Settings Save Failed' });
				throw error;
			}
		}

		return {
			sysFromName,
			sysFromAddress,
			redFromName,
			redFromAddress,

			fromName,
			fromAddress,
			isOverrideEmailChecked,
			isDirty,
			onChangeOverrideEmailChecked,
			initialFromName,
			initialFromAddress,
			initialIsOverride,
			notify,
			onClickSaveSettings,
		};
	},

};
</script>

<style lang="scss" scoped>

/* Scoped to this email management component only */
:deep(.header-bar) {
	block-size: 120px;
	margin-top: 0 !important;
	padding-top: 10px !important;
	background-color: #ffd992;

	.title {
		overflow: visible !important;
	}
}

.red-rocket-header {
	margin-bottom: 20px;

	.red-heading {
		font-size: 2rem;
	}

	.red-title {
		font-size: 1.5rem;
}

}


.red-settings {
	padding: var(--content-padding);
	padding-top: 0;

	.email {
		font-weight: 400;
		.full-email {
			font-weight: 700;
			background-color: #e6e7fd;
			padding: 0.25rem 0.5rem;
			border-radius: 0.25rem;
		}
	}

	.email-input-name {
		width: 50%;
	}

	.email-input-address {
		width: 50%;
	}

}
</style>

