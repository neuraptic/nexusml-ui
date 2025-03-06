import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Services
import requestFactory from '../services/request.factory';
import { newLog } from '../services/logger';

// GET

export const GET_SCHEMA = createAsyncThunk(
	'schema/GET_SCHEMA',
	async ({ userState, taskId, dispatch }) => {
		newLog('schema/GET_SCHEMA');
		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/schema`,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

// export const GET_SCHEMA_GROUPS = createAsyncThunk(
// 	'schema/GET_SCHEMA_GROUPS',
// 	async ({ userState, taskId, dispatch }) => {
// 		newLog('schema/GET_SCHEMA_GROUPS');
// 		const res = await requestFactory({
// 			type: 'GET',
// 			url: `/tasks/${taskId}/schema/groups`,
// 			userState,
// 			dispatch,
// 		});

// 		if (res) return res;
// 	}
// );

// export const GET_SCHEMA_INPUTS = createAsyncThunk(
// 	'schema/GET_SCHEMA_INPUTS',
// 	async ({ userState, taskId, dispatch }) => {
// 		newLog('schema/GET_SCHEMA_INPUTS');
// 		const res = await requestFactory({
// 			type: 'GET',
// 			url: `/tasks/${taskId}/schema/inputs`,
// 			userState,
// 			dispatch,
// 		});
// 		if (res) return res;
// 	}
// );

// export const GET_SCHEMA_OUTPUTS = createAsyncThunk(
// 	'schema/GET_SCHEMA_OUTPUTS',
// 	async ({ userState, taskId, dispatch }) => {
// 		newLog('schema/GET_SCHEMA_OUTPUTS');
// 		const res = await requestFactory({
// 			type: 'GET',
// 			url: `/tasks/${taskId}/schema/outputs`,
// 			userState,
// 			dispatch,
// 		});

// 		if (res) return res;
// 	}
// );

// export const GET_SCHEMA_METADATA = createAsyncThunk(
// 	'schema/GET_SCHEMA_METADATA',
// 	async ({ userState, taskId, dispatch }) => {
// 		newLog('schema/GET_SCHEMA_METADATA');
// 		const res = await requestFactory({
// 			type: 'GET',
// 			url: `/tasks/${taskId}/schema/metadata`,
// 			userState,
// 			dispatch,
// 		});

// 		if (res) return res;
// 	}
// );

export const GET_SCHEMA_NODE_CATEGORIES = createAsyncThunk(
	'schema/GET_SCHEMA_NODE_CATEGORIES',
	async ({
		userState,
		taskId,
		dispatch,
		nodeType,
		nodeId,
		nodeName,
		page = 1,
	}) => {
		newLog('schema/GET_SCHEMA_NODE_CATEGORIES');
		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/schema/${nodeType}/${nodeId}/categories?page=${page}&per_page=4&total_count=true`,
			userState,
			dispatch,
		});

		if (res) return { nodeId, nodeName, nodeType, res };
	}
);

// POST

export const CREATE_SCHEMA_NODE = createAsyncThunk(
	'schema/CREATE_SCHEMA_NODE',
	async ({ node, taskId, nodeType, userState, dispatch }) => {
		newLog('schema/CREATE_SCHEMA_NODE');
		const res = await requestFactory({
			type: 'POST',
			url: `/tasks/${taskId}/schema/${nodeType}`,
			data: node,
			userState,
			dispatch,
		});
		if (res) {
			return {
				res,
				nodeType,
			};
		}
	}
);

export const CREATE_SCHEMA_NODE_CATEGORY = createAsyncThunk(
	'schema/CREATE_SCHEMA_NODE_CATEGORY',
	async ({ taskId, nodeType, nodeId, category, userState, dispatch }) => {
		newLog('schema/CREATE_SCHEMA_NODE_CATEGORY');
		const res = await requestFactory({
			type: 'POST',
			url: `/tasks/${taskId}/schema/${nodeType}/${nodeId}/categories`,
			data: category,
			userState,
			dispatch,
		});

		return { nodeType, nodeId, res };
	}
);

// PUT

// DELETE

export const DELETE_SCHEMA_ELEMENT = createAsyncThunk(
	'schema/DELETE_SCHEMA_ELEMENT',
	async ({
		elementType,
		elementId,
		taskId,
		dispatch,
		userState,
		schemaState,
	}) => {
		newLog('schema/DELETE_SCHEMA_ELEMENT');

		let tmpElementType = elementType;

		if (elementType === 'outputs') tmpElementType = 'outputs';
		if (elementType === 'metadata') tmpElementType = 'metadata';

		requestFactory({
			type: 'DELETE',
			url: `/tasks/${taskId}/schema/${tmpElementType}/${elementId}`,
			userState,
			dispatch,
		});

		return {
			elementId,
			elementType: tmpElementType,
			schemaState,
		};
	}
);

