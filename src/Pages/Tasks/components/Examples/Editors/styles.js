import { colors } from '../../../../../consts/colors';

const styles = () => ({
	topMenu: {
		display: 'flex',
		width: '100%',
		marginBottom: '12px',
		alignItems: 'center',
	},
	topMenuIcon: {
		fontSize: '24px',
		color: colors.blue,
		margin: '0px 6px',
		cursor: 'pointer',
	},
	JSON: {
		maxHeight: '500px',
		overflowY: 'auto',
	},
});

export default styles;
