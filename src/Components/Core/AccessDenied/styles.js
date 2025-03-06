const styles = (width) => ({
	mainContainer: {
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
	},
	accessDeniedContainer: {
		borderRadius: '24px',
		maxWidth: width,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		margin: '48px 0px',
		padding: '6px 12px',
	},
	accessDeniedTitle: {
		marginBottom: '-12px',
	},
});

export default styles;