export const DELETE_SCHEMA_NODE = createAsyncThunk(
	'schema/DELETE_SCHEMA_NODE',
	async ({ nodeType, nodeId, taskId, dispatch, userState }) => {
		newLog('schema/DELETE_SCHEMA_NODE');
		requestFactory({
			type: 'DELETE',
			url: `/tasks/${taskId}/schema/${nodeType}/${nodeId}`,
			userState,
			dispatch,
		});

		return {
			nodeId,
			nodeType,
		};
	}
);

export const DELETE_SCHEMA_NODE_CATEGORY = createAsyncThunk(
	'schema/DELETE_SCHEMA_NODE_CATEGORY',
	async ({ nodeType, nodeId, taskId, categoryId, dispatch, userState }) => {
		newLog('schema/DELETE_SCHEMA_NODE_CATEGORY');
		requestFactory({
			type: 'DELETE',
			url: `/tasks/${taskId}/schema/${nodeType}/${nodeId}/categories/${categoryId}`,
			userState,
			dispatch,
		});

		return {
			nodeType,
			nodeId,
			categoryId,
		};
	}
);

export const schemaSlice = createSlice({
	name: 'schema',
	initialState: {
		isLoading: true,
		schema: {},
		inputs: [],
		outputs: [],
		metadata: [],
		currentSchemaElements: {
			nodes: [],
			edges: [],
		},
		selectedNodeCategories: {},
		categories: {},
	},
	reducers: {
		SET_CURRENT_SCHEMA_ELEMENTS: (state, { payload }) => {
			newLog('schema/SET_CURRENT_SCHEMA_ELEMENTS');
			state.currentSchemaElements = payload;
		},
		SET_GROUPS: (state, { payload }) => {
			newLog('schema/SET_GROUPS');
			state.groups = payload;
		},

		SET_INPUTS: (state, { payload }) => {
			newLog('schema/SET_INPUTS');
			state.inputs = payload;
		},

		SET_METADATA: (state, { payload }) => {
			newLog('schema/SET_METADATA');
			state.metadata = payload;
		},

		DELETE_GROUP: (state, { payload }) => {
			newLog('schema/DELETE_GROUP');
			state.groups = state.groups.filter((group) => group.id !== payload);
		},

		DELETE_INPUT: (state, { payload }) => {
			newLog('schema/DELETE_INPUT');
			state.inputs = state.inputs.filter((input) => input.id !== payload);
		},

		DELETE_OUTPUT: (state, { payload }) => {
			newLog('schema/DELETE_OUTPUT');
			state.targets = state.targets.filter((output) => output.id !== payload);
		},

		DELETE_METADATA: (state, { payload }) => {
			newLog('schema/DELETE_METADATA');
			state.metadata = state.metadata.filter((m) => m.id !== payload);
		},

		RESET_ALL_CATEGORIES: (state) => {
			newLog('schema/RESET_ALL_CATEGORIES');
			state.categories = {};
		},
		CLEAR_SELECTED_NODE_CATEGORIES: (state) => {
			newLog('schema/CLEAR_SELECTED_NODE_CATEGORIES');
			state.selectedNodeCategories = {};
		},
	},
	extraReducers: {
		// GET

		[GET_SCHEMA.pending]: (state) => {
			state.isLoading = true;
		},
		[GET_SCHEMA.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			state.schema = payload;
			if (payload?.inputs) state.inputs = payload.inputs;
			if (payload?.outputs) state.outputs = payload.outputs;
			if (payload?.metadata) state.metadata = payload.metadata;
		},
		[GET_SCHEMA.rejected]: (state) => {
			state.isLoading = false;
		},

		[GET_SCHEMA_NODE_CATEGORIES.pending]: (state) => {
			state.isLoading = true;
		},
		[GET_SCHEMA_NODE_CATEGORIES.fulfilled]: (state, { payload }) => {
			state.isLoading = false;

			if (state.categories[payload.nodeType]) {
				if (
					state.categories[payload.nodeType].find(
						(category) => category.id === payload.nodeId
					)
				) {
					state.categories = {
						...state.categories,
						[payload.nodeType]: state.categories[payload.nodeType].map(
							(category) => {
								if (category.id === payload.nodeId)
									return {
										id: payload.nodeId,
										name: payload.nodeName,
										total_count: payload.res.total_count,
										categories: payload.res.data,
									};
								return category;
							}
						),
					};
				} else {
					state.categories = {
						...state.categories,
						[payload.nodeType]: [
							...state.categories[payload.nodeType],
							{
								id: payload.nodeId,
								name: payload.nodeName,
								total_count: payload.res.total_count,
								categories: payload.res.data,
							},
						],
					};
				}
			} else {
				state.categories = {
					...state.categories,
					[payload.nodeType]: [
						{
							id: payload.nodeId,
							name: payload.nodeName,
							total_count: payload.res.total_count,
							categories: payload.res.data,
						},
					],
				};
			}
		},
		[GET_SCHEMA_NODE_CATEGORIES.rejected]: (state) => {
			state.isLoading = false;
		},

		// POST

		[CREATE_SCHEMA_NODE.pending]: (state) => {
			state.isLoading = true;
		},
		[CREATE_SCHEMA_NODE.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			if (payload.res.type === 'category') {
				state.categories[payload.nodeType] = [
					...state.categories[payload.nodeType],
					{ id: payload.res.id, name: payload.res.name, categories: [] },
				];
			}

			if (payload && state.schema[payload.nodeType])
				state.schema[payload.nodeType] = state.schema[payload.nodeType].concat(
					payload.res
				);
			else
				state.schema = {
					...state.schema,
					[payload.nodeType]: [payload.res],
				};
		},
		[CREATE_SCHEMA_NODE.rejected]: (state) => {
			state.isLoading = false;
		},

		[CREATE_SCHEMA_NODE_CATEGORY.pending]: (state) => {
			state.isLoading = true;
		},
		[CREATE_SCHEMA_NODE_CATEGORY.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			const tmpCat = state.categories[payload.nodeType].find(
				(cat) => cat.id === payload.nodeId
			);
			let newCategories;
			if (tmpCat)
				newCategories = state.categories[payload.nodeType].map((cat) => {
					const newCat = cat;
					if (cat.id === payload.nodeId) {
						newCat.total_count += 1;
						newCat.categories = [...newCat.categories, payload.res];
						return newCat;
					}
					return cat;
				});

			state.categories[payload.nodeType] = newCategories;
		},
		[CREATE_SCHEMA_NODE_CATEGORY.rejected]: (state) => {
			state.isLoading = false;
		},

		// DELETE NODE

		[DELETE_SCHEMA_ELEMENT.pending]: (state) => {
			state.isLoading = true;
		},
		[DELETE_SCHEMA_ELEMENT.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			const tmpInputs = payload.schemaState.inputs.filter(
				(input) => input.uuid !== payload.elementId
			);
			const tmpOutputs = payload.schemaState.outputs.filter(
				(output) => output.uuid !== payload.elementId
			);
			const tmpMetadata = payload.schemaState.metadata.filter(
				(metadata) => metadata.uuid !== payload.elementId
			);

			if (payload.elementType === 'inputs') {
				state.inputs = tmpInputs;
				state.schema.inputs = tmpInputs;
			}
			if (payload.elementType === 'outputs') {
				state.outputs = tmpOutputs;
				state.schema.outputs = tmpOutputs;
			}
			if (payload.elementType === 'metadata') {
				state.metadata = tmpMetadata;
				state.schema.metadata = tmpMetadata;
			}
		},
		[DELETE_SCHEMA_ELEMENT.rejected]: (state) => {
			state.isLoading = false;
		},

		[DELETE_SCHEMA_NODE.pending]: (state) => {
			state.isLoading = true;
		},
		[DELETE_SCHEMA_NODE.fulfilled]: (state, { payload }) => {
			state.isLoading = false;

			state.currentSchemaElements = state.currentSchemaElements.nodes.filter(
				(node) => (node.element || node.id) !== payload.nodeId
			);

			const currentNode = state.schema[payload.nodeType].find(
				(node) => node.id === payload.nodeId
			);
			if (currentNode.type === 'category') {
				const newCategories = state.categories[payload.nodeType].filter(
					(node) => node.id !== payload.nodeId
				);

				state.categories[payload.nodeType] = newCategories;
			}
		},
		[DELETE_SCHEMA_NODE.rejected]: (state) => {
			state.isLoading = false;
		},

		[DELETE_SCHEMA_NODE_CATEGORY.pending]: (state) => {
			state.isLoading = true;
		},
		[DELETE_SCHEMA_NODE_CATEGORY.fulfilled]: (state, { payload }) => {
			state.isLoading = false;
			const newCategories = state.categories[payload.nodeType].map((node) => {
				if (node.id === payload.nodeId) {
					return {
						...node,
						total_count: node.total_count - 1,
						categories: node.categories.filter(
							(cat) => cat.id !== payload.categoryId
						),
					};
				}
				return node;
			});

			state.categories[payload.nodeType] = newCategories;
		},
		[DELETE_SCHEMA_NODE_CATEGORY.rejected]: (state) => {
			state.isLoading = false;
		},
	},
});

export const {
	SET_CURRENT_SCHEMA_ELEMENTS,
	SET_GROUPS,
	SET_INPUTS,
	SET_METADATA,
	DELETE_GROUP,
	DELETE_INPUT,
	DELETE_METADATA,
	DELETE_OUTPUT,
	CLEAR_SELECTED_NODE_CATEGORIES,
	RESET_ALL_CATEGORIES,
} = schemaSlice.actions;

export default schemaSlice.reducer;
