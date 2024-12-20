import { colors } from '../../../../consts/colors';

const styles = () => ({
	dialogContentContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
	},

	dialogContent: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		maxWidth: '100%',
		'& > *:firstChild': {
			width: '30%',
			display: 'flex',
			alignItems: 'flex-start',
			justifyContent: 'flex-start',
		},
		'& > *:lastChild': {
			width: '70%',
			'& > *': {
				width: '100%',
			},
		},
	},

	dialogContentText: {
		fontSize: 14,
		fontWeight: 500,
	},

	textField: {
		width: '194px',
		backgroundColor: colors.inputBgGray,
	},

	dialogApiKeyTextFieldContainer: {
		display: 'flex',
		alignItems: 'center',
		gap: '13px',
	},

	dropdown: { m: 1, minWidth: '194px', margin: 0 },

	dialogActionsContainer: {
		justifyContent: 'flex-start',
		padding: '0 18px',
		gap: '7px',
		marginTop: '43px',
	},

	dialogActionBtnInvite: {
		boxShadow: 'none',
		width: '98px',
		backgroundColor: colors.lightBlueButton,
		borderRadius: '9px',
		'&:hover': {
			backgroundColor: colors.lightBlue,
			'& span': {
				color: 'white',
			},
		},
	},

	dialogActionBtnClose: {
		width: '98px',
		boxShadow: 'none',
		backgroundColor: colors.ligthGray,
		borderRadius: '9px',
		'&:hover': {
			backgroundColor: '#f44336',
			'& span': {
				color: 'white',
			},
		},
	},

	dialogActionTextInvite: {
		textTransform: 'initial',
		color: colors.blue,
		maxWidth: '98px',
		fontWeight: 600,
	},

	dialogActionTextClose: {
		textTransform: 'initial',
		color: '#666666',
		fontWeight: 600,
		'&.MuiButtonBase-root:hover': {
			bgcolor: 'transparent',
		},
	},

	column1: {
		width: {
			xs: '100%',
			sm: '100%',
			md: '40%',
			lg: '40%',
		},
		display: 'flex',
		flexDirection: 'column',
	},
	column2: {
		width: {
			xs: '100%',
			sm: '100%',
			md: '60%',
			lg: '30%',
		},
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

	inputContainer: {
		display: 'flex',
		alignItems: 'center',
		gap: '5px',
		marginTop: '30px',
	},
});

export default styles;
