import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

export const ProtectedRoute = (props) => {
	const { children, isAuthenticated } = props;

	// Maintenance mode
	if (process.env.NEXUSML_UI_IS_MAINTENANCE_MODE === 'true') return children;
	if (process.env.NEXUSML_UI_DEFAULT_API_KEY_ENABLED === 'true')
		return children;

	return isAuthenticated ? children || <Outlet /> : <Navigate to="/signin" />;
};

ProtectedRoute.propTypes = {
	children: PropTypes.func,
	isAuthenticated: PropTypes.bool,
};
