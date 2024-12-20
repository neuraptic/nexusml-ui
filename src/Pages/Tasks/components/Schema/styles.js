import { colors } from '../../../../consts/colors';

export const styles = {
	elementContainer: {
		display: 'flex',
		flexDirection: 'column !important',
		alignItems: 'center',
		padding: '0px !important',
		borderRadius: '6px',
		'& > *': {
			display: 'flex',
			width: '100%',
		},
	},
	elementComponent: {
		width: '100%',
		height: '50px',
		padding: '6px',
		paddingRight: '12px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '3px',
	},
	lastModification: {
		display: 'flex',
		alignItems: 'center',
		fontSize: 'small',
		marginBottom: '12px',
		'& > *:first-child': {
			marginRight: '12px',
		},
	},
	inputsContainer: {
		display: 'flex',
		width: '100%',
		gap: '12px',
	},
	dataSelectorContainer: {
		width: '30%',
	},
	dataSelector: {
		display: 'flex',
		alignItems: 'center',
		paddingTop: '12px',
		paddingBottom: '12px',
		border: 'none',
		background: 'transparent',
		width: '100%',
		fontWeight: 'bold',
		'& > *:first-child': {
			marginRight: '6px',
		},
		'&:hover': {
			outline: '1px solid gray',
			borderRadius: '6px',
		},
		'&.active': {
			background: '#f5f5f5',
		},
	},
	addDataContainer: {
		width: '70%',
		display: 'flex',
		flexDirection: 'column',
	},
	addData: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '36px',
		padding: '0 10px',
		borderRadius: '2px',
		'&:hover': {
			boxShadow: '0px 3px 6px #00000029',
		},
	},
	dataType: {
		width: '60%',
		display: 'flex',
		alignItems: 'center',
	},
	dataSize: {
		width: '25%',
		display: 'flex',
		alignItems: 'center',
		'& > *:first-child': {
			marginRight: '6px',
		},
	},
	dataManage: {
		display: 'flex',
		justifyContent: 'center',
		width: '15%',
	},
	inputs: {
		fill: `${colors.taskInput} !important`,
		color: `${colors.taskInput} !important`,
	},
	outputs: {
		fill: `${colors.taskOutput} !important`,
		color: `${colors.taskOutput} !important`,
	},
	metaData: {
		fill: `${colors.taskMetaData} !important`,
		color: `${colors.taskMetaData} !important`,
	},
	groups: {
		fill: `${colors.taskGroups} !important`,
		color: `${colors.taskGroups} !important`,
	},

	searchContainer: {
		position: 'relative',
		width: '100%',
	},
	searchIconWrapper: {
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: '12px',
	},
	styledInputBase: {
		color: 'inherit',
		width: '100%',
		padding: '12px',
		paddingLeft: '36px',
		border: `1px solid ${colors.gray}`,
		backgroundColor: colors.ligthGray,
	},
	highlight: {
		backgroundColor: '#ecc85c',
	},
};
