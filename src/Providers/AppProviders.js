import React from 'react';
import PropTypes from 'prop-types';

import { Auth0Provider } from '@auth0/auth0-react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PermifyProvider } from '@permify/react-role';

import { LicenseInfo } from '@mui/x-license-pro';
import { LoaderStateManager } from '../services/hoc/LoaderStateManager';

import createStore from '../redux/store';

import history from '../services/history';

import ConfigContext from './ConfigContext';

// Images
import APP_LOGO_WITH_NAME from '../assets/LOGO_WITH_NAME.svg';
import APP_LOGO from '../assets/LOGO.png';
import APP_MAINTENANCE_IMAGE from '../assets/MAINTENANCE.svg';

LicenseInfo.setLicenseKey(process.env.NEXUSML_UI_MUI_LICENSE);

const onRedirectCallback = (appState) => {
	history.push(
		appState && appState.returnTo ? appState.returnTo : window.location.pathname
	);
};

export const AppProviders = ({
	children,
	reduxConfig,
	authConfig,
	appConfig,
}) => {
	const store = createStore(reduxConfig);
	const auth = {
		domain: authConfig?.domain || process.env.NEXUSML_UI_AUTH0_DOMAIN,
		clientId: authConfig?.clientId || process.env.NEXUSML_UI_AUTH0_CLIENT_ID,
		onRedirectCallback,
		authorizationParams: {
			redirect_uri: window.location.origin,
			audience: authConfig?.audience || process.env.NEXUSML_UI_AUTH0_AUDIENCE,
			scope: authConfig?.scope || process.env.NEXUSML_UI_AUTH0_SCOPE,
			useRefreshTokens: true,
		},
	};

	const appConfigContext = React.useMemo(
		() => ({
			appName: appConfig?.appName || process.env.NEXUSML_UI_APP_NAME,
			appLogoWithName: appConfig?.appLogoWithName || APP_LOGO_WITH_NAME,
			appLogo: appConfig?.appLogo || APP_LOGO,
			appMaintenanceImage:
				appConfig?.appMaintenanceImage || APP_MAINTENANCE_IMAGE,
			apiUrl: appConfig?.apiUrl || process.env.NEXUSML_UI_API_URL,
		}),
		[]
	);

	return (
		<ConfigContext.Provider value={appConfigContext}>
			<ReduxProvider store={store}>
				<BrowserRouter>
					<PermifyProvider>
						<LoaderStateManager>
							<Auth0Provider {...auth}>
								<React.StrictMode>{children}</React.StrictMode>
							</Auth0Provider>
						</LoaderStateManager>
					</PermifyProvider>
				</BrowserRouter>
			</ReduxProvider>
		</ConfigContext.Provider>
	);
};

AppProviders.propTypes = {
	children: PropTypes.any,
	reduxConfig: PropTypes.object,
	authConfig: PropTypes.object,
	appConfig: PropTypes.object,
};
