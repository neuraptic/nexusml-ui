const styles = () => ({
	organizationForm: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: '24px',
		'& > * input': {
			minWidth: '320px !important',
		},
	},
	boldTitle: {
		fontWeight: 'bold',
		marginBottom: '12px',
	},
	ownerEmails: {
		display: 'flex',
		flexDirection: 'column',
	},

	uploadImageContainer: {
		display: 'flex',
		width: '100%',
		gap: '12px',
	},
	currentOrganizationImage: {
		maxWidth: '150px',
	},
});

export default styles;
