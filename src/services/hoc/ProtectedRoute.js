import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

export const ProtectedRoute = (props) => {
	const { children, isAuthenticated } = props;

	// Maintenance mode
	if (process.env.NEXUSML_UI_IS_MAINTENANCE_MODE === 'true') return children;

	return isAuthenticated || process.env.NEXUSML_UI_AUTH_ENABLED === 'false' ? (
		children || <Outlet />
	) : (
		<Navigate to="/signin" />
	);
};

ProtectedRoute.propTypes = {
	children: PropTypes.func,
	isAuthenticated: PropTypes.bool,
};
