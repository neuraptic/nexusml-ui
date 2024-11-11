const styles = () => ({
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
	apiKeyContainer: {
		display: 'flex',
	},
	apiKeyInput: {
		width: '85% important',
	},
	apiKeyButtons: {
		display: 'flex',
		width: '15% !important',
	},

	tableTitle: {
		fontSize: 'small !important',
		fontWeight: `bold !important`,
		padding: '4px 9px !important',
		letterSpacing: '0.14px !important',
		color: '#545454 !important',
		lineHeight: '18px !important',
	},
	tableContent: {
		padding: '12px 9px !important',
		fontSize: 'small !important',
	},

	scopesContainer: {
		width: '99%',
		display: 'flex',
		flexDirection: 'column',
		marginTop: '24px',
	},
	scopeTableHeader: {
		borderBottom: '2px solid gray',
	},
	scopeTableHeadCell: {
		padding: '6px 0px !important',
		fontWeight: `bold !important`,
	},
	scopeTitle: {
		width: '40%',
	},
	scopeCrudContainer: {
		display: 'flex',
		'& > div': {
			width: '25%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		},
	},
	scopeCrudElement: {
		width: '15%',
	},
	scopeTableBody: {
		borderBottom: '2px solid gray',
	},
});

export default styles;
