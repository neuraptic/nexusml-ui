import PropTypes from 'prop-types';

// Components
import { CustomTooltip } from '../CustomTooltip';

// Services
import { getTextColorBasedOnBackgroundColor } from '../../../services/getTextColorBasedOnBackgroundColor';

// Styles
import styles from './styles';

function AnomalyChip(props) {
	const { color = '#ff0000', name, tooltip = false } = props;

	return (
		color &&
		(tooltip ? (
			<CustomTooltip title={name}>
				<button
					type="button"
					style={{
						...styles().shapeChip,
						backgroundColor: color,
						color: getTextColorBasedOnBackgroundColor(color),
					}}
				>
					{name}
				</button>
			</CustomTooltip>
		) : (
			<button
				type="button"
				style={{
					...styles().shapeChip,
					backgroundColor: color,
					color: getTextColorBasedOnBackgroundColor(color),
				}}
			>
				{name}
			</button>
		))
	);
}

AnomalyChip.propTypes = {
	color: PropTypes.string,
	name: PropTypes.string,
	tooltip: PropTypes.bool,
};

export default AnomalyChip;
