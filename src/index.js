/*
 * AppProviders wraps the app with essential providers:
 * Redux, Router, Auth0, Permify, and LoaderStateManager.
 *
 * Optional configurations:
 *
 * Redux:
 * Pass custom reducers and extra reducers via reduxConfig. Use same reducer name as in store.js to overwrite it.
 * - loadersReducer
 * - queryReducer
 * - alertsReducer
 * - userReducer
 * - organizationReducer
 * - tasksReducer
 * - schemaReducer
 * - examplesReducer
 * - aimodelsReducer
 * - aitestingReducer
 * - predictionsReducer
 * - extraReducers
 * Example:
 * reduxConfig: {
 *   userReducer,
 *   organizationReducer,
 *   ...extraReducers
 * }
 *
 * Auth0:
 * - Configure Auth0 settings via authConfig.
 * Example:
 * authConfig: {
 *   domain: process.env.REACT_APP_AUTH0_DOMAIN,
 *   clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
 *   audience: process.env.REACT_APP_AUTH0_AUDIENCE,
 *   scope: process.env.REACT_APP_AUTH0_SCOPE
 * }
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

// Material-UI Pro License
import { LicenseInfo } from '@mui/x-license-pro';

// Components
import App from './App';

// Styles
import './index.css';

// Utilities
import reportWebVitals from './reportWebVitals';
import { AppProviders } from './Providers/AppProviders';

// Set Material-UI Pro license key
LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_LICENSE);

const root = ReactDOM.createRoot(document.getElementById('root'));

// Custom route config example
// routerConfig={[{ path: '/dashboard', element: <Dashboard /> }]}
// reduxConfig={{ userReducer, organizationReducer }}
// authConfig={{ domain: 'example.com', clientId: 'example-id', audience: 'example-audience', scope: 'example-scope' }}

root.render(
	<AppProviders>
		<App />
	</AppProviders>
);

// TODO: Review performance monitoring implementation.
// For performance measurement, pass a function to log results (e.g., reportWebVitals(console.log))
// or send data to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
