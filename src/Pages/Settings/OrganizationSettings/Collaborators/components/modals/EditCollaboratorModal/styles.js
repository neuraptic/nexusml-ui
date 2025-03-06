const styles = () => ({
	modalContainer: {
		height: '500px',
		overflow: 'auto',
	},
	dialogContentContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
		fontSize: 'small',
	},
	dialogContent: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		maxWidth: '95%',
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
	tableTitle: {
		fontSize: 'small !important',
		fontWeight: `bold !important`,
		padding: '4px 9px !important',
		letterSpacing: '0.14px !important',
		color: '#545454 !important',
		lineHeight: '18px !important',
	},

	rolesContainer: {
		padding: '24px 0px',
		width: '95%',
	},
	rolesContainerTitle: {
		fontSize: '14px',
		fontWeight: 'bold',
		color: '#545454',
		marginBottom: '12px',
	},
	rolesActions: {
		display: 'inline-flex',
	},

	tableContent: {
		padding: '12px 9px !important',
		fontSize: 'small !important',
	},
});

export default styles;
