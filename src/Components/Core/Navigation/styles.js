import { colors } from '../../../consts/colors';

const styles = () => ({
	navContainer: {
		display: 'flex',
		marginRight: '-24px',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	navContainerFirstElement: {
		display: 'flex',
		position: 'relative',
		marginRight: '-24px',
		justifyContent: 'center',
		alignItems: 'center',
	},
	links: {
		height: '100%',
		fontSize: 'small',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.gray,
		color: colors.darkGray,
		textDecoration: 'none',
		padding: '0px 6px',
		borderRadius: '6px',
		paddingLeft: '16px',
	},
	linksFirstElement: {
		height: '100%',
		fontSize: 'small',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.gray,
		color: colors.darkGray,
		textDecoration: 'none',
		padding: '0px 6px',
		borderRadius: '6px',
		paddingLeft: '16px',
	},
	arrowRight: {
		width: 0,
		height: 0,
		position: 'relative',
		left: '-3px',
		borderTop: '12px solid transparent',
		borderBottom: '12px solid transparent',
		borderLeft: '12px solid #ddd',
	},
	arrowRightFirstElement: {
		width: 0,
		height: 0,
		position: 'relative',
		left: '-3px',
		borderTop: '12px solid transparent',
		borderBottom: '12px solid transparent',
		borderLeft: '12px solid #ddd',
	},
	arrowRightSecondary: {
		width: 0,
		height: 0,
		position: 'relative',
		left: '-12px',
		borderTop: '12px solid transparent',
		borderBottom: '12px solid transparent',
		borderLeft: '12px solid white',
	},
	arrowRightSecondaryFirstElement: {
		width: 0,
		height: 0,
		position: 'relative',
		left: '-12px',
		borderTop: '12px solid transparent',
		borderBottom: '12px solid transparent',
		borderLeft: '12px solid white',
	},
});

export default styles;
