import { createSlice } from '@reduxjs/toolkit';
import { newLog } from '../services/logger';

export const alertsSlice = createSlice({
	name: 'alerts',
	initialState: {
		list: [],
		error: null,
		warning: null,
		info: null,
		success: null,
	},
	reducers: {
		ADD_ALERT: (state, { payload }) => {
			newLog('alerts/ADD_ALERT');
			if (
				state.list &&
				state.list.length > 0 &&
				!state.list.some((alert) => alert.message === payload.message)
			) {
				state.list = [...state.list, payload];
				return;
			}
			state.list = [payload];
		},
		ADD_ERROR: (state, action) => {
			newLog('alerts/ADD_ERROR');
			if (state.error !== null) return;
			state.error = null;
			state.warning = null;
			state.info = null;
			state.success = null;
			state.error = action.payload;
		},
		ADD_WARNING: (state, action) => {
			newLog('alerts/ADD_WARNING');
			if (state.warning !== null) return;
			state.error = null;
			state.warning = null;
			state.info = null;
			state.success = null;
			state.warning = action.payload;
		},
		ADD_INFO: (state, action) => {
			newLog('alerts/ADD_INFO');
			if (state.info !== null) return;
			state.error = null;
			state.warning = null;
			state.info = null;
			state.success = null;
			state.info = action.payload;
		},
		ADD_SUCCESS: (state, action) => {
			newLog('alerts/ADD_SUCCESS');
			if (state.info !== null) return;
			state.error = null;
			state.warning = null;
			state.info = null;
			state.success = null;
			state.success = action.payload;
		},
		REMOVE_ALERT: (state, { payload }) => {
			newLog('alerts/REMOVE_ALERT');
			state.list = state.list.filter((element) => element.message !== payload);
			state.error = null;
			state.warning = null;
			state.info = null;
			state.success = null;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	ADD_ALERT,
	ADD_ERROR,
	ADD_WARNING,
	ADD_INFO,
	ADD_SUCCESS,
	REMOVE_ALERT,
} = alertsSlice.actions;

export default alertsSlice.reducer;
