import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Services
import requestFactory from '../services/request.factory';
import { newLog } from '../services/logger';

// Redux
import { GET_TASK_PERMISSIONS } from './tasks.slice';
import {
	LOAD_ORGANIZATION_SUBSCRIPTION,
	LOAD_ORGANIZATION_USAGE,
	LOAD_ORGANIZATION_USERS,
} from './loaders.slice';

// CREATE REQUESTS
export const CREATE_ORGANIZATION = createAsyncThunk(
	'organization/CREATE_ORGANIZATION',
	async ({ userState, dispatch, data, navigate }) => {
		newLog('organization/CREATE_ORGANIZATION');
		if (data.address !== '') {
			const res = await requestFactory({
				type: 'POST',
				url: '/organizations',
				data,
				userState,
				dispatch,
			});

			if (res) return res;
		}
		navigate('/create-organization');
	}
);

// GET REQUESTS

export const GET_ORGANIZATION = createAsyncThunk(
	'organization/GET_ORGANIZATION',
	async ({ userState, dispatch, navigate }) => {
		newLog('organization/GET_ORGANIZATION');
		const res = await requestFactory({
			type: 'GET',
			url: '/myaccount/organization',
			userState,
			dispatch,
		});

		if (res) return res;
		navigate('/create-organization');
	}
);

export const GET_ORGANIZATION_FILE = createAsyncThunk(
	'organization/GET_ORGANIZATION_FILE',
	async ({ organizationId, fileId, userState, dispatch }) => {
		newLog('organization/GET_ORGANIZATION_FILE');
		const res = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/files/${fileId}`,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

export const GET_ORGANIZATION_USERS = createAsyncThunk(
	'organization/GET_ORGANIZATION_USERS',
	async ({ organizationId, userState, page = 1, perPage = 50, dispatch }) => {
		newLog('organization/GET_ORGANIZATION_USERS');
		const res = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/users?page=${page}&per_page=${perPage}&total_count=true`,
			userState,
			dispatch,
		});

		dispatch(LOAD_ORGANIZATION_USERS(false));

		if (res && res.data && res.data.length > 0) {
			return Promise.all(
				res.data.map((user) =>
					requestFactory({
						type: 'GET',
						url: `/organizations/${organizationId}/users/${user.uuid}`,
						userState,
						dispatch,
					})
				)
			).then((result) => [result, res.total_count]);
		}
	}
);

export const GET_ORGANIZATION_USER_BY_ID = createAsyncThunk(
	'organization/GET_ORGANIZATION_USER_BY_ID',
	async ({ organizationId, userState, userId, dispatch }) => {
		newLog('organization/GET_ORGANIZATION_USER_BY_ID');
		const res = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/users/${userId}`,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

export const GET_ORGANIZATION_SUBSCRIPTION = createAsyncThunk(
	'organization/GET_ORGANIZATION_SUBSCRIPTION',
	async ({ organizationId, userState, dispatch }) => {
		newLog('organization/GET_ORGANIZATION_SUBSCRIPTION');
		const res = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/subscription`,
			userState,
			dispatch,
		});

		dispatch(LOAD_ORGANIZATION_SUBSCRIPTION(false));
		dispatch(LOAD_ORGANIZATION_USAGE(false));

		if (res) return res;
	}
);

