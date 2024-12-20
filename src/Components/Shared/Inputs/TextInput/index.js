import PropTypes from 'prop-types';

// Components
import { TextField } from '@mui/material';

// Styles
import styles from './styles';

export const TextInput = (props) => {
	const { placeholder, onChange } = props;

	return (
		<TextField
			placeholder={placeholder}
			variant="outlined"
			sx={styles().companyNameInput}
			size="small"
			hiddenLabel
			onChange={onChange}
			{...props}
		/>
	);
};

TextInput.propTypes = {
	placeholder: PropTypes.string.isRequired,
	onChange: PropTypes.func,
};
