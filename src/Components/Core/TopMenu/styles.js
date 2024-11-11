import { colors } from '../../../consts/colors';

const styles = () => ({
	mainContainer: {
		position: 'fixed',
		top: 0,
		height: { xs: '10vh', sm: '8vh' },
		display: 'flex',
		alignItems: 'center',
		backgroundColor: '#f9f9f9',
		boxShadow: '0px 2px 6px #ccc',
		zIndex: 10,
	},
	organizationProjectContainer: {
		display: 'flex',
		alignItems: 'center',
		fontWeight: 'bold',
		color: colors.darkGray,
		border: '0px',
		backgroundColor: 'transparent',
	},
	organizationLogo: {
		width: '3vw',
		height: '3vw',
	},
	selectOrganizationProjectContainer: {
		display: 'block',
		flexDirection: 'column',
		'& > *:first-child': {
			marginBottom: '24px',
		},
		'& > *:last-child': {
			marginTop: '24px',
		},
	},
	projectContainer: {
		border: `1px solid ${colors.gray}`,
		backgroundColor: colors.ligtherGray,
		height: '250px',
		borderRadius: '6px',
	},
	selectOrganizationProjectRow: {
		display: 'flex',
		alignItems: 'flex-start',
		'&:first-child': {
			alignItems: 'center',
		},
		'& > *': {
			minWidth: '30%',
			width: '100%',
		},
		'& > *:first-child': {
			width: '30%',
		},
		'& > *:nth-child(3)': {
			maxWidth: '30%',
			display: 'flex',
			justifyContent: 'right',
		},
	},
	selectOrganizationColumn: {
		overflowY: 'auto',
		height: '250px',
		display: 'flex',
		flexDirection: 'column',
		listStyle: 'none',
		margin: 0,
		padding: '6px',
		alignItems: 'flex-start',
	},
	selectProjectColumn: {
		height: '250px',
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'wrap',
		listStyle: 'none',
		margin: 0,
		padding: '6px',
		overflowX: 'auto',
		alignItems: 'flex-start',
	},
	selectButton: {
		display: 'flex',
		alignItems: 'center',
		width: '100%',
		maxWidth: '100%',
		border: 'none',
		background: 'none',
		padding: '6px',
		cursor: 'pointer',
		color: `${colors.darkGray} !important`,
		'&:hover': {
			color: '#1492E6 !important',
			svg: {
				color: '#1492E6 !important',
			},
		},
	},
	projectSelectButton: {
		width: '50%',
	},
	iconProject: {
		marginRight: '6px',
	},
	selectedOrganizationProject: {
		'& > *': {
			color: `${colors.blue} !important`,
		},
	},

	companyNameContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: { xs: 'center', sm: 'left', md: 'center' },
		fontSize: 'x-large',
	},
	companyLogo: {
		padding: '0 12px',
	},
});

export default styles;
