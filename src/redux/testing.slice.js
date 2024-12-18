import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Services
import requestFactory from '../services/request.factory';
import { newLog } from '../services/logger';

// GET

export const GET_TESTS = createAsyncThunk(
	'testing/GET_TESTS',
	async (props) => {
		newLog('testing/GET_TESTS');
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

export const CREATE_TEST = createAsyncThunk(
	'testing/CREATE_TEST',
	async ({ taskId, newTest, userState, dispatch, testsState }) => {
		newLog('testing/CREATE_TEST');

		requestFactory({
			type: 'POST',
			url: `/tasks/${taskId}/test`,
			userState,
			dispatch,
			data: newTest,
		});

		return { newTest, testsState };
	}
);

export const testingSlice = createSlice({
	name: 'testing',
	initialState: {
		isLoading: false,
		currentTest: {},
		tests: [],
		totalTests: 0,
	},
	reducers: {
		SET_CURRENT_TEST: (state, { payload }) => {
			newLog('testing/SET_CURRENT_TEST');
			state.currentTest = payload;
		},
	},
	extraReducers: (builder) => {
		// GET

		builder.addCase(GET_TESTS.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_TESTS.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.tests = payload.data;
			state.totalTests = payload.total_count;
		});
		builder.addCase(GET_TESTS.rejected, (state) => {
			state.isLoading = false;
		});
		// POST

		builder.addCase(CREATE_TEST.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(CREATE_TEST.fulfilled, (state, { payload }) => {
			const { newTest, testsState } = payload;
			state.isLoading = false;
			const tmpTest = testsState[0];

			const newTests = newTest.batch.map((test, index) => ({
				...tmpTest,
				id: uuidv4(),
				uuid: uuidv4(),
				inputs: newTest.batch[index].values,
				targets: newTest.batch[index].targets,
			}));
			const tmpTests = [...newTests, ...testsState];
			state.tests = tmpTests;
		});
		builder.addCase(CREATE_TEST.rejected, (state) => {
			state.isLoading = false;
		});
	},
});

// Action creators are generated for each case reducer function
export const { SET_CURRENT_TEST } = testingSlice.actions;

export default testingSlice.reducer;
