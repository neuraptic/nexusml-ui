import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Services
import requestFactory from '../services/request.factory';
import { newLog } from '../services/logger';

// ASYNC THUNKS
import { userSliceConfig } from './user.slice';

export const GET_USER = createAsyncThunk(
	'user/GET_USER',
	async ({ userState, dispatch }) => {
		newLog('user/CUSTOM_GET_USER');
		return 'true';
	}
);

const customUserSlice = createSlice({
	...userSliceConfig,
	initialState: {
		...userSliceConfig.initialState,
		test: 'test is working: false',
	},
	extraReducers: {
		...userSliceConfig.extraReducers,
		// GET

		[GET_USER.pending]: (state) => {
			state.isLoading = true;
		},
		[GET_USER.fulfilled]: (state, { payload }) => {
			state.test = `test is working: ${payload}`;
		},
		[GET_USER.rejected]: (state) => {
			state.test = `test is working: false`;
		},
	},
});

// Export the configured slice reducer
// export const customUserSlice = configurecustomUserSlice();
export const {
	SET_IS_NEW_USER,
	SET_ACCESS_TOKEN,
	SET_USER_LOCATION,
	SET_USER_INFO,
	SET_AUTH_ENABLED,
} = customUserSlice.actions;

export default customUserSlice.reducer;
