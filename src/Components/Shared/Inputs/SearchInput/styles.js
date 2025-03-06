import { colors } from '../../../../consts/colors';

const styles = () => ({
	searchContainer: {
		position: 'relative',
		width: '100%',
	},
	searchIconWrapper: {
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: '12px',
	},
	styledInputBase: {
		color: 'inherit',
		width: '100%',
		padding: '12px',
		paddingLeft: '36px',
		border: `1px solid ${colors.gray}`,
		backgroundColor: colors.ligthGray,
	},
});

export default styles;
