import { colors } from '../../../../consts/colors';

const styles = () => ({
	totalRoles: {
		fontSize: 'large !important',
		fontWeight: `bold !important`,
	},
	tableTitle: {
		fontSize: 'small !important',
		fontWeight: `bold !important`,
		padding: '4px 9px !important',
		letterSpacing: '0.14px !important',
		color: '#545454 !important',
		lineHeight: '18px !important',
	},
	tableContent: {
		padding: '12px 9px !important',
		fontSize: 'small !important',
	},
	apiKeyButtonsContainer: {
		'& > *:hover': {
			color: `${colors.blue} !important`,
		},
	},
});

export default styles;