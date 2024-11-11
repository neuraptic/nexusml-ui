import { colors } from '../../consts/colors';

const styles = () => ({
	pageTitleContainer: {
		background: '#F1F3F7',
		display: 'flex',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
	},

	title: {
		letterSpacing: '0.33px',
		color: colors.textPrimary,
		opacity: '0.82',
		fontSize: '24px',
	},

	contentContainer: {
		display: 'flex',
		gap: '30px',
		flexWrap: 'wrap',
	},

	accountTypeSwitcherText: {
		fontSize: 13,
		letterSpacing: '0.13px',
		fontWeight: 700,
		textTransform: 'none',
	},

	companyNameInput: {
		maxWidth: '203px',
		border: '1px solid #70707045',
		borderRadius: '5px',
		background: '#FAFBFD',
	},
});

export default styles;
