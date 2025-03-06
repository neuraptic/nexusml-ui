const styles = () => ({
	profileForm: {
		display: 'flex',
		flexDirection: 'column',
	},
	firstLine: {
		display: 'flex',
		gap: 12,
		'& > *': {
			width: '50%',
		},
	},
	input: {
		marginBottom: '24px !important',
	},
	changePasswordContainer: {
		display: 'flex',
		maxHeight: '30px',
		'& > *:firstChild': {
			marginRight: '12px',
		},
	},
});

export default styles;
