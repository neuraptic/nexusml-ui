import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Services
import requestFactory from '../services/request.factory';
import { newLog } from '../services/logger';

// Alerts
import { ADD_ALERT, REMOVE_ALERT } from './alerts.slice';
import {
	EXAMPLE_CREATED,
	SHAPE_UPDATED_SUCCESS,
} from '../AlertsList/examplesAlerts';

// CREATE
export const CREATE_EXAMPLE = createAsyncThunk(
	'examples/CREATE_EXAMPLE',
	async ({ taskId, newExample, userState, dispatch }) => {
		newLog('examples/CREATE_EXAMPLE');
		console.log(taskId, newExample, userState);
		const res = await requestFactory({
			type: 'POST',
			url: `/tasks/${taskId}/examples`,
			data: newExample,
			userState,
			dispatch,
		});

		console.log(res);

		if (res) {
			dispatch(ADD_ALERT({ type: 'success', message: EXAMPLE_CREATED }));
			setTimeout(() => {
				dispatch(REMOVE_ALERT(EXAMPLE_CREATED));
			}, 2000);
		}
	}
);

export const CREATE_TAG = createAsyncThunk(
	'examples/CREATE_TAG',
	async ({ taskId, userState, dispatch, newTag }) => {
		newLog('examples/CREATE_TAG');

		const res = await requestFactory({
			type: 'POST',
			url: `/tasks/${taskId}/tags`,
			userState,
			dispatch,
			data: newTag,
		});

		if (res) return res;
	}
);

export const CREATE_SHAPE = createAsyncThunk(
	'examples/CREATE_SHAPE',
	async ({ taskId, exampleId, userState, dispatch, newShape }) => {
		newLog('examples/CREATE_SHAPE');

		const res = await requestFactory({
			type: 'POST',
			url: `/tasks/${taskId}/examples/${exampleId}/shapes`,
			userState,
			dispatch,
			data: newShape,
		});

		if (res) return res;
	}
);

export const CREATE_SLICE = createAsyncThunk(
	'examples/CREATE_SLICE',
	async ({ taskId, exampleId, userState, dispatch, newSlice }) => {
		newLog('examples/CREATE_SLICE');

		const res = await requestFactory({
			type: 'POST',
			url: `/tasks/${taskId}/examples/${exampleId}/slices`,
			userState,
			dispatch,
			data: newSlice,
		});

		if (res) return res;
	}
);

// GET
export const GET_EXAMPLES = createAsyncThunk(
	'examples/GET_EXAMPLES',
	async (props) => {
		newLog('examples/GET_EXAMPLES');

		// Get props, remove unnecesary ones for query and prepare the array
		const tmpProps = [];
		let isPage = false;
		let isPerPage = false;

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
			type: 'get',
			url: `/tasks/${props.taskId}/examples${query}`,
			userState: props.userState,
			dispatch: props.dispatch,
		});
		if (res) return res;
	}
);

export const GET_TAGS = createAsyncThunk(
	'organization/GET_TAGS',
	async ({ taskId, userState, dispatch }) => {
		newLog('organization/GET_TAGS');
		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/tags`,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

export const GET_EXAMPLE_FILE = createAsyncThunk(
	'examples/GET_EXAMPLE_FILE',
	async ({ taskId, fileId, userState, dispatch, thumbnail }) => {
		newLog('examples/GET_EXAMPLE_FILE');

		let tmpThumbnail = '';

		if (thumbnail) {
			tmpThumbnail = `?thumbnail=${thumbnail}`;
		}

		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/files/${fileId}${tmpThumbnail}`,
			userState,
			dispatch,
		});
		if (res) return res;
	}
);

