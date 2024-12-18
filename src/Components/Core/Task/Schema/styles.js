const styles = () => ({
	edgebutton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '30px',
		height: '30px',
		background: '#eee',
		color: 'red',
		border: '1px solid red',
		cursor: 'pointer',
		borderRadius: '50%',
		fontSize: '1rem',
		lineHeight: 1,
		fontWeight: 'bold',
		'&:hover': {
			boxShadow: '0 0 6px 2px rgba(0, 0, 0, 0.08)',
		},
	},
});

export default styles;
