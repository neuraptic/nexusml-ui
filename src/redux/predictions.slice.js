import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Services
import requestFactory from '../services/request.factory';
import { newLog } from '../services/logger';

// Alerts
import { ADD_ALERT, REMOVE_ALERT } from './alerts.slice';
import { TEST_CREATED } from '../AlertsList/testsAlerts';

// GET

export const GET_PREDICTIONS = createAsyncThunk(
	'predictions/GET_PREDICTIONS',
	async (props) => {
		newLog('predictions/GET_PREDICTIONS');
		const tmpProps = [];
		let isPage = false;
		let isPerPage = false;
		let isAIModel = false;
		const { dispatch, taskId, userState } = props;

		Object.keys(props).forEach((prop) => {
			if (
				(prop !== '' || prop !== undefined || prop !== null) &&
				prop !== 'taskId' &&
				prop !== 'userState' &&
				prop !== 'dispatch' &&
				props[prop] !== '' &&
				props[prop] !== false
			) {
				if (prop === 'page') isPage = true;
				if (prop === 'per_page') isPerPage = true;
				if (prop === 'ai_model') isAIModel = true;
				tmpProps.push({ [prop]: props[prop] });
			}
		});

		// Create the query based on the array and set the default options
		let query = '?';
		// Set the default options
		if (isPage)
			query += `page=${tmpProps.find((prop) => prop['page'])['page']}`;
		else query += 'page=1';
		if (isPerPage)
			query += `&per_page=${
				tmpProps.find((prop) => prop['per_page'])['per_page']
			}`;
		if (isAIModel)
			query += `&ai_model=${
				tmpProps.find((prop) => prop['ai_model'])['ai_model']
			}`;
		else query += '&per_page=25';
		query += '&total_count=true';

		// Create the query
		tmpProps.forEach((prop) => {
			const propName = Object.keys(prop)[0];
			const propValue = prop[propName];
			if (
				propName !== 'page' &&
				propName !== 'per_page' &&
				propName !== 'total_count' &&
				propName !== 'query'
			)
				query += `&${propName}=${propValue}`;
			if (propName === 'query') query += `&${propValue}`;
		});

		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/prediction-logs${query}`,
			userState,
			dispatch,
		});

		return res;
	}
);

// POST

export const CREATE_PREDICTION = createAsyncThunk(
	'predictions/CREATE_PREDICTION',
	async ({
		taskId,
		newPrediction,
		userState,
		dispatch,
		formatedPrediction,
	}) => {
		newLog('predictions/CREATE_PREDICTION');

		const res = await requestFactory({
			type: 'POST',
			url: `/tasks/${taskId}/predict`,
			userState,
			dispatch,
			data: newPrediction,
		});

		if (res) {
			dispatch(ADD_ALERT({ type: 'success', message: TEST_CREATED }));
			setTimeout(() => {
				dispatch(REMOVE_ALERT(TEST_CREATED));
			}, 2000);

			return formatedPrediction.map((prediction, index) => ({
				...prediction,
				outputs: res.predictions.outputs[index],
			}));
		}
	}
);

export const predictionSlice = createSlice({
	name: 'predictions',
	initialState: {
		isLoading: false,
		currentPrediction: {},
		predictions: [
			{
				activity_at: '2024-10-11T08:36:20Z',
				created_at: '2024-10-11T08:35:38Z',
				created_by: {
					id: 'UkdoLUFRc1g',
					type: 'user',
					uuid: '884c1ef7-d450-44f7-954c-270e211754e4',
				},
				id: 'R3FtaGxLUy0',
				inputs: [
					{
						element: 'Float multi',
						value: [
							12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12,
							43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43,
							2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3,
							5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5,
							34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34,
							34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34,
							54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54,
							18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18,
							76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76,
							58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58,
							34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34,
							72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72,
							45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45,
							62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62,
							45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45,
							12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12,
							43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43,
							2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3,
							5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5,
							34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34,
							34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34,
							54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54,
							18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18,
							76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76,
							58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58,
							34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34,
							72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72,
							45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45,
							62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62,
							45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45,
							12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12,
							43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45,
						],
					},
					{
						element: 'Input 1',
						value: 'SHpCQVBRLVA',
					},
					{
						element: 'Test img multivalue',
						value: ['SHpCQVBRLVA'],
					},
				],
				labeling_status: 'unlabeled',
				metadata: [],
				modified_at: '2024-10-11T08:36:20Z',
				modified_by: {
					id: 'UkdoLUFRc1g',
					type: 'user',
					uuid: '884c1ef7-d450-44f7-954c-270e211754e4',
				},
				outputs: [],
				uuid: '0000611b-7349-4d26-9b65-101ec1844a04',
			},
			{
				activity_at: '2024-10-11T08:36:20Z',
				created_at: '2024-10-11T08:35:38Z',
				created_by: {
					id: 'UkdoLUFRc1g',
					type: 'user',
					uuid: '884c1ef7-d450-44f7-954c-270e211754e4',
				},
				id: 'R3FtaGxLUy0',
				inputs: [
					{
						element: 'Float multi',
						value: [
							12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12,
							43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43,
							2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3,
							5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5,
							34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34,
							34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34,
							54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54,
							18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18,
							76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76,
							58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58,
							34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34,
							72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72,
							45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45,
							62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62,
							45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45,
							12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12,
							43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43,
							2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3,
							5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5,
							34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34,
							34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34,
							54, 18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54,
							18, 76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18,
							76, 58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76,
							58, 34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58,
							34, 72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34,
							72, 45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72,
							45, 62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45,
							62, 45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62,
							45, 12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45,
							12, 43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45, 12,
							43, 2, 3, 5, 34, 34, 54, 18, 76, 58, 34, 72, 45, 62, 45,
						],
					},
					{
						element: 'Input 1',
						value: 'SHpCQVBRLVA',
					},
					{
						element: 'Test img multivalue',
						value: ['SHpCQVBRLVA', 'SHpCQVBRLVA'],
					},
				],
				labeling_status: 'unlabeled',
				metadata: [],
				modified_at: '2024-10-11T08:36:20Z',
				modified_by: {
					id: 'UkdoLUFRc1g',
					type: 'user',
					uuid: '884c1ef7-d450-44f7-954c-270e211754e4',
				},
				outputs: [],
				uuid: 'b953619b-7349-4d26-9b65-101ec1844a04',
			},
		],
		totalPredictions: 0,
	},
	reducers: {
		SET_CURRENT_PREDICTION: (state, { payload }) => {
			newLog('predictions/SET_CURRENT_PREDICTION');
			state.currentPrediction = payload;
		},
	},
	extraReducers: (builder) => {
		// GET

		builder.addCase(GET_PREDICTIONS.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_PREDICTIONS.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.predictions = payload.data;
			state.totalPredictions = payload.total_count;
		});
		builder.addCase(GET_PREDICTIONS.rejected, (state) => {
			state.isLoading = false;
		});
		// POST

		builder.addCase(CREATE_PREDICTION.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(CREATE_PREDICTION.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.predictions = [...state.predictions, payload];
		});
		builder.addCase(CREATE_PREDICTION.rejected, (state) => {
			state.isLoading = false;
		});
	},
});

// Action creators are generated for each case reducer function
export const { SET_CURRENT_PREDICTION } = predictionSlice.actions;

export default predictionSlice.reducer;
