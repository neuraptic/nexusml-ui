import { configureStore } from '@reduxjs/toolkit';

// Other reducers
import alertsReducer from './alerts.slice';
import userReducer from './user.slice';
import organizationReducer from './organization.slice';
import tasksReducer from './tasks.slice';
import loadersReducer from './loaders.slice';
import schemaReducer from './schema.slice';
import queryReducer from './queries.slice';
import examplesReducer from './examples.slice';
import aimodelsReducer from './aimodels.slice';
import aitestingReducer from './testing.slice';
import predictionsReducer from './predictions.slice';

const createStore = (reduxConfig = {}) =>
	configureStore({
		reducer: {
			loaders: reduxConfig.loadersReducer || loadersReducer,
			query: reduxConfig.queryReducer || queryReducer,
			alerts: reduxConfig.alertsReducer || alertsReducer,
			user: reduxConfig.userReducer || userReducer,
			organization: reduxConfig.organizationReducer || organizationReducer,
			tasks: reduxConfig.tasksReducer || tasksReducer,
			schema: reduxConfig.schemaReducer || schemaReducer,
			examples: reduxConfig.examplesReducer || examplesReducer,
			aimodels: reduxConfig.aimodelsReducer || aimodelsReducer,
			tests: reduxConfig.aitestingReducer || aitestingReducer,
			predictions: reduxConfig.predictionsReducer || predictionsReducer,
			...reduxConfig.extraReducers,
		},
	});
export default createStore;
