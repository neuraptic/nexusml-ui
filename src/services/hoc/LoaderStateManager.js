import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// Redux
import {
	APP_IS_LOADING,
	LOAD_TOP_MENU_COMPANY_NAME,
	LOAD_DASHBOARD_TASKS,
	LOAD_USER_ROLES,
	LOAD_USER_PERMISSIONS,
	LOAD_ORGANIZATION_INFO,
	LOAD_ORGANIZATION_USAGE,
	LOAD_ORGANIZATION_SUBSCRIPTION,
	LOAD_ORGANIZATION_COLLABORATORS,
	LOAD_ORGANIZATION_USERS,
	LOAD_ORGANIZATION_ROLES,
	LOAD_ORGANIZATION_APPS,
	LOAD_CURRENT_TASK,
	LOAD_TASK_STATUS_INFO,
	LOAD_TASK_STATUS_SERVICES,
	LOAD_TASK_STATUS_EXAMPLES,
	LOAD_TASK_STATUS_PRODUCTION_AIMODEL,
	LOAD_TASK_AIMODELS,
	LOAD_TASK_SETTINGS_SERVICES,
	LOAD_TASK_SETTINGS_USERS_PERMISSIONS,
	LOAD_TASK_SETTINGS_ROLES_PERMISSIONS,
	LOAD_TASK_SCHEMA,
} from '../../redux/loaders.slice';

// Services
import { isEmptyObject } from '../extraServices';

export const LoaderStateManager = (props) => {
	const { children } = props;

	const location = useLocation();
	const dispatch = useDispatch();

	// Glñobal states
	const {
		user: userState,
		tasks: taskState,
		organization: organizationState,
		schema: schemaState,
		examples: examplesState,
		aimodels: aimodelsState,
	} = useSelector((state) => state);

	useEffect(() => {
		if (location.pathname === '/') dispatch(APP_IS_LOADING(false));
		if (location.pathname === '/signin') dispatch(APP_IS_LOADING(false));
		if (location.pathname === '/complete-profile') {
			dispatch(APP_IS_LOADING(false));
		}
	}, [location]);

	useEffect(() => {
		if (
			userState.id !== '' &&
			organizationState.info.id !== '' &&
			JSON.parse(window.localStorage.getItem('__permifyUser'))?.id &&
			!userState.isLoading &&
			!organizationState.isLoading
		) {
			dispatch(APP_IS_LOADING(false));
			dispatch(LOAD_USER_ROLES(false));
			dispatch(LOAD_USER_PERMISSIONS(false));
		}
	}, [
		userState.id,
		userState.permissions,
		userState.roles,
		organizationState,
		window.localStorage.getItem('__permifyUser'),
	]);

	// Top menu company name
	useEffect(() => {
		if (
			organizationState.info &&
			organizationState.info.name !== undefined &&
			!organizationState.isLoading
		) {
			dispatch(LOAD_TOP_MENU_COMPANY_NAME(false));
			dispatch(LOAD_ORGANIZATION_INFO(false));
			dispatch(LOAD_ORGANIZATION_COLLABORATORS(false));
			if (!organizationState.usersIsLoading)
				dispatch(LOAD_ORGANIZATION_USERS(false));
			if (!organizationState.rolesIsLoading)
				dispatch(LOAD_ORGANIZATION_ROLES(false));
			if (!organizationState.appsIsLoading)
				dispatch(LOAD_ORGANIZATION_APPS(false));
			if (
				organizationState.subscription &&
				isEmptyObject(organizationState.subscription.usage)
			) {
				dispatch(LOAD_ORGANIZATION_USAGE(false));
			}
			if (
				organizationState.subscription &&
				isEmptyObject(organizationState.subscription.plan)
			) {
				dispatch(LOAD_ORGANIZATION_SUBSCRIPTION(false));
			}
		}
	}, [organizationState]);

	// DASHBOARD
	// Tasks
	useEffect(() => {
		dispatch(LOAD_DASHBOARD_TASKS(taskState.isLoading));
	}, [taskState.isLoading]);

	// TASK AREA
	useEffect(() => {
		if (Object.keys(taskState.currentTask).length > 0) {
			dispatch(LOAD_CURRENT_TASK(false));
		}
	}, [taskState]);

	// TASK STATUS
	// Info
	useEffect(() => {
		if (taskState.currentTask && Object.keys(taskState.currentTask).length > 0)
			dispatch(LOAD_TASK_STATUS_INFO(false));
	}, [taskState.currentTask]);

	// AI models & Production AI model
	useEffect(() => {
		if (!aimodelsState.isLoading) {
			dispatch(LOAD_TASK_AIMODELS(false));
			dispatch(LOAD_TASK_STATUS_PRODUCTION_AIMODEL(false));
		}
	}, [aimodelsState.isLoading]);

	// Schema
	useEffect(() => {
		if (!schemaState.isLoading) {
			dispatch(LOAD_TASK_SCHEMA(false));
		}
	}, [schemaState.isLoading]);

	// Examples
	useEffect(() => {
		if (!examplesState.isLoading) {
			dispatch(LOAD_TASK_STATUS_EXAMPLES(false));
		}
	}, [examplesState.isLoading]);

	// Settings

	useEffect(() => {
		if (Object.keys(taskState.currentTaskSettings).length > 0) {
			dispatch(LOAD_TASK_SETTINGS_SERVICES(false));
			dispatch(LOAD_TASK_STATUS_SERVICES(false));
		}
	}, [taskState.currentTaskSettings]);

	useEffect(() => {
		if (Object.keys(taskState.currentTaskPermissions).length > 0) {
			dispatch(LOAD_TASK_SETTINGS_USERS_PERMISSIONS(false));
			dispatch(LOAD_TASK_SETTINGS_ROLES_PERMISSIONS(false));
		}
	}, [taskState.currentTaskPermissions]);

	return children || <Outlet />;
};

LoaderStateManager.propTypes = {
	children: PropTypes.any,
};
