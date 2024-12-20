import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// Components
import {
	DataGridPro,
	GRID_CHECKBOX_SELECTION_COL_DEF,
} from '@mui/x-data-grid-pro';
import { Loader } from '../../../../../../Components/Shared/Loader';

// Consts
import { colors } from '../../../../../../consts/colors';

export const AIPredictionsTable = (props) => {
	const {
		currentColumns,
		rows,
		setCurrentRowId,
		setSelectedRows,
		selectedRows,
	} = props;

	// Global states
	const { isLoading: isLoadingAITestingState } = useSelector(
		(state) => state.predictions
	);

	if (isLoadingAITestingState) {
		return (
			<div
				style={{
					width: '100%',
					height: '500px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Loader size="L" local />;
			</div>
		);
	}

	return (
		currentColumns &&
		currentColumns.length > 0 && (
			<DataGridPro
				initialState={{
					pinnedColumns: {
						left: [GRID_CHECKBOX_SELECTION_COL_DEF.field, 'aimodel'],
					},
				}}
				rows={rows}
				columns={currentColumns}
				rowSelection
				rowSelectionModel={selectedRows}
				onRowSelectionModelChange={(selectionModel) => {
					if (selectionModel.length > 1 || selectionModel.length === 0) {
						setCurrentRowId('');
					} else {
						setCurrentRowId(selectionModel[0]);
					}
					setSelectedRows(selectionModel);
				}}
				checkboxSelection
				disableSelectionOnClick
				hideFooterPagination
				sx={{
					border: 'none',
					'.MuiDataGrid-columnHeader.MuiDataGrid-columnHeaderCheckbox': {
						outline: 'none',
						minWidth: '50px !important',
						maxWidth: '50px !important',
					},
					'.MuiDataGrid-columnHeader:hover': {
						background: 'rgba(0, 0, 0, 0.04)',
					},
					'.MuiDataGrid-columnHeader:focus-within': {
						outline: 'none',
						background: 'rgba(0, 0, 0, 0.04)',
					},
					'.MuiBox-root': {
						display: 'flex',
						alignItems: 'center',
						gap: '5px',
						fontSize: '13px',
						fontWeight: '600',
						letterSpacing: '0.14px',
						color: '#545454',
					},
					'.MuiDataGrid-cellCheckbox.MuiDataGrid-cell': {
						width: '50px !important',
						minWidth: '50px !important',
						maxWidth: '50px !important',
						backgroundColor: colors.ligthGray,
					},
					'.MuiDataGrid-cell .MuiTypography-subtitle1': {
						whiteSpace: 'nowrap',
						display: 'block',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					},
					// Personaliced classes
					'& .metrics-column': {
						width: '50px !important',
						minWidth: '50px !important',
						maxWidth: '50px !important',
						boxShadow: `-2px 0 ${colors.gray} inset`,
					},
				}}
			/>
		)
	);
};

AIPredictionsTable.propTypes = {
	currentColumns: PropTypes.array,
	rows: PropTypes.array,
	setCurrentRowId: PropTypes.func,
	setSelectedRows: PropTypes.func,
	selectedRows: PropTypes.array,
};
