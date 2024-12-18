import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Services
import requestFactory from '../services/request.factory';
import { newLog } from '../services/logger';

// GET

export const GET_USER = createAsyncThunk(
	'user/GET_USER',
	async ({ userState, navigate }) => {
		newLog('user/GET_USER');

		const response = await fetch(
			`${process.env.NEXUSML_UI_API_URL}/myaccount`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${userState.accessToken}`,
					'content-type': 'application/json',
					cors: 'no-cors',
				},
			}
		);

		if (response) {
			if (response.status === 401) {
				navigate('/create-organization');
			}
			const res = await Promise.resolve(response.json()).then((data) => data);

			if (res.first_name === '') {
				navigate('/complete-profile');
			}

			return { res, status: response.status };
		}
	}
);

export const GET_USER_SETTINGS = createAsyncThunk(
	'user/GET_USER_SETTINGS',
	async ({ userState, dispatch }) => {
		newLog('user/GET_USER_SETTINGS');
		const res = await requestFactory({
			type: 'GET',
			url: `/myaccount/settings`,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

export const GET_USER_PERMISSIONS_AND_ROLES = createAsyncThunk(
	'user/GET_USER_PERMISSIONS_AND_ROLES',
	async ({ userState, organizationId, userId, dispatch }) => {
		newLog('user/GET_USER_PERMISSIONS_AND_ROLES');
		const res1 = await requestFactory({
			type: 'GET',
			url: `/myaccount/permissions`,
			userState,
			dispatch,
		});

		const res2 = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/users/${userId}/roles`,
			userState,
			dispatch,
		});

		if (res1 && res2) return { permissions: res1.data, roles: res2.roles };
	}
);

// PUT

export const UPDATE_EMAIL_NOTIFICATIONS = createAsyncThunk(
	'user/UPDATE_EMAIL_NOTIFICATIONS',
	async ({ data, userState, dispatch }) => {
		newLog('user/UPDATE_EMAIL_NOTIFICATIONS');
		const res = await requestFactory({
			type: 'PUT',
			url: `/myaccount/settings`,
			data,
			userState,
			dispatch,
		});

		return res;
	}
);

export const userSliceConfig = {
	name: 'user',
	initialState: {
		id: null,
		uid: null,
		location: null,
		isLoading: true,
		isAuthorized: false,
		first_name: null,
		last_name: null,
		email: null,
		accessToken: '',
		isNew: null,
		termsAgreed: null,
		notifications: null,
		permissions: [],
		roles: [],
		isVerified: true,
		defaultAPIKeyEnabled: false,
	},
	reducers: {
		SET_ACCESS_TOKEN: (state, { payload }) => {
			newLog('user/SET_ACCESS_TOKEN');
			state.accessToken = payload;
			state.isAuthorized = true;
		},
		SET_USER_LOCATION: (state, { payload }) => {
			newLog('user/SET_USER_LOCATION');
			state.location = payload;
		},
		SET_IS_NEW_USER: (state, { payload }) => {
			newLog('user/SET_IS_NEW_USER');
			state.isNew = payload;
		},
		SET_USER_INFO: (state, { payload }) => {
			newLog('user/SET_USER_INFO');
			state.first_name = payload.first_name;
			state.last_name = payload.last_name;
		},
		SET_DEFAULT_API_KEY_ENABLED: (state, { payload }) => {
			newLog('user/SET_DEFAULT_API_KEY_ENABLED');
			state.accessToken = payload.default_api_key;
			state.defaultAPIKeyEnabled = payload.enabled;
		},
	},
	extraReducers: (builder) => {
		// GET

		builder.addCase(GET_USER.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_USER.fulfilled, (state, { payload }) => {
			state.isLoading = false;

			if (payload.status === 403) {
				state.isVerified = false;
			} else {
				state.termsAgreed = payload.terms_agreed;
				state.id = payload.res.id;
				state.uid = payload.res.uid;
				state.first_name = payload.res.first_name;
				state.last_name = payload.res.last_name;
				state.email = payload.res.email;
				state.isVerified = true;
			}
		});
		builder.addCase(GET_USER.rejected, (state) => {
			state.isLoading = true;
		});

		builder.addCase(GET_USER_SETTINGS.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_USER_SETTINGS.fulfilled, (state, { payload }) => {
			state.isLoading = false;

			state.notifications = payload?.notifications || false;
		});
		builder.addCase(GET_USER_SETTINGS.rejected, (state) => {
			state.isLoading = true;
		});

		builder.addCase(GET_USER_PERMISSIONS_AND_ROLES.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(
			GET_USER_PERMISSIONS_AND_ROLES.fulfilled,
			(state, { payload }) => {
				state.isLoading = false;

				state.roles = payload.roles;
				state.permissions = payload.permissions;
			}
		);
		builder.addCase(GET_USER_PERMISSIONS_AND_ROLES.rejected, (state) => {
			state.isLoading = true;
		});

		// PUT

		builder.addCase(UPDATE_EMAIL_NOTIFICATIONS.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(
			UPDATE_EMAIL_NOTIFICATIONS.fulfilled,
			(state, { payload }) => {
				state.isLoading = false;
				state.notifications = payload.notifications;
			}
		);
		builder.addCase(UPDATE_EMAIL_NOTIFICATIONS.rejected, (state) => {
			state.isLoading = false;
		});
	},
};

const userSlice = createSlice(userSliceConfig);

// Export the configured slice reducer
export const {
	SET_IS_NEW_USER,
	SET_ACCESS_TOKEN,
	SET_USER_LOCATION,
	SET_USER_INFO,
	SET_DEFAULT_API_KEY_ENABLED,
} = userSlice.actions;

export default userSlice.reducer;
