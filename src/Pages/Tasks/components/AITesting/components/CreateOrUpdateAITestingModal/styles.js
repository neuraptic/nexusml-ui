import { colors } from '../../../../../../consts/colors';

const styles = () => ({
	dialogContentContainer: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	exampleColumnsContainer: {
		display: 'flex',
		flexDirection: 'column',
		overflowY: 'auto',
		maxHeight: '500px',
	},
	exampleColumnsRow: {
		display: 'flex',
		marginBottom: '20px',
	},
	nameColumn: {
		display: 'flex',
		width: '25%',
		alignItems: 'center',
	},
	inputColumn: {
		display: 'flex',
		width: '75%',
		alignItems: 'center',
		'& > *': {
			width: '90%',
		},
	},
	uploadContainer: {
		display: 'flex',
		alignItems: 'center',
		gap: '12px',
		width: '100%',
		padding: '8px 0px !important',
		'& > *': {
			width: '33.33% !important',
		},
	},
	createTypeContainer: {
		display: 'flex',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'flex-start',
		gap: '5%',
		marginTop: '30px',
	},
	csvUploadColumn: {
		display: 'flex',
		flexDirection: 'column',
		width: '40%',
		alignItems: 'center',
	},
	createExampleButton: {
		display: 'flex',
		flexDirection: 'column',
		width: '202px',
		height: '132px',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: 'white',
		border: `1px solid ${colors.gray}`,
		borderRadius: '7px',
		padding: '20px',
		letterSpacing: '0.14px',
		color: '#545454',
		fontSize: '13px',
		lineHeight: '18px',
		fontWeight: '700',
		'&:hover': {
			backgroundColor: `${colors.ligtherGray}`,
			boxShadow: '0px 3px 6px #00000029',
		},
		'& > *:lastChild': {
			fontSize: '4rem',
			color: colors.gray,
		},
		'& svg': {
			minWidth: '60px',
			maxWidth: '60px',
		},
	},

	loadingButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		border: `1px solid ${colors.gray}`,
		borderRadius: '7px',
		color: '#545454',
		fontSize: '13px',
		'&:hover': {
			backgroundColor: `${colors.ligtherGray}`,
			boxShadow: '0px 3px 6px #00000029',
		},
	},
	imagePreview: {
		maxHeight: '75px',
		maxWidth: '344px',
	},

	// Types
	typeCategory: {
		maxHeight: '38px',
		width: '90%',
		fontSize: '13px !important',
	},
	textarea: {
		width: '100%',
		maxWidth: '344px',
		fontSize: '13px !important',
		background: '#fafbfd !important',
		border: '1px solid #70707045 !important',
		borderRadius: '3px !important',
		padding: '7px 11px !important',
		letterSpacing: '0.17px !important',
		color: '#1a1c21 !important',
	},
});

export default styles;
