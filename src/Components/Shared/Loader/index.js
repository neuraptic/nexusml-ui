import PropTypes from 'prop-types';

// Components
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

// Styles
import styles from './styles';

const sizes = {
	S: 25,
	M: 50,
	L: 75,
};

export const Loader = (props) => {
	const { size, local } = props;

	if (local) {
		return <CircularProgress size={sizes[size]} />;
	}

	return (
		<Box sx={styles().container}>
			<CircularProgress size={sizes[size]} />
		</Box>
	);
};

Loader.propTypes = {
	size: PropTypes.string,
	local: PropTypes.bool,
};
