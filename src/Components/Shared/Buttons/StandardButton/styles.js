import { colors } from '../../../../consts/colors';

const styles = () => ({
	button: {
		backgroundColor: `${colors.ligthBlue} !important`,
		color: `${colors.blue} !important`,
		fontWeight: '500 !important',
		fontSize: '13px !important',
		textTransform: 'none !important',
		width: 'fit-content !important',
		borderRadius: '9px !important',
		padding: '8px 20px !important',
		lineHeight: '20px !important',
		boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.06) !important',
		letterSpacing: '0.15px !important',
		height: '36px',
		minWidth: '100px !important',
		maxWidth: '200px !important',
	},
	buttonTypography: {
		fontSize: '13px !important',
		fontWeight: '500 !important',
	},
	withIcon: {
		backgroundColor: `${colors.ligthBlue} !important`,
		color: `${colors.blue} !important`,
		borderRadius: '9px !important',
		width: '145px !important',
		padding: '2px 10px !important',
		boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.06) !important',
		minHeight: '36px',
		display: 'flex',
		alignItems: 'center',
		gap: '10px',
	},
	loadingButton: {
		backgroundColor: `${colors.ligthBlue} !important`,
		width: 'fit-content !important',
	},
	closeButton: {
		backgroundColor: `${colors.ligthGray} !important`,
		color: `${colors.darkGray} !important`,
	},
	textButton: {
		display: 'flex',
		justifyContent: 'left',
		color: `${colors.blue} !important`,
		fontSize: 'small !important',
		fontWeight: 'bold !important',
		minWidth: '100px !important',
		border: `1px solid ${colors.blue} !important`,
		textTransform: 'none !important',
		'&:hover': {
			backgroundColor: `${colors.lightBlueButton} !important`,
		},
	},

	filledButton: {
		background: '#1492E6',
		boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.06)',
		borderRadius: '9px',
		maxWidth: '130px',
		padding: '11px 50px !important',
	},

	filledButtonValue: {
		fontWeight: '500 !important',
		textTransform: 'none',
		color: '#1492E6',
		fontSize: '13px !important',
		lineHeight: 'normal',
	},

	withIconButtonValue: {
		color: '#1492E6',
		fontSize: 'small',
		textTransform: 'none !important',
	},
});

export default styles;
