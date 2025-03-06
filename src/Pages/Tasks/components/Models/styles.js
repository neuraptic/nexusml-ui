const styles = () => ({
	modelsPaper: {
		width: '100%',
		marginBottom: '16px',
		background: '#FFFFFF',
		boxShadow: '0px 5px 6px 3px #00000029;',
		borderRadius: '12px',
		height: '500px',
	},

	trainingPaper: {
		width: '100%',
		marginBottom: '16px',
		background: '#FFFFFF',
		boxShadow: '0px 5px 6px 3px #00000029;',
		borderRadius: '12px',
	},

	documentationPaper: {
		width: '100%',
		marginBottom: '16px',
		background: '#FFFFFF',
		boxShadow: '0px 5px 6px 3px #00000029;',
		borderRadius: '12px',
	},

	formPaper: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		backgroundColor: '#F5F5F5',
		height: '35px',
	},

	modelsHeaderTitle: {
		flex: '1 1 100%',
		fontSize: '14px',
		fontWeight: 600,
		color: '#666666',
	},

	headerTitle: {
		flex: '1 1 100%',
		display: 'flex',
		gap: '8px',
		alignItems: 'center',
		fontSize: '14px',
		fontWeight: 600,
		color: '#666666',
	},

	// Models
	modelItemContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottom: '1px solid #BABABA',
		paddingBottom: '8px',
		'&:hover': {
			outline: '2px solid #1492E6',
			cursor: 'pointer',
		},
	},

	modelLeftContainer: {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
		justifyContent: 'space-between',
		width: '90%',
	},

	modelActiveContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: '5px',
		color: '#666666',
		width: '10%',
	},

	modelStatusContainer: {
		borderRadius: '5px',
		padding: '3px 20px',
		width: '95px',
		textAlign: 'center',
	},

	// Training
	trainingContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: '16px',
		padding: '16px',
	},

	// Form
	formContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: '16px',
		padding: '16px',
	},
});

export default styles;
