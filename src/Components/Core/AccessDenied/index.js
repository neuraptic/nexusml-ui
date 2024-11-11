import PropTypes from 'prop-types';

// Components
import { Grid } from '@mui/material';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';

// Styles
import styles from './styles';

const AccessDenied = (props) => {
	const { width = '60%' } = props;

	return (
		<div style={styles().mainContainer}>
			<Grid container style={styles(width).accessDeniedContainer}>
				<LockPersonOutlinedIcon sx={{ fontSize: '48px' }} />
				<p>
					You don't have enough permissions to access this resource. Contact
					your administrator for more information
				</p>
			</Grid>
		</div>
	);
};

AccessDenied.propTypes = {
	width: PropTypes.any,
};

export default AccessDenied;
