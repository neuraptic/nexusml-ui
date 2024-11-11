import PropTypes from 'prop-types';

// Components
import SearchIcon from '@mui/icons-material/Search';

// Styles
import styles from './styles';

export const SearchInput = (props) => {
	const { placeholder, value, handleChange } = props;

	return (
		<div style={styles().searchContainer}>
			<div style={styles().searchIconWrapper}>
				<SearchIcon />
			</div>
			<input
				style={styles().styledInputBase}
				placeholder={placeholder}
				onChange={handleChange}
				value={value}
			/>
		</div>
	);
};

SearchInput.propTypes = {
	placeholder: PropTypes.string,
	value: PropTypes.string,
	handleChange: PropTypes.func,
};
