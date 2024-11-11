import { colors } from '../../../consts/colors';

const styles = () => ({
	tableTitle: {
		fontSize: 'small !important',
		fontWeight: `bold !important`,
		color: `${colors.darkGray} !important`,
	},
	tableContentContainer: {
		fontSize: 'small !important',
		margin: '0px !important',
		padding: '0px 12px !important',
	},
	tableContentCompanyLogo: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: '50%',
		width: '30px',
		height: '30px',
		marginRight: '6px',
	},
	tableContentDeploymentName: {
		fontWeight: 'bold',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	tableContentNameDescription: {
		fontSize: 'x-small !important',
		display: 'flex',
		flexDirection: 'column',
	},
	tableRow: {
		'&:hover': {
			backgroundColor: colors.lightBlueButton,
			cursor: 'pointer',
		},
	},

	tasksContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		alignItems: 'flex-center',
		marginTop: '6px',
	},
	taskCard: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '18px',
		borderRadius: '6px',
		height: '300px',
		'&:hover': {
			outline: `2px solid ${colors.blue}`,
			cursor: 'pointer',
		},
		'& > *': {
			display: 'flex',
			width: '100%',
			gap: '6px',
		},
	},
	taskIcon: {
		height: '15%',
		justifyContent: 'center',
	},
	taskName: {
		display: 'inline-box',
		verticalAlign: 'center',
		boxOrient: 'vertical',
		lineClamp: 2,
		overflow: 'hidden',
		fontSize: 'large',
		height: '20%',
		marginTop: '12px',
		fontWeight: 'bold',
	},
	taskDescription: {
		display: 'box',
		boxOrient: 'vertical',
		lineClamp: 4,
		position: 'relative',
		maxHeight: '80px',
		marginTop: '6px',
		overflow: 'hidden',
		whiteSpace: 'normal',
		textOverflow: 'ellipsis',
		'&:before': {
			content: '...',
			position: 'absolute',
			right: 0,
			bottom: 0,
		},
	},
	taskLastModification: {
		position: 'absolute',
		bottom: '55px',
		padding: '0px 18px',
		display: 'flex',
		whiteSpace: 'normal',
	},
	taskStatus: {
		position: 'absolute',
		bottom: 0,
		padding: '18px',
		paddingTop: 0,
	},
});

export default styles;
