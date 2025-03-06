import { colors } from '../../../../../../../../consts/colors';

const styles = () => ({
	actions: {
		width: '100%',
		display: 'flex',
		gap: '12px',
		marginTop: '24px',
		marginBottom: -24,
	},
	formInput: {
		maxWidth: '70%',
		fontSize: '1rem',
		marginTop: '12px',
		marginLeft: '6px',
	},

	dangerTitle: {
		color: '#DC1212',
		fontWeight: 600,
		marginTop: '24px',
		marginBottom: '-10px',
		fontSize: 14,
	},

	dialogDeleteKeyBtn: {
		backgroundColor: '#F8D2D2',
		boxShadow: 'none',
		borderRadius: '9px',
		'&:hover': {
			backgroundColor: '#f44336',
			'& span': {
				color: 'white',
			},
		},
	},

	dialogDeleteKeyText: {
		textTransform: 'initial',
		color: '#DC1212',
		fontWeight: 600,
	},

	dangerZoneTitle: {
		fontWeight: 600,
		fontSize: 14,
	},

	dangerZoneDescription: {
		fontWeight: 600,
		fontSize: 13,
		paddingTop: '10px',
		color: colors.textSilent,
	},
});

export default styles;
