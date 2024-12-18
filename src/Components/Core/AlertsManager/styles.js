import { colors } from '../../../consts/colors';

const styles = () => ({
	mainAlertContainer: {
		display: 'flex',
		gap: 3,
		flexDirection: 'column',
		position: 'fixed',
		right: 0,
		bottom: 0,
		width: '400px',
		height: 'fit-content',
		maxHeight: '80vh',
		zIndex: 1000000000,
		overflowY: 'auto',
	},
	error: {
		display: 'flex',
		justifyContent: 'left',
		width: '100%',
		border: `5px solid ${colors.errorAlertDark}`,
		fontWeight: 'bold',
	},
	warning: {
		display: 'flex',
		justifyContent: 'left',
		width: '100%',
		border: `5px solid ${colors.warningAlertDark}`,
		fontWeight: 'bold',
	},
	info: {
		display: 'flex',
		justifyContent: 'left',
		width: '100%',
		border: `5px solid ${colors.infoAlertDark}`,
		fontWeight: 'bold',
	},
	success: {
		display: 'flex',
		justifyContent: 'left',
		width: '100%',
		border: `5px solid ${colors.successAlertDark}`,
		fontWeight: 'bold',
	},
});

export default styles;
