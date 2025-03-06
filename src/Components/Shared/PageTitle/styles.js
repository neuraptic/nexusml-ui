import { colors } from '../../../consts/colors';

const styles = () => ({
	pageTitleContainer: {
		display: 'flex',
		gap: '24px',
		width: '100%',
		margin: '12px 0px 6px 0px',
		fontSize: 'xx-large',
		alignItems: 'center',
	},
	title: {
		fontSize: 'small',
		marginBottom: '36px',
	},
	tabsContainer: {
		width: '100%',
		display: 'flex',
		flexWrap: 'wrap',
		marginTop: '6px',
	},
	tabElement: {
		padding: '6px 12px',
		fontWeight: 'bold',
		fontSize: '1rem',
		backgroundColor: colors.ligtherGray,
		border: 'none',
		borderRadius: '12px 12px 0px 0px',
	},
	current: {
		color: `${colors.blue} !important`,
		borderBottom: `3px solid ${colors.blue}`,
		backgroundColor: colors.lightBlueButton,
		borderRadius: '12px 12px 0px 0px',
	},
	titleTaskContainer: {
		width: '100%',
		display: 'flex',
		gap: '25px',
		marginBottom: '6px',
		fontSize: 'small',
		paddingLeft: '6px',
	},
	titleTaskId: {
		display: 'flex',
		alignItems: 'center',
	},
	titleCreatedAt: {
		display: 'flex',
		alignItems: 'center',
	},
	titleEndpoint: {
		display: 'flex',
		alignItems: 'center',
	},
});

export default styles;
