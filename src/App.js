/* eslint-disable no-nested-ternary */
import { Suspense, lazy, useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

// Auth
import { useAuth0 } from '@auth0/auth0-react';

// Roles & permissions management
import { usePermify } from '@permify/react-role';

// Styles
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './App.css';
import { colors } from './consts/colors';

// Router
import AppRouter from './Router';

// Redux
import {
	GET_USER,
	SET_ACCESS_TOKEN,
	GET_USER_PERMISSIONS_AND_ROLES,
	SET_USER_LOCATION,
	GET_USER_SETTINGS,
	SET_IS_NEW_USER,
} from './redux/user.slice';
import {
	GET_ORGANIZATION,
	GET_ORGANIZATION_APPS,
	GET_ORGANIZATION_COLLABORATORS,
	GET_ORGANIZATION_ROLES,
	GET_ORGANIZATION_SUBSCRIPTION,
	GET_ORGANIZATION_USERS,
} from './redux/organization.slice';
import {
	GET_TASK_PERMISSIONS,
	GET_TASK_SETTINGS,
	GET_TASKS,
} from './redux/tasks.slice';
import {
	GET_SCHEMA,
	GET_SCHEMA_NODE_CATEGORIES,
	RESET_ALL_CATEGORIES,
} from './redux/schema.slice';
import { GET_EXAMPLES, GET_TAGS } from './redux/examples.slice';
import {
	GET_MODELS,
	GET_PRODUCTION_MODEL,
	GET_TESTING_MODEL,
} from './redux/aimodels.slice';
import { APP_IS_LOADING, AUTH_IS_LOADING } from './redux/loaders.slice';
import { GET_TESTS } from './redux/testing.slice';
import { GET_PREDICTIONS } from './redux/predictions.slice';

// Services
import { transcriptPermissions } from './services/transcriptPermissions';
import { useWindowSize } from './services/hooks/useWindowResize';

import ConfigContext from './Providers/ConfigContext';

// Core Components
const TopMenu = lazy(() => import('./Components/Core/TopMenu'));
const Navigation = lazy(() => import('./Components/Core/Navigation'));
const Footer = lazy(() => import('./Components/Core/Footer'));
const AlertsManager = lazy(() => import('./Components/Core/AlertsManager'));

// Components with Named Exports
const Loader = lazy(() =>
	import('./Components/Shared/Loader').then((module) => ({
		default: module.Loader,
	}))
);
const CompleteProfile = lazy(() =>
	import('./Pages/CompleteProfile').then((module) => ({
		default: module.CompleteProfile,
	}))
);

const MaintenancePage = lazy(() => import('./Pages/Maintenance'));

const theme = createTheme({
	palette: {
		primary: {
			main: colors.buttonPrimaryColor,
		},
	},
});

const App = ({ routerConfig = {} }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const windowSize = useWindowSize();
	const { setUser: setUserAccess } = usePermify();

	const { apiUrl } = useContext(ConfigContext);

	// Auth0
	const {
		logout,
		isAuthenticated,
		getAccessTokenSilently,
		isLoading: auth0IsLoading,
	} = useAuth0();

	// Global states
	const { accessToken } = useSelector((state) => state.user);
	const { appIsLoading, authIsLoading } = useSelector((state) => state.loaders);
	const { user: userState, organization: organizationState } = useSelector(
		(state) => state
	);
	const { currentTask: currentTaskState, tasks: tasksState } = useSelector(
		(state) => state.tasks
	);
	const { schema: schemaState, categories: categoriesState } = useSelector(
		(state) => state.schema
	);
	const { examples: examplesState } = useSelector((state) => state.examples);

	// Local states
	const [authEnabled, setAuthEnabled] = useState(true);
	const [isPermifySettedUp, setIsPermifySettedUp] = useState(false);
	const [isTopMenu, setIsTopMenu] = useState(false);
	const [currentLocation, setCurrentLocation] = useState('');
	const [openCompleteProfile, setOpenCompleteProfile] = useState(false);

	useEffect(() => {
		if (window.localStorage.getItem('__permifyUser') !== '')
			setIsPermifySettedUp(true);
	}, [window.localStorage.getItem('__permifyUser')]);

	const getToken = async () => {
		if (process.env.NEXUSML_UI_AUTH_ENABLED === 'false') {
			dispatch(SET_ACCESS_TOKEN('none'));
		} else {
			const token = await getAccessTokenSilently().catch(() => {
				if (currentLocation !== 'signin') navigate('/signin');
			});
			if (token) dispatch(SET_ACCESS_TOKEN(token));
		}
	};

	useEffect(() => {
		dispatch(APP_IS_LOADING(true));
		dispatch(
			SET_USER_LOCATION(Intl.DateTimeFormat().resolvedOptions().timeZone)
		);

		if (!localStorage.getItem('oldTaskId')) {
			localStorage.setItem('oldTaskId', '');
		}

		if (process.env.NEXUSML_UI_AUTH_ENABLED === 'true') {
			getToken();
		} else {
			setAuthEnabled(false);
		}
	}, []);

	useEffect(() => {
		setCurrentLocation(location.pathname.split('/').slice(1)[0]);
	}, [location.pathname]);

	const getUserAndOrganization = async () => {
		await dispatch(GET_USER({ userState, navigate, apiUrl }));
		await dispatch(GET_USER_SETTINGS({ userState, dispatch }));
		await dispatch(GET_ORGANIZATION({ userState, dispatch, navigate }));
		dispatch(APP_IS_LOADING(false));
	};

	useEffect(() => {
		if (accessToken) {
			const decodedToken = jwtDecode(accessToken, { header: false });
			dispatch(SET_IS_NEW_USER(decodedToken?.isNew));
			if (isAuthenticated) {
				getUserAndOrganization();
			}
		}
	}, [isAuthenticated, accessToken]);

	useEffect(() => {
		if (!authEnabled) {
			setUserAccess({
				id: userState.id,
				roles: ['admin'],
				permissions: process.env.NEXUSML_UI_AUTH0_SCOPE.split(' '),
			});
		}
		const tmpRoles = () => {
			const tmp = [];
			if (userState.roles.some((role) => role.name === 'admin'))
				tmp.push('admin');
			if (userState.roles.some((role) => role.name === 'maintainer'))
				tmp.push('maintainer');
			return tmp;
		};
		if (
			organizationState.info &&
			organizationState.info.id &&
			userState.id !== null &&
			(userState.permissions.length > 0 || userState.roles.length > 0)
		) {
			setUserAccess({
				id: userState.id,
				roles: tmpRoles(),
				permissions: transcriptPermissions({
					permissions: userState.permissions,
					organizationId: organizationState.info.id,
				}),
			});
		}
	}, [
		userState,
		userState.permissions,
		userState.roles,
		organizationState,
		localStorage.getItem('__permifyUser'),
		authEnabled,
	]);

	useEffect(() => {
		if (
			organizationState &&
			organizationState.info &&
			organizationState.info.id !== undefined &&
			isAuthenticated &&
			isPermifySettedUp
		) {
			if (userState.id) {
				if (!userState.first_name || !userState.last_name)
					setOpenCompleteProfile(true);
				dispatch(
					GET_USER_PERMISSIONS_AND_ROLES({
						userState,
						organizationId: organizationState.info.id,
						userId: userState.id,
						dispatch,
					})
				);
			}
			if (currentLocation === 'settings') {
				dispatch(
					GET_ORGANIZATION_USERS({
						organizationId: organizationState.info.id,
						userState,
						dispatch,
					})
				);
				dispatch(
					GET_ORGANIZATION_SUBSCRIPTION({
						organizationId: organizationState.info.id,
						userState,
						dispatch,
					})
				);
				dispatch(
					GET_ORGANIZATION_COLLABORATORS({
						organizationId: organizationState.info.id,
						userState,
						dispatch,
					})
				);
				dispatch(
					GET_ORGANIZATION_ROLES({
						organizationId: organizationState.info.id,
						userState,
						dispatch,
					})
				);
				dispatch(
					GET_ORGANIZATION_APPS({
						organizationId: organizationState.info.id,
						userState,
						dispatch,
					})
				);
			}
		}
	}, [
		organizationState && organizationState.info && organizationState.info.id,
		userState && userState.id,
		currentLocation,
		isPermifySettedUp,
	]);

	useEffect(() => {
		if (
			(tasksState.length === 0 &&
				userState &&
				userState.id &&
				userState.permissions.length > 0 &&
				isPermifySettedUp) ||
			!authEnabled
		) {
			dispatch(APP_IS_LOADING(false));
			dispatch(GET_TASKS({ userState, dispatch }));
		}
	}, [userState, isPermifySettedUp, authEnabled]);

	const getCurrentTask = async () => {
		// SCHEMA REQUESTS
		await dispatch(
			GET_SCHEMA({
				taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
				userState,
				dispatch,
			})
		);
		// EXAMPLES REQUESTS
		await dispatch(
			GET_EXAMPLES({
				taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
				userState,
				dispatch,
			})
		);
		// TAGS REQUESTS
		await dispatch(
			GET_TAGS({
				taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
				userState,
				dispatch,
			})
		);
		// AI MODELS REQUESTS
		await dispatch(
			GET_MODELS({
				taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
				userState,
				dispatch,
			})
		);
		await dispatch(
			GET_TESTING_MODEL({
				taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
				userState,
				dispatch,
			})
		);
		await dispatch(
			GET_PRODUCTION_MODEL({
				taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
				userState,
				dispatch,
			})
		);

		// TESTING REQUESTS
		await dispatch(
			GET_TESTS({
				taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
				userState,
				dispatch,
				environment: 'testing',
			})
		);
		// PREDICTION REQUESTS
		await dispatch(
			GET_PREDICTIONS({
				taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
				userState,
				dispatch,
				environment: 'production',
			})
		);
		// SETTINGS
		await dispatch(
			GET_TASK_SETTINGS({
				taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
				userState,
				dispatch,
			})
		);
		await dispatch(
			GET_TASK_PERMISSIONS({
				taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
				userState,
				dispatch,
			})
		);
		if (currentTaskState.uuid)
			localStorage.setItem('oldTaskId', currentTaskState.uuid);
	};

	useEffect(() => {
		if (
			(accessToken !== '' &&
				userState.id !== '' &&
				isAuthenticated &&
				((currentTaskState &&
					currentTaskState.uuid &&
					localStorage.getItem('currentTaskId') !==
						localStorage.getItem('oldTaskId')) ||
					examplesState.length === 0)) ||
			!authEnabled
		) {
			getCurrentTask();
			dispatch(RESET_ALL_CATEGORIES());
		}
	}, [currentTaskState.uuid]);

	const getCategories = async () => {
		if (Object.keys(categoriesState).length === 0) {
			// INPUTS
			if (schemaState.inputs)
				schemaState.inputs.forEach(async (input) => {
					if (input.type === 'category') {
						await dispatch(
							GET_SCHEMA_NODE_CATEGORIES({
								userState,
								taskId: currentTaskState.uuid,
								dispatch,
								nodeType: 'inputs',
								nodeId: input.id,
								nodeName: input.name,
							})
						);
					}
				});

			// METADATA
			if (schemaState.metadata)
				schemaState.metadata.forEach(async (meta) => {
					if (meta.type === 'category') {
						await dispatch(
							GET_SCHEMA_NODE_CATEGORIES({
								userState,
								taskId: currentTaskState.uuid,
								dispatch,
								nodeType: 'metadata',
								nodeId: meta.id,
								nodeName: meta.name,
							})
						);
					}
				});

			// OUTPUTS
			if (schemaState.outputs)
				schemaState.outputs.forEach(async (output) => {
					if (output.type === 'category') {
						await dispatch(
							GET_SCHEMA_NODE_CATEGORIES({
								userState,
								taskId: currentTaskState.uuid,
								dispatch,
								nodeType: 'outputs',
								nodeId: output.id,
								nodeName: output.name,
							})
						);
					}
				});
		}
	};

	useEffect(() => {
		if (schemaState && Object.keys(schemaState).length > 0) {
			getCategories();
		}
	}, [schemaState]);

	useEffect(() => {
		document.getElementById('root').style.marginTop = '0vh';
		if (isTopMenu) {
			setIsTopMenu(true);
			if (windowSize.width < 900 && windowSize.width > 600)
				document.getElementById('root').style.marginTop = '12vh';
			else if (windowSize.width < 600)
				document.getElementById('root').style.marginTop = '14vh';
			else document.getElementById('root').style.marginTop = '9vh';
		}
	}, [isTopMenu, windowSize]);

	useEffect(() => {
		dispatch(APP_IS_LOADING(true));
		if (!authEnabled) {
			if (currentLocation === 'signin') navigate('/dashboard');
		} else {
			if (isAuthenticated && currentLocation === 'signin') {
				if (organizationState.info?.id) {
					navigate('/dashboard');
				}
			}
			if (!isAuthenticated && !auth0IsLoading) {
				navigate('/signin');
			}
		}
		dispatch(APP_IS_LOADING(false));
	}, [isAuthenticated, auth0IsLoading, userState]);

	const handleSignOut = () => {
		localStorage.setItem('access_token', '');
		localStorage.removeItem('__permifyUser', '');
		dispatch(SET_ACCESS_TOKEN(''));
		dispatch(AUTH_IS_LOADING(true));
		setIsTopMenu(false);
		logout();
		navigate('/signin');
	};

	if (process.env.NEXUSML_UI_IS_MAINTENANCE_MODE === 'true') {
		return (
			<Routes>
				<Route exact path="/" element={<MaintenancePage />} />
			</Routes>
		);
	}

	if (openCompleteProfile)
		return (
			<CompleteProfile setIsTopMenu={setIsTopMenu} open={openCompleteProfile} />
		);

	if (auth0IsLoading || authIsLoading || appIsLoading) {
		return <Loader size="L" />;
	}

	return (
		<ThemeProvider theme={theme}>
			<Suspense fallback={<Loader size="L" />}>
				{((isAuthenticated &&
					currentLocation !== 'create-organization' &&
					currentLocation !== 'complete-profile' &&
					currentLocation !== 'signin') ||
					!authEnabled) && (
					<>
						<TopMenu
							handleSignOut={handleSignOut}
							setIsTopMenu={setIsTopMenu}
						/>
						<Navigation />
					</>
				)}
				<AlertsManager />
				<CssBaseline />
				<AppRouter
					isAuthenticated={isAuthenticated}
					setIsTopMenu={setIsTopMenu}
					routerConfig={routerConfig}
				/>
				<Footer />
			</Suspense>
		</ThemeProvider>
	);
};

App.propTypes = {
	routerConfig: PropTypes.any,
};

export default App;
