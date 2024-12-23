import React, { useEffect, useState, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// HOC
import { ProtectedRoute } from './services/hoc/ProtectedRoute';

// Pages
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const SignIn = lazy(() => import('./Pages/SignIn'));
const UserSettings = lazy(() => import('./Pages/Settings/UserSettings'));
const OrganizationSettings = lazy(() =>
	import('./Pages/Settings/OrganizationSettings')
);

// Components with Named Exports
const Tasks = lazy(() =>
	import('./Pages/Tasks').then((module) => ({ default: module.Tasks }))
);
const CompleteProfile = lazy(() =>
	import('./Pages/CompleteProfile').then((module) => ({
		default: module.CompleteProfile,
	}))
);
const CreateNewOrganization = lazy(() =>
	import('./Pages/CreateNewOrganization').then((module) => ({
		default: module.CreateNewOrganization,
	}))
);

const mergeRoutes = (defaultRoutes, customRoutes) => {
	// Convert customRoutes array to a map for quick lookup
	const customRouteMap = new Map(
		customRoutes.map((route) => [route.path, route])
	);

	// Recursive function to merge routes
	const merge = (defaultRoute) => {
		const customRoute = customRouteMap.get(defaultRoute.path);

		if (customRoute) {
			// If a custom route exists for this path, merge its children recursively
			return {
				...customRoute,
				children: customRoute.children
					? customRoute.children.map(merge)
					: undefined,
			};
		}
		// If no custom route exists, retain the default route
		return {
			...defaultRoute,
			children: defaultRoute.children
				? defaultRoute.children.map(merge)
				: undefined,
		};
	};

	// Start merging from the top-level default routes
	return defaultRoutes.map(merge);
};

const AppRouter = ({ isAuthenticated, routerConfig, setIsTopMenu }) => {
	const defaultRoutes = [
		{
			path: '*',
			element:
				isAuthenticated || process.env.NEXUSML_UI_AUTH_ENABLED === 'false' ? (
					<Navigate replace to="/dashboard" />
				) : (
					<Navigate replace to="/signin" />
				),
		},
		{ path: '/signin', element: <SignIn /> },
		{ path: '/complete-profile', element: <CompleteProfile /> },
		{
			path: '/create-organization',
			element: <CreateNewOrganization setIsTopMenu={setIsTopMenu} />,
		},
		{
			path: '/',
			element: <ProtectedRoute isAuthenticated={isAuthenticated} />,
			children: [
				{ path: '/', element: <Navigate replace to="/dashboard" /> },
				{ path: '/dashboard', element: <Dashboard /> },
				{ path: '/tasks/:id', element: <Tasks /> },
				{
					path: '/settings',
					children: [
						{ path: '', element: <Navigate to="/" /> },
						{ path: 'user', element: <UserSettings /> },
						{ path: 'organization', element: <OrganizationSettings /> },
					],
				},
			],
		},
	];

	const [routes, setRoutes] = useState(defaultRoutes);

	useEffect(() => {
		if (Object.keys(routerConfig)?.length > 0) {
			// Merge customRouterConfig with defaultRoutes
			const mergedRoutes = mergeRoutes(defaultRoutes, routerConfig);
			setRoutes(mergedRoutes);
		}
	}, [routerConfig]);

	const renderRoutes = (routes) =>
		routes.map((route, index) => {
			if (route.children) {
				return (
					<Route key={index} path={route.path} element={route.element}>
						{renderRoutes(route.children)}
					</Route>
				);
			}
			return <Route key={index} path={route.path} element={route.element} />;
		});

	return <Routes>{renderRoutes(routes)}</Routes>;
};

AppRouter.propTypes = {
	isAuthenticated: PropTypes.any,
	routerConfig: PropTypes.any,
	setIsTopMenu: PropTypes.func,
};

export default AppRouter;
