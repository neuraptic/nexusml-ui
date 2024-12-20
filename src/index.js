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
LicenseInfo.setLicenseKey(process.env.NEXUSML_UI_MUI_LICENSE);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<AppProviders>
		<App />
	</AppProviders>
);

// TODO: Review performance monitoring implementation.
// For performance measurement, pass a function to log results (e.g., reportWebVitals(console.log))
// or send data to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
