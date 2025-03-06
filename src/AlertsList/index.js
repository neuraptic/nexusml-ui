import * as userSettingsAlerts from './userSettingsAlerts';
import * as dashboardAlerts from './dashboardAlerts';

const alertsManager = {
	...userSettingsAlerts,
	...dashboardAlerts,
};

export default alertsManager;
