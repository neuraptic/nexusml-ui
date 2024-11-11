const styles = () => ({
	sectionContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
	},
	sectionTitle: {
		fontWeight: 'bold',
		marginBottom: '12px',
	},
	sectionContent: {
		display: 'flex',
		flexDirection: 'column',
		'& > *': {
			marginBottom: '6px',
		},
	},
});

export default styles;
