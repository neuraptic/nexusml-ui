import { colors } from '../../../../../../consts/colors';

const styles = () => ({
	slicesChipsContainer: {
		width: '100%',
		height: '200px',
		display: 'flex',
		flexWrap: 'wrap',
		marginTop: '24px',
		alignContent: 'flex-start',
		overflowX: 'auto',
	},

	sliceChip: {
		width: '31%',
		borderRadius: '12px',
		margin: '6px',
		cursor: 'pointer',
		border: 'none',
		'&:hover': {
			backgroundColor: `${colors.gray} !important`,
		},
	},

	selectedSlice: {
		backgroundColor: `${colors.dangerLigth} !important`,
		'&:hover': {
			backgroundColor: `${colors.dangerLigth} !important`,
		},
	},

	anomalyUUID: {
		maxWidth: '100%',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
	},
	anomalyTrashIcon: {
		maxWidth: '20%',
		minWidth: '25px',
		padding: '0px 12px',
	},

	tableTitle: {
		fontSize: 'small !important',
		padding: '4px 9px !important',
		letterSpacing: '0.14px !important',
		color: '#545454 !important',
		lineHeight: '18px !important',
	},

	tableAnomalyType: {
		width: '300px',
	},
});

export default styles;
