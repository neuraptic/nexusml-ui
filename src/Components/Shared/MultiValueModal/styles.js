const styles = () => ({
	// Layout
	arrowContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},

	// Inner components
	arrowModal: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		cursor: 'pointer',
		color: 'black',
		backgroundColor: 'white',
		borderRadius: '9px',
		padding: '12px',
	},
	mainModal: {
		width: '100%',
		height: '85vh',
		backgroundColor: 'white',
		padding: '15px 28px 30px 28px',
		borderRadius: '9px',
		boxShadow: '0px 3px 15px #0000004f',
		marginBottom: '2vh',
	},
	bottomModal: {
		width: '100%',
		height: '5vh',
	},
});

export default styles;
