const styles = () => ({
	dialogContentContainer: {
		display: 'flex',
		flexWrap: 'wrap',
	},

	fieldTypeColumn: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		minWidth: '33%',
		fontWeight: 'bold',
		padding: '0 15px',
	},
	fieldTypeElement: {
		marginTop: '6px',
		width: '100%',
		maxHeight: '250px',
		overflow: 'auto',
	},
	fieldTypeRow: {
		display: 'flex',
		alignItems: 'center',
		marginTop: '12px',
	},
});

export default styles;
