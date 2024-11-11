import { createSlice } from '@reduxjs/toolkit';

// Services
import { newLog } from '../services/logger';

export const loadersSlice = createSlice({
	name: 'loaders',
	initialState: {
		appIsLoading: true,
		authIsLoading: false,
		topMenu: {
			companyName: true,
		},
		dashboard: {
			tasks: true,
		},
		userSettings: {
			roles: true,
			permissions: true,
		},
		organizationSettings: {
			info: true,
			usage: true,
			subscription: true,
			users: true,
			collaborators: true,
			roles: true,
			apps: true,
		},
		task: {
			currentTask: true,
			status: {
				info: true,
				services: true,
				productionModel: true,
				examples: true,
			},
			schema: true,
			aimodels: true,
			settings: {
				services: true,
				usersPermissions: true,
				rolesPermissions: true,
			},
		},
	},
	reducers: {
		APP_IS_LOADING: (state, { payload }) => {
			newLog('loaders/APP_IS_LOADING');
			state.appIsLoading = payload;
		},
		AUTH_IS_LOADING: (state, { payload }) => {
			newLog('loaders/AUTH_IS_LOADING');
			state.authIsLoading = payload;
		},

		// TOP MENU
		LOAD_TOP_MENU_COMPANY_NAME: (state) => {
			newLog('loaders/LOAD_TOP_MENU_COMPANY_NAME');
			state.topMenu.companyName = !state.topMenu.companyName;
		},

		// DASHBOARD
		LOAD_DASHBOARD_TASKS: (state, { payload }) => {
			newLog('loaders/LOAD_DASHBOARD_TASKS');
			state.dashboard.tasks = payload;
		},

		// USER SETTINGS (MY ACCOUNT)
		LOAD_USER_ROLES: (state, { payload }) => {
			newLog('loaders/LOAD_USER_ROLES');
			state.userSettings.roles = payload;
		},
		LOAD_USER_PERMISSIONS: (state, { payload }) => {
			newLog('loaders/LOAD_USER_PERMISSIONS');
			state.userSettings.permissions = payload;
		},

		// ORGANIZATION SETTINGS
		LOAD_ORGANIZATION_INFO: (state, { payload }) => {
			newLog('loaders/LOAD_ORGANIZATION_INFO');
			state.organizationSettings.info = payload;
		},
		LOAD_ORGANIZATION_USAGE: (state, { payload }) => {
			newLog('loaders/LOAD_ORGANIZATION_USAGE');
			state.organizationSettings.usage = payload;
		},
		LOAD_ORGANIZATION_SUBSCRIPTION: (state, { payload }) => {
			newLog('loaders/LOAD_ORGANIZATION_SUBSCRIPTION');
			state.organizationSettings.subscription = payload;
		},
		LOAD_ORGANIZATION_USERS: (state, { payload }) => {
			newLog('loaders/LOAD_ORGANIZATION_USERS');
			state.organizationSettings.users = payload;
		},
		LOAD_ORGANIZATION_COLLABORATORS: (state, { payload }) => {
			newLog('loaders/LOAD_ORGANIZATION_COLLABORATORS');
			state.organizationSettings.collaborators = payload;
		},
		LOAD_ORGANIZATION_ROLES: (state, { payload }) => {
			newLog('loaders/LOAD_ORGANIZATION_ROLES');
			state.organizationSettings.roles = payload;
		},
		LOAD_ORGANIZATION_APPS: (state, { payload }) => {
			newLog('loaders/LOAD_ORGANIZATION_APPS');
			state.organizationSettings.apps = payload;
		},

		// TASK
		LOAD_CURRENT_TASK: (state, { payload }) => {
			newLog('loaders/LOAD_CURRENT_TASK');
			state.task.currentTask = payload;
		},
		// TASK STATE VIEW
		LOAD_TASK_STATUS_INFO: (state, { payload }) => {
			newLog('loaders/LOAD_TASK_STATUS_INFO');
			state.task.status.info = payload;
		},
		LOAD_TASK_STATUS_SERVICES: (state, { payload }) => {
			newLog('loaders/LOAD_TASK_STATUS_SERVICES');
			state.task.status.services = payload;
		},
		LOAD_TASK_STATUS_PRODUCTION_AIMODEL: (state, { payload }) => {
			newLog('loaders/LOAD_TASK_STATUS_PRODUCTION_AIMODEL');
			state.task.status.productionModel = payload;
		},
		LOAD_TASK_STATUS_EXAMPLES: (state, { payload }) => {
			newLog('loaders/LOAD_TASK_STATUS_EXAMPLES');
			state.task.status.examples = payload;
		},
		// TASK SCHEMA VIEW
		LOAD_TASK_SCHEMA: (state, { payload }) => {
			newLog('loaders/LOAD_TASK_SCHEMA');
			state.task.schema = payload;
		},
		// TASK AI MODELS VIEW
		LOAD_TASK_AIMODELS: (state, { payload }) => {
			newLog('loaders/LOAD_TASK_AIMODELS');
			state.task.aimodels = payload;
		},
		// TASK SETTINGS VIEW
		LOAD_TASK_SETTINGS_SERVICES: (state, { payload }) => {
			newLog('loaders/LOAD_TASK_SETTINGS_SERVICES');
			state.task.settings.services = payload;
		},
		LOAD_TASK_SETTINGS_USERS_PERMISSIONS: (state, { payload }) => {
			newLog('loaders/LOAD_TASK_SETTINGS_USERS_PERMISSIONS');
			state.task.settings.usersPermissions = payload;
		},
		LOAD_TASK_SETTINGS_ROLES_PERMISSIONS: (state, { payload }) => {
			newLog('loaders/LOAD_TASK_SETTINGS_ROLES_PERMISSIONS');
			state.task.settings.rolesPermissions = payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	APP_IS_LOADING,
	AUTH_IS_LOADING,

	// TOP MENU
	LOAD_TOP_MENU_COMPANY_NAME,

	// DASHBOARD
	LOAD_DASHBOARD_TASKS,

	// USER SETTINGS (MY ACCOUNT)
	LOAD_USER_ROLES,
	LOAD_USER_PERMISSIONS,

	// ORGANIZATION SETTINGS
	LOAD_ORGANIZATION_INFO,
	LOAD_ORGANIZATION_USAGE,
	LOAD_ORGANIZATION_SUBSCRIPTION,
	LOAD_ORGANIZATION_USERS,
	LOAD_ORGANIZATION_COLLABORATORS,
	LOAD_ORGANIZATION_ROLES,
	LOAD_ORGANIZATION_APPS,

	// TASK AREA
	LOAD_CURRENT_TASK,
	LOAD_TASK_STATUS_INFO,
	LOAD_TASK_STATUS_SERVICES,
	LOAD_TASK_STATUS_PRODUCTION_AIMODEL,
	LOAD_TASK_STATUS_EXAMPLES,
	LOAD_TASK_SCHEMA,
	LOAD_TASK_AIMODELS,
	LOAD_TASK_SETTINGS_SERVICES,
	LOAD_TASK_SETTINGS_USERS_PERMISSIONS,
	LOAD_TASK_SETTINGS_ROLES_PERMISSIONS,
} = loadersSlice.actions;

export default loadersSlice.reducer;
