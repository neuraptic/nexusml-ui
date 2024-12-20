const styles = () => ({
	uploadContainer: {
		display: 'flex',
		alignItems: 'center',
		gap: '12px',
		width: '100%',
		padding: '8px 0px !important',
		'& > *': {
			width: '33.33% !important',
		},
	},
	imagePreview: {
		maxHeight: '75px',
		maxWidth: '344px',
	},
});

export default styles;
