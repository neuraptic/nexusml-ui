import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Services
import requestFactory from '../services/request.factory';
import { newLog } from '../services/logger';

// CREATE

export const CREATE_TASK = createAsyncThunk(
	'tasks/CREATE_TASK',
	async ({ newTask, dispatch, userState }) => {
		newLog('tasks/CREATE_TASK');

		const res = await requestFactory({
			type: 'POST',
			url: '/tasks',
			data: newTask,
			dispatch,
			userState,
		});

		if (res) return res;
	}
);

export const CREATE_TASK_FILE = createAsyncThunk(
	'tasks/CREATE_TASK_FILE',
	async ({ taskId, file, userState, dispatch, usedFor, fileType }) => {
		newLog('tasks/CREATE_TASK_FILE');

		const { name: filename, size } = file;

		const res = await requestFactory({
			type: 'POST',
			url: `/tasks/${taskId}/files`,
			userState,
			data: {
				filename,
				size,
				use_for: usedFor,
				type: fileType,
			},
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

// GET

export const GET_TASKS = createAsyncThunk(
	'tasks/GET_TASKS',
	async ({ userState, dispatch }) => {
		newLog('tasks/GET_TASKS');
		const res = await requestFactory({
			type: 'GET',
			url: `/tasks`,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

export const GET_TASK_SETTINGS = createAsyncThunk(
	'tasks/GET_TASK_SETTINGS',
	async ({ userState, taskId, dispatch }) => {
		newLog('tasks/GET_TASK_SETTINGS');
		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/settings`,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

export const GET_TASK_PERMISSIONS = createAsyncThunk(
	'tasks/GET_TASK_PERMISSIONS',
	async ({ userState, taskId, dispatch }) => {
		newLog('tasks/GET_TASK_PERMISSIONS');
		const res = await requestFactory({
			type: 'GET',
			url: `/tasks/${taskId}/permissions`,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

// PUT

export const UPDATE_TASK = createAsyncThunk(
	'tasks/UPDATE_TASK',
	async ({ taskId, data, userState, dispatch }) => {
		newLog('tasks/UPDATE_TASK');
		const res = await requestFactory({
			type: 'PUT',
			url: `/tasks/${taskId}`,
			data,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

export const UPDATE_TASK_SETTINGS = createAsyncThunk(
	'tasks/UPDATE_TASK_SETTINGS',
	async ({ taskId, data, userState, dispatch }) => {
		newLog('tasks/UPDATE_TASK_SETTINGS');
		const res = await requestFactory({
			type: 'PUT',
			url: `/tasks/${taskId}/settings`,
			data,
			userState,
			dispatch,
		});

		if (res) return res;
	}
);

// DELETE

export const DELETE_TASK = createAsyncThunk(
	'tasks/DELETE_TASK',
	async ({ userState, taskId, dispatch }) => {
		newLog('tasks/DELETE_TASK');

		await requestFactory({
			type: 'DELETE',
			url: `/tasks/${taskId}`,
			userState,
			dispatch,
		});

		return taskId;
	}
);

export const tasksSlice = createSlice({
	name: 'tasks',
	initialState: {
		isLoading: true,
		currentTask: {},
		currentTaskSettings: {},
		currentTaskPermissions: {},
		tasks: [],
	},
	reducers: {
		SET_CURRENT_TASK: (state, { payload }) => {
			newLog('tasks/SET_CURRENT_TASK');
			const currentTask = state.tasks.find((task) => task.uuid === payload);
			state.currentTask = currentTask || {};
		},
	},
	extraReducers: (builder) => {
		// GET

		builder.addCase(GET_TASKS.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_TASKS.fulfilled, (state, { payload }) => {
			state.isLoading = false;

			state.tasks = payload.sort(
				(a, b) => new Date(b.modified_at) - new Date(a.modified_at)
			);
		});
		builder.addCase(GET_TASKS.rejected, (state) => {
			state.isLoading = false;
		});

		builder.addCase(GET_TASK_SETTINGS.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_TASK_SETTINGS.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.currentTaskSettings = payload.services;
		});
		builder.addCase(GET_TASK_SETTINGS.rejected, (state) => {
			state.isLoading = false;
		});

		builder.addCase(GET_TASK_PERMISSIONS.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(GET_TASK_PERMISSIONS.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.currentTaskPermissions = payload;
		});
		builder.addCase(GET_TASK_PERMISSIONS.rejected, (state) => {
			state.isLoading = false;
		});

		// PUT

		builder.addCase(UPDATE_TASK_SETTINGS.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(UPDATE_TASK_SETTINGS.fulfilled, (state, { payload }) => {
			state.isLoading = false;
			state.currentTaskSettings = payload.services;
		});
		builder.addCase(UPDATE_TASK_SETTINGS.rejected, (state) => {
			state.isLoading = false;
		});
	},
});

// Action creators are generated for each case reducer function
export const { SET_CURRENT_TASK } = tasksSlice.actions;

export default tasksSlice.reducer;
