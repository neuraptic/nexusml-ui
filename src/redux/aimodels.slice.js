import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Services
import requestFactory from '../services/request.factory';
import { newLog } from '../services/logger';

// CREATE

// GET

export const GET_MODELS = createAsyncThunk(
	'aimodels/GET_MODELS',
	async ({ userState, dispatch, taskId }) => {
		newLog('aimodels/GET_MODELS');
		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/models`,
			userState,
			dispatch,
		});
		if (res) return res;
	}
);

export const GET_PRODUCTION_MODEL = createAsyncThunk(
	'aimodels/GET_PRODUCTION_MODELS',
	async ({ userState, dispatch, taskId }) => {
		newLog('aimodels/GET_PRODUCTION_MODELS');
		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/deployment?environment=production`,
			userState,
			dispatch,
		});
		if (res) return res;
	}
);

export const GET_TESTING_MODEL = createAsyncThunk(
	'aimodels/GET_TESTING_MODEL',
	async ({ userState, dispatch, taskId }) => {
		newLog('aimodels/GET_TESTING_MODEL');
		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/deployment?environment=testing`,
			userState,
			dispatch,
		});
		if (res) return res;
	}
);

// POST

export const SET_PRODUCTION_MODEL = createAsyncThunk(
	'aimodels/SET_PRODUCTION_MODEL',
	async ({ userState, dispatch, taskId, modelId }) => {
		newLog('aimodels/SET_PRODUCTION_MODEL');
		const res = await requestFactory({
			type: 'POST',
			url: `/tasks/${taskId}/deployment`,
			userState,
			dispatch,
			data: { ai_model: modelId, environment: 'production' },
		});
		if (res) return res;
	}
);

export const SET_TESTING_MODEL = createAsyncThunk(
	'aimodels/SET_TESTING_MODEL',
	async ({ userState, dispatch, taskId, modelId }) => {
		newLog('aimodels/SET_TESTING_MODEL');
		const res = await requestFactory({
			type: 'POST',
			url: `/tasks/${taskId}/deployment`,
			userState,
			dispatch,
			data: { ai_model: modelId, environment: 'testing' },
		});
		if (res) return res;
	}
);

export const aimodelsSlice = createSlice({
	name: 'aimodels',
	initialState: {
		isLoading: true,
		aimodels: [],
		testingAIModel: {},
		productionAIModel: {},
	},
	reducers: {},
	extraReducers: (builder) => {
		// GET

		builder.addCase(GET_MODELS.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_MODELS.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.aimodels = payload;
		});
		builder.addCase(GET_MODELS.rejected, (state) => {
			state.isLoading = true;
		});

		builder.addCase(GET_TESTING_MODEL.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_TESTING_MODEL.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			if (payload) state.testingAIModel = payload;
		});
		builder.addCase(GET_TESTING_MODEL.rejected, (state) => {
			state.isLoading = true;
		});

		builder.addCase(GET_PRODUCTION_MODEL.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_PRODUCTION_MODEL.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			if (payload) state.productionAIModel = payload;
		});
		builder.addCase(GET_PRODUCTION_MODEL.rejected, (state) => {
			state.isLoading = true;
		});
	},
});

// Action creators are generated for each case reducer function
// export const {} = userSlice.actions;

export default aimodelsSlice.reducer;