export const GET_SHAPES = createAsyncThunk(
	'examples/GET_SHAPES',
	async ({ taskId, exampleId, userState, dispatch }) => {
		newLog('examples/GET_SHAPES');

		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/examples/${exampleId}/shapes`,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

export const GET_SLICES = createAsyncThunk(
	'examples/GET_SLICES',
	async ({ taskId, exampleId, userState, dispatch }) => {
		newLog('examples/GET_SLICES');

		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/examples/${exampleId}/slices`,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

// UPDATE

export const UPDATE_EXAMPLE = createAsyncThunk(
	'examples/UPDATE_EXAMPLE',
	async ({ taskId, exampleId, examplesToUpdate, dispatch, userState }) => {
		newLog('examples/UPDATE_EXAMPLE');
		const res = await requestFactory({
			type: 'PUT',
			url: `/tasks/${taskId}/examples/${exampleId}`,
			data: examplesToUpdate,
			dispatch,
			userState,
		});

		if (res) return res;
	}
);

export const UPDATE_TAG = createAsyncThunk(
	'tasks/UPDATE_TAG',
	async ({ taskId, tagId, data, userState, dispatch }) => {
		newLog('tasks/UPDATE_TAG');
		const res = await requestFactory({
			type: 'PUT',
			url: `/tasks/${taskId}/tags/${tagId}`,
			data,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

export const UPDATE_SHAPE = createAsyncThunk(
	'examples/UPDATE_SHAPE',
	async ({ taskId, exampleId, shapeId, newShape, dispatch, userState }) => {
		newLog('examples/UPDATE_SHAPE');
		const res = await requestFactory({
			type: 'PUT',
			url: `/tasks/${taskId}/examples/${exampleId}/shapes/${shapeId}`,
			userState,
			dispatch,
			data: newShape,
		});

		if (res) {
			dispatch(ADD_ALERT({ type: 'success', message: SHAPE_UPDATED_SUCCESS }));
			setTimeout(() => {
				dispatch(REMOVE_ALERT(SHAPE_UPDATED_SUCCESS));
			}, 2000);
		}

		if (res) return { res, shapeId };
	}
);

export const UPDATE_SLICE = createAsyncThunk(
	'examples/UPDATE_SLICE',
	async ({ taskId, exampleId, sliceUUID, newSlice, dispatch, userState }) => {
		newLog('examples/UPDATE_SLICE');
		const res = await requestFactory({
			type: 'PUT',
			url: `/tasks/${taskId}/examples/${exampleId}/slices/${sliceUUID}`,
			userState,
			dispatch,
			data: newSlice,
		});

		if (res) {
			dispatch(ADD_ALERT({ type: 'success', message: SHAPE_UPDATED_SUCCESS }));
			setTimeout(() => {
				dispatch(REMOVE_ALERT(SHAPE_UPDATED_SUCCESS));
			}, 2000);
		}

		if (res) return { res, sliceUUID };
	}
);

// DELETE

export const DELETE_EXAMPLE = createAsyncThunk(
	'examples/DELETE_EXAMPLE',
	async ({ currentRowId, taskId, dispatch, userState }) => {
		newLog('examples/DELETE_EXAMPLE');

		await requestFactory({
			type: 'DELETE',
			url: `/tasks/${taskId}/examples/${currentRowId}`,
			dispatch,
			userState,
		});

		return currentRowId;
	}
);

export const DELETE_TAG = createAsyncThunk(
	'tasks/DELETE_TAG',
	async ({ userState, taskId, tagId, dispatch }) => {
		newLog('tasks/DELETE_TAG');

		await requestFactory({
			type: 'DELETE',
			url: `/tasks/${taskId}/tags/${tagId}`,
			userState,
			dispatch,
		});

		return tagId;
	}
);

export const DELETE_SHAPE = createAsyncThunk(
	'examples/DELETE_SHAPE',
	async ({ taskId, exampleId, userState, dispatch, shapeId }) => {
		newLog('examples/DELETE_SHAPE');

		await requestFactory({
			type: 'DELETE',
			url: `/tasks/${taskId}/examples/${exampleId}/shapes/${shapeId}`,
			userState,
			dispatch,
		});

		return shapeId;
	}
);

export const DELETE_SLICE = createAsyncThunk(
	'examples/DELETE_SLICE',
	async ({ taskId, exampleId, userState, dispatch, sliceUUID }) => {
		newLog('examples/DELETE_SLICE');

		await requestFactory({
			type: 'DELETE',
			url: `/tasks/${taskId}/examples/${exampleId}/slices/${sliceUUID}`,
			userState,
			dispatch,
		});

		return sliceUUID;
	}
);

export const examplesSlice = createSlice({
	name: 'examples',
	initialState: {
		isLoading: true,
		currentExample: {},
		tmpExample: {},
		examples: [],
		tags: [],
		currentTags: [],
		totalExamples: null,
		currentShapes: [],
		currentSlices: [],
		fileToUpload: {
			isLoading: false,
		},
		imagesBufferIsLoading: true,
		imagesBuffer: [],
		documentsBufferIsLoading: true,
		documentsBuffer: [],
	},
	reducers: {
		// SHAPES
		SET_CURRENT_SHAPES: (state, { payload = {} }) => {
			newLog('examples/SET_CURRENT_SHAPES');
			state.currentShapes = payload;
		},
		// SHAPES
		SET_CURRENT_SLICES: (state, { payload = {} }) => {
			newLog('examples/SET_CURRENT_SHAPES');
			state.currentSlices = payload;
		},

		// SET
		SET_CURRENT_EXAMPLE: (state, { payload }) => {
			newLog('examples/SET_CURRENT_EXAMPLE');
			state.currentExample = payload;
			state.currentShapes = payload.shapes || [];
			state.currentSlices = payload.slices || [];
		},
		SET_TMP_EXAMPLE: (state, { payload }) => {
			newLog('examples/SET_TMP_EXAMPLE');
			state.tmpExample = payload;
		},
		SET_EXAMPLE_IMAGES_BUFFER: (state, { payload }) => {
			newLog('examples/SET_EXAMPLE_IMAGES_BUFFER');
			if (payload) state.imagesBuffer = payload;
			state.imagesBufferIsLoading = false;
		},
		SET_EXAMPLE_DOCUMENTS_BUFFER: (state, { payload }) => {
			newLog('examples/SET_EXAMPLE_DOCUMENTS_BUFFER');
			if (payload) state.documentsBuffer = payload;
			state.documentsBufferIsLoading = false;
		},
		RESET_EXAMPLES_STATE: (state) => {
			newLog('examples/RESET_EXAMPLES_STATE');
			state.currentExample = {};
			state.tmpExample = {};
			state.examples = [];
			state.totalExamples = 0;
			state.currentShapes = [];
			state.fileToUpload = {
				isLoading: false,
			};
		},
	},
	extraReducers: (builder) => {
		// CREATE
		builder.addCase(CREATE_TAG.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(CREATE_TAG.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.tags = [...state.tags, payload];
		});
		builder.addCase(CREATE_TAG.rejected, (state) => {
			state.isLoading = false;
		});

		builder.addCase(CREATE_SHAPE.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(CREATE_SHAPE.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.currentShapes = [...state.currentShapes, payload];
		});
		builder.addCase(CREATE_SHAPE.rejected, (state) => {
			state.isLoading = false;
		});

		builder.addCase(CREATE_SLICE.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(CREATE_SLICE.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			if (payload)
				if (state.currentExample.slices) {
					state.currentExample = {
						...state.currentExample,
						slices: [...state.currentExample.slices, payload],
					};
				} else {
					state.currentExample = { ...state.currentExample, slices: [payload] };
				}
		});
		builder.addCase(CREATE_SLICE.rejected, (state) => {
			state.isLoading = false;
		});

		// GET

		builder.addCase(GET_EXAMPLES.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_EXAMPLES.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.examples = payload.data;
			state.totalExamples = payload.total_count;
		});
		builder.addCase(GET_EXAMPLES.rejected, (state) => {
			state.isLoading = false;
		});

		builder.addCase(GET_TAGS.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_TAGS.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.tags = payload;
		});
		builder.addCase(GET_TAGS.rejected, (state) => {
			state.isLoading = false;
		});

		builder.addCase(GET_SHAPES.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_SHAPES.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.currentShapes = payload;
		});
		builder.addCase(GET_SHAPES.rejected, (state) => {
			state.isLoading = false;
		});

		builder.addCase(GET_SLICES.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_SLICES.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.currentSlices = payload;
		});
		builder.addCase(GET_SLICES.rejected, (state) => {
			state.isLoading = false;
		});

		// UPDATE

		builder.addCase(UPDATE_EXAMPLE.fulfilled, (state, { payload }) => {
			if (payload) {
				const tmpExamples = state.examples.map((example) => {
					if (example.id === payload.id) return payload;
					return example;
				});

				state.currentExample = payload;
				state.examples = tmpExamples;
			}
		});

		builder.addCase(UPDATE_TAG.fulfilled, (state, { payload }) => {
			if (payload) {
				const tmpTags = state.tags.map((tag) => {
					if (tag.uuid === payload.uuid) return payload;
					return tag;
				});

				state.tags = tmpTags;
			}
		});

		builder.addCase(UPDATE_SHAPE.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(UPDATE_SHAPE.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.currentShapes = state.currentShapes.map((shape) => {
				if (shape.id === payload.shapeId) return payload.res;
				return shape;
			});
		});
		builder.addCase(UPDATE_SHAPE.rejected, (state) => {
			state.isLoading = false;
		});

		builder.addCase(UPDATE_SLICE.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(UPDATE_SLICE.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.currentSlices = state.currentSlices.map((slice) => {
				if (slice.uuid === payload.sliceUUID) return payload.res;
				return slice;
			});
		});
		builder.addCase(UPDATE_SLICE.rejected, (state) => {
			state.isLoading = false;
		});

		// DELETE

		builder.addCase(DELETE_EXAMPLE.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(DELETE_EXAMPLE.fulfilled, (state, { payload }) => {
			state.examples = state.examples.filter(
				(example) => example.id !== payload
			);
		});
		builder.addCase(DELETE_EXAMPLE.rejected, (state) => {
			state.isLoading = false;
		});

		builder.addCase(DELETE_TAG.fulfilled, (state, { payload }) => {
			state.tags = state.tags.filter((tag) => tag.uuid !== payload);
		});

		builder.addCase(DELETE_SHAPE.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(DELETE_SHAPE.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.currentShapes = state.currentShapes.filter(
				(shape) => shape.id !== payload
			);
		});
		builder.addCase(DELETE_SHAPE.rejected, (state) => {
			state.isLoading = false;
		});

		builder.addCase(DELETE_SLICE.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(DELETE_SLICE.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.currentExample.slices = state.currentExample.slices.filter(
				(slice) => slice.uuid !== payload
			);
		});
		builder.addCase(DELETE_SLICE.rejected, (state) => {
			state.isLoading = false;
		});
	},
});

// Action creators are generated for each case reducer function
export const {
	SET_CURRENT_EXAMPLE,
	SET_CURRENT_SHAPES,
	SET_TMP_EXAMPLE,
	RESET_EXAMPLES_STATE,
	SET_TMP_FILE_IN_TMP_EXAMPLE,
	SET_EXAMPLE_IMAGES_BUFFER,
	SET_EXAMPLE_DOCUMENTS_BUFFER,
	SET_CATEGORIES,
} = examplesSlice.actions;

export default examplesSlice.reducer;
