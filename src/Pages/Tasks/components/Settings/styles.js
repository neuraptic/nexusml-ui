const styles = () => ({
	servicesList: {
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		gap: 12,
		'& > div:firsChild': {
			width: '10%',
		},
		'& > div:lastChild': {
			display: 'flex',
			alignItems: 'center',
			width: '90%',
		},
	},
	taskInfoContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	taskInfoAvatar: {},
	cellContainer: {
		width: '100%',
		display: 'flex',
	},
	cellColumn: {
		minWidth: '50px',
		width: '33%',
		display: 'flex',
		justifyContent: 'center',
		fontWeight: 'bold',
	},
});

export default styles;