export const GET_ORGANIZATION_COLLABORATORS = createAsyncThunk(
	'organization/GET_ORGANIZATION_COLLABORATORS',
	async ({ organizationId, userState, page = 1, perPage = 5, dispatch }) => {
		newLog('organization/GET_ORGANIZATION_COLLABORATORS');
		const res = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/collaborators?page=${page}&per_page=${perPage}&total_count=true`,
			userState,
			dispatch,
		});

		if (res && res.data && res.data.length > 0) {
			return Promise.all(
				res.data.map((collaborator) =>
					requestFactory({
						type: 'GET',
						url: `/organizations/${organizationId}/collaborators/${collaborator.id}`,
						userState,
						dispatch,
					})
				)
			).then((result) => [result, res.total_count]);
		}

		return [[], res.total_count];
	}
);

export const GET_ORGANIZATION_ROLES = createAsyncThunk(
	'organization/GET_ORGANIZATION_ROLES',
	async ({ organizationId, userState, dispatch }) => {
		newLog('organization/GET_ORGANIZATION_ROLES');
		const res = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/roles`,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

export const GET_ORGANIZATION_APPS = createAsyncThunk(
	'organization/GET_ORGANIZATION_APPS',
	async ({ organizationId, userState, dispatch }) => {
		newLog('organization/GET_ORGANIZATION_APPS');
		const res = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/apps`,
			userState,
			dispatch,
		});

		const tmpApps = res.filter(
			(app) =>
				app.name !== 'inference_service' &&
				app.name !== 'cl_service' &&
				app.name !== 'monitoring_service' &&
				app.name !== 'al_service'
		);

		if (res && res.length > 0) {
			return Promise.all(
				tmpApps.map(async (app) => {
					const tmp = await requestFactory({
						type: 'GET',
						url: `/organizations/${organizationId}/apps/${app.id}/api-key`,
						userState,
						dispatch,
					});
					return {
						...app,
						apiKey: tmp.token,
						scopes: tmp.scopes,
						expireAt: tmp.expire_at,
					};
				})
			);
		}
	}
);

// POST REQUESTS

export const CREATE_ORGANIZATION_FILE = createAsyncThunk(
	'organization/CREATE_ORGANIZATION_FILE',
	async ({ organizationId, file, userState, dispatch }) => {
		newLog('organization/CREATE_ORGANIZATION_FILE');

		const { name: filename, size } = file;

		const res = await requestFactory({
			type: 'POST',
			url: `/organizations/${organizationId}/files`,
			userState,
			data: { filename, size },
			dispatch,
		}).then((result) => result);

		const formData = new FormData();
		const { url, fields } = res['upload_url'];

		Object.keys(fields).forEach((key) => {
			formData.append(key, fields[key]);
		});
		formData.append('file', file);

		const awsRes = await fetch(url, {
			method: 'POST',
			body: formData,
		}).then((awsResponse) => awsResponse);

		if (awsRes && awsRes.ok) return res;
	}
);

export const CREATE_ORGANIZATION_USER_PERMISSION = createAsyncThunk(
	'organization/CREATE_ORGANIZATION_USER_PERMISSION',
	async ({
		organizationId,
		userId,
		selectedPermissions,
		userState,
		dispatch,
		taskId,
	}) => {
		newLog('organization/CREATE_ORGANIZATION_USER_PERMISSION');
		await requestFactory({
			type: 'POST',
			url: `/organizations/${organizationId}/users/${userId}/permissions`,
			userState,
			data: selectedPermissions,
			dispatch,
		}).then(
			dispatch(
				GET_TASK_PERMISSIONS({
					taskId,
					userState,
					dispatch,
				})
			)
		);
	}
);

export const CREATE_ORGANIZATION_ROLE_PERMISSION = createAsyncThunk(
	'organization/CREATE_ORGANIZATION_ROLE_PERMISSION',
	async ({
		organizationId,
		roleId,
		selectedPermissions,
		userState,
		dispatch,
		taskId,
	}) => {
		newLog('organization/CREATE_ORGANIZATION_ROLE_PERMISSION');
		await requestFactory({
			type: 'POST',
			url: `/organizations/${organizationId}/roles/${roleId}/permissions`,
			userState,
			data: selectedPermissions,
			dispatch,
		}).then(
			dispatch(
				GET_TASK_PERMISSIONS({
					taskId,
					userState,
					dispatch,
				})
			)
		);
	}
);

// PUT REQUESTS

export const UPDATE_ORGANIZATION_INFO = createAsyncThunk(
	'organization/UPDATE_ORGANIZATION_INFO',
	async ({ organizationId, organizationInfo, userState, dispatch }) => {
		newLog('organization/UPDATE_ORGANIZATION_INFO');
		const res = await requestFactory({
			type: 'PUT',
			url: `/organizations/${organizationId}`,
			userState,
			data: organizationInfo,
			dispatch,
		});

		if (res) return res;
	}
);

export const UPDATE_ORGANIZATION_APP = createAsyncThunk(
	'organization/UPDATE_ORGANIZATION_APP',
	async ({ organizationId, appInfo, userState, appId, dispatch }) => {
		newLog('organization/UPDATE_ORGANIZATION_APP');
		const res1 = await requestFactory({
			type: 'PUT',
			url: `/organizations/${organizationId}/apps/${appId}`,
			userState,
			data: appInfo.client,
			dispatch,
		});
		const res2 = await requestFactory({
			type: 'PUT',
			url: `/organizations/${organizationId}/apps/${appId}/api-key`,
			userState,
			data: appInfo.apiKey,
			dispatch,
		});

		if (res1 && res2) return { ...res1, ...res2 };
	}
);

// DELETE

export const DELETE_ORGANIZATION = createAsyncThunk(
	'organization/DELETE_ORGANIZATION',
	async ({ organizationId, userState, dispatch }) => {
		newLog('organization/DELETE_ORGANIZATION');

		await requestFactory({
			type: 'DELETE',
			url: `/organizations/${organizationId}`,
			userState,
			dispatch,
		}).then(GET_ORGANIZATION_APPS({ organizationId, userState }));
	}
);

export const DELETE_ORGANIZATION_USER_ROLE = createAsyncThunk(
	'organization/DELETE_ORGANIZATION_USER_ROLE',
	async ({ organizationId, userId, selectedRoles, userState, dispatch }) => {
		newLog('organization/DELETE_ORGANIZATION_USER_ROLE');

		Promise.all(
			selectedRoles.map((roleId) =>
				requestFactory({
					type: 'DELETE',
					url: `/organizations/${organizationId}/users/${userId}/roles/${roleId}`,
					userState,
					dispatch,
				})
			)
		).then(() => GET_ORGANIZATION_USERS({ organizationId, userState }));
	}
);

export const DELETE_ORGANIZATION_USER = createAsyncThunk(
	'organization/DELETE_ORGANIZATION_USER',
	async ({ organizationId, userId, userState, dispatch }) => {
		newLog('organization/DELETE_ORGANIZATION_USER');

		await requestFactory({
			type: 'DELETE',
			url: `/organizations/${organizationId}/users/${userId}`,
			userState,
			dispatch,
		}).then(GET_ORGANIZATION_USERS({ organizationId, userState }));
	}
);

export const DELETE_ORGANIZATION_COLLABORATOR = createAsyncThunk(
	'organization/DELETE_ORGANIZATION_COLLABORATOR',
	async ({ organizationId, collaboratorId, userState, dispatch }) => {
		newLog('organization/DELETE_ORGANIZATION_COLLABORATOR');

		await requestFactory({
			type: 'DELETE',
			url: `/organizations/${organizationId}/collaborators/${collaboratorId}`,
			userState,
			dispatch,
		}).then(GET_ORGANIZATION_USERS({ organizationId, userState }));
	}
);

export const DELETE_ORGANIZATION_USER_PERMISSION = createAsyncThunk(
	'organization/DELETE_ORGANIZATION_USER_PERMISSION',
	async ({
		organizationId,
		userId,
		selectedPermissions,
		userState,
		dispatch,
	}) => {
		newLog('organization/DELETE_ORGANIZATION_USER_PERMISSION');

		await requestFactory({
			type: 'DELETE',
			url: `/organizations/${organizationId}/users/${userId}/permissions?action=${
				selectedPermissions.action
			}&allow=${selectedPermissions.allow}&resource_type=${
				selectedPermissions.resource_type
			}${
				selectedPermissions.resource_uuid !== undefined
					? `&resource_uuid=${selectedPermissions.resource_uuid}`
					: ''
			}`,
			userState,
			dispatch,
		});
	}
);

export const DELETE_ORGANIZATION_COLLABORATOR_PERMISSION = createAsyncThunk(
	'organization/DELETE_ORGANIZATION_COLLABORATOR_PERMISSION',
	async ({
		organizationId,
		collaboratorId,
		selectedPermissions,
		userState,
		dispatch,
	}) => {
		newLog('organization/DELETE_ORGANIZATION_COLLABORATOR_PERMISSION');

		await requestFactory({
			type: 'DELETE',
			url: `/organizations/${organizationId}/collaborators/${collaboratorId}/permissions?action=${
				selectedPermissions.action
			}&allow=${selectedPermissions.allow}&resource_type=${
				selectedPermissions.resource_type
			}${
				selectedPermissions.resource_uuid !== undefined
					? `&resource_uuid=${selectedPermissions.resource_uuid}`
					: ''
			}`,
			userState,
			dispatch,
		});
	}
);

export const DELETE_ORGANIZATION_ROLE = createAsyncThunk(
	'organization/DELETE_ORGANIZATION_ROLE',
	async ({ organizationId, roleId, userState, dispatch }) => {
		newLog('organization/DELETE_ORGANIZATION_ROLE');

		await requestFactory({
			type: 'DELETE',
			url: `/organizations/${organizationId}/roles/${roleId}`,
			userState,
			dispatch,
		});
	}
);

export const DELETE_ORGANIZATION_ROLE_PERMISSION = createAsyncThunk(
	'organization/DELETE_ORGANIZATION_ROLE_PERMISSION',
	async ({
		organizationId,
		roleId,
		selectedPermissions,
		userState,
		dispatch,
	}) => {
		newLog('organization/DELETE_ORGANIZATION_ROLE_PERMISSION');

		await requestFactory({
			type: 'DELETE',
			url: `/organizations/${organizationId}/roles/${roleId}/permissions?action=${
				selectedPermissions.action
			}&allow=${selectedPermissions.allow}&resource_type=${
				selectedPermissions.resource_type
			}${
				selectedPermissions.resource_uuid &&
				`&resource_uuid=${selectedPermissions.resource_uuid}`
			}`,
			userState,
			dispatch,
		});
	}
);

export const DELETE_ORGANIZATION_APP = createAsyncThunk(
	'organization/DELETE_ORGANIZATION_APP',
	async ({ organizationId, appId, userState, dispatch }) => {
		newLog('organization/DELETE_ORGANIZATION_APP');

		await requestFactory({
			type: 'DELETE',
			url: `/organizations/${organizationId}/apps/${appId}`,
			userState,
			dispatch,
		}).then(GET_ORGANIZATION_APPS({ organizationId, userState }));
	}
);

export const organizationSlice = createSlice({
	name: 'organization',
	initialState: {
		isLoading: true,
		usersIsLoading: true,
		collaboratorsIsLoading: true,
		rolesIsLoading: true,
		appsIsLoading: true,
		info: {},
		subscription: {},
		users: {
			displayedUsers: [],
			totalUsers: null,
		},
		collaborators: {
			displayedCollaborators: [],
			totalCollaborators: null,
		},
		roles: [],
		apps: [],
	},
	reducers: {},
	extraReducers: (builder) => {
		// GET

		builder.addCase(GET_ORGANIZATION.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_ORGANIZATION.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.info = payload || {};
		});
		builder.addCase(GET_ORGANIZATION.rejected, (state) => {
			state.isLoading = true;
		});

		builder.addCase(GET_ORGANIZATION_USERS.pending, (state) => {
			state.usersIsLoading = true;
		});
		builder.addCase(GET_ORGANIZATION_USERS.fulfilled, (state, { payload }) => {
			state.usersIsLoading = false;
			const [users, totalCount] = payload;
			state.users.displayedUsers = users || [];
			state.users.totalUsers = totalCount || [];
		});
		builder.addCase(GET_ORGANIZATION_USERS.rejected, (state) => {
			state.usersIsLoading = true;
		});

		builder.addCase(GET_ORGANIZATION_SUBSCRIPTION.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(
			GET_ORGANIZATION_SUBSCRIPTION.fulfilled,
			(state, { payload }) => {
				state.isLoading = false;
				state.subscription = payload || {};
			}
		);
		builder.addCase(GET_ORGANIZATION_SUBSCRIPTION.rejected, (state) => {
			state.isLoading = true;
		});

		builder.addCase(GET_ORGANIZATION_COLLABORATORS.pending, (state) => {
			state.collaboratorsIsLoading = true;
		});
		builder.addCase(
			GET_ORGANIZATION_COLLABORATORS.fulfilled,
			(state, { payload }) => {
				state.collaboratorsIsLoading = false;
				const [collaborators, totalCount] = payload || [];
				state.collaborators.displayedCollaborators = collaborators || [];
				state.collaborators.totalCollaborators = totalCount || [];
			}
		);
		builder.addCase(GET_ORGANIZATION_COLLABORATORS.rejected, (state) => {
			state.collaboratorsIsLoading = true;
		});

		builder.addCase(GET_ORGANIZATION_ROLES.pending, (state) => {
			state.rolesIsLoading = true;
		});
		builder.addCase(GET_ORGANIZATION_ROLES.fulfilled, (state, { payload }) => {
			state.rolesIsLoading = false;
			state.roles = payload || [];
		});
		builder.addCase(GET_ORGANIZATION_ROLES.rejected, (state) => {
			state.rolesIsLoading = true;
		});

		builder.addCase(GET_ORGANIZATION_APPS.pending, (state) => {
			state.appsIsLoading = true;
		});
		builder.addCase(GET_ORGANIZATION_APPS.fulfilled, (state, { payload }) => {
			state.appsIsLoading = false;
			if (payload) state.apps = payload || [];
		});
		builder.addCase(GET_ORGANIZATION_APPS.rejected, (state) => {
			state.appsIsLoading = true;
		});

		// PUT

		builder.addCase(UPDATE_ORGANIZATION_INFO.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(
			UPDATE_ORGANIZATION_INFO.fulfilled,
			(state, { payload }) => {
				state.info = payload || {};
			}
		);
		builder.addCase(UPDATE_ORGANIZATION_INFO.rejected, (state) => {
			state.isLoading = true;
		});
	},
});

// Action creators are generated for each case reducer function
// export const {} = organizationSlice.actions;

export default organizationSlice.reducer;
