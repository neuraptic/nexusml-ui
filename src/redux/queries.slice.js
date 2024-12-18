import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Services
import requestFactory from '../services/request.factory';
import { newLog } from '../services/logger';

export const GET_SAVED_QUERIES = createAsyncThunk(
	'query/GET_SAVED_QUERIES',
	async (data) => {
		newLog('query/GET_SAVED_QUERIES');
		const res = await requestFactory(
			'get',
			`/task_account_settings`,
			null,
			data.testServerId
		);

		if (res) return res;
	}
);

export const UPDATE_SAVED_QUERIES = createAsyncThunk(
	'query/UPDATE_SAVED_QUERIES',
	async (data) => {
		newLog('query/UPDATE_SAVED_QUERIES');
		const savedQueries = await requestFactory(
			'get',
			`/task_account_settings`,
			null,
			data.testServerId
		);

		const query = savedQueries.settings.length
			? [...savedQueries.settings, data.query]
			: [data.query];

		const res = await requestFactory(
			'put',
			`/task_account_settings/update`,
			{ settings: query },
			data.testServerId
		);

		if (res)
			return {
				savedQueries: res.settings,
				query: data.query,
			};
	}
);

export const querySlice = createSlice({
	name: 'query',
	initialState: {
		isLoading: true,
		query: { match_all: {} },
		savedQueries: [],
	},
	reducers: {
		UPDATE_QUERY: (state, { payload }) => {
			newLog('query/UPDATE_QUERY');
			state.query = payload;
		},
	},
	extraReducers: {
		[GET_SAVED_QUERIES.pending]: (state) => {
			state.isLoading = true;
		},
		[GET_SAVED_QUERIES.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.savedQueries = payload.settings;
		},
		[GET_SAVED_QUERIES.rejected]: (state) => {
			state.isLoading = false;
		},
		[UPDATE_SAVED_QUERIES.pending]: (state) => {
			state.isLoading = true;
		},
		[UPDATE_SAVED_QUERIES.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.savedQueries = state.savedQueries.concat(payload.savedQueries);
			state.query = payload.query;
		},
		[UPDATE_SAVED_QUERIES.rejected]: (state) => {
			state.isLoading = false;
		},
	},
});

export const { UPDATE_QUERY } = querySlice.actions;

export default querySlice.reducer;
