import PropTypes from 'prop-types';

// Components
import { CircularProgress } from '@mui/material';

function CircleProgress(props) {
	const {
		size = 50,
		thickness = 4,
		value = 0,
		secColor = '#d1d1d1',
		max = 100,
	} = props;

	const convertedValue = (value * 100) / max;

	const progressSx = {
		borderRadius: '50%',
		boxShadow: `inset 0 0 0 ${(thickness / 44) * size}px ${secColor}`,
	};

	return (
		<div style={{ position: 'relative', display: 'inline-flex' }}>
			<CircularProgress
				variant="determinate"
				size={size}
				thickness={thickness}
				value={convertedValue}
				sx={progressSx}
			/>
		</div>
	);
}

CircleProgress.propTypes = {
	size: PropTypes.number,
	thickness: PropTypes.number,
	value: PropTypes.number,
	max: PropTypes.number,
	secColor: PropTypes.string,
};

export default CircleProgress;
