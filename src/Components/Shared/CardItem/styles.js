import { colors } from '../../../consts/colors';

const styles = () => ({
	// Standard
	titleContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: '10px',
	},
	title: {
		fontSize: '14px',
		fontWeight: 'bold',
		color: '#545454',
		width: '*',
		minWidth: '150px',
		display: 'flex',
		alignItems: 'center',
		marginLeft: '0',
		letterSpacing: '0.18px',
	},
	titleLink: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',
		fontSize: 'small',
	},
	closeIcon: {
		display: 'flex',
	},
	content: {
		margin: '0px 0px',
		fontSize: 'small',
		height: '100%',
	},

	// Big Left Icon
	bigLeftIcon: {
		'& > *:first-child': {
			fontSize: '50px',
		},
	},
	bigLeftIconTitleContent: {
		display: 'flex',
		flexDirection: 'column',
		'& > *:first-child': {
			marginBottom: '-12px',
		},
	},

	// Task
	taskHeaderContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		'& > *:first-child': {
			width: '10%',
		},
		'& > *:last-child': {
			width: '10%',
		},
	},
	taskIcon: {
		'& > *:first-child': {
			fontSize: 'xx-large',
		},
	},
	taskTitleContainer: {
		display: 'flex',
		flexDirection: ' column',
		minWidth: '70%',
		width: '80%',
	},
	subTitle: {
		display: 'flex',
		alignItems: 'center',
		marginLeft: '0',
		fontSize: 'x-small',
		'& > *:first-child': {
			marginRight: '3px',
		},
	},
	taskTitleLink: {
		display: 'flex',
		justifyContent: 'right',
		alignItems: 'center',
		maxWidth: '15%',
		'& > *:first-child': {
			color: `${colors.blue} !important`,
		},
	},
});

export default styles;
