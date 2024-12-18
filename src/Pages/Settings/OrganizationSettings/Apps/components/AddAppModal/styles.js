const styles = () => ({
	dialogContentContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
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
				marginBottom: '0px',
			},
		},
	},
	actions: {
		display: 'flex',
		width: '100%',
		justifyContent: 'center',
		marginTop: '24px',
		gap: '12px',
		marginBottom: -24,
	},
});

export default styles;
