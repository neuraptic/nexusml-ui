import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { usePermify } from '@permify/react-role';

// Components
import {
	DataGridPro,
	GRID_CHECKBOX_SELECTION_COL_DEF,
} from '@mui/x-data-grid-pro';
import { Loader } from '../../../../../../Components/Shared/Loader';

// Consts
import { colors } from '../../../../../../consts/colors';

// Services
import checkIsAuthorized from '../../../../../../services/checkIsAuthorized';

export const AITestingTable = (props) => {
	const {
		rows,
		currentColumns,
		setCurrentCellId,
		setCurrentRowId,
		setSelectedRows,
		selectedRows,
	} = props;

	const { isAuthorized } = usePermify();

	// Global states
	const { schema: schemaState } = useSelector((state) => state.schema);
	const { isLoading: isLoadingAITestingState } = useSelector(
		(state) => state.tests
	);

	// Local states
	const [canUpdate, setCanUpdate] = useState(false);

	useEffect(() => {
		checkIsAuthorized({
			isAuthorized,
			setCanUpdate,
			permission: 'task.update',
		});
	}, []);

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
		schemaState?.inputs &&
		currentColumns &&
		currentColumns.length > 0 && (
			<DataGridPro
				initialState={{
					pinnedColumns: {
						left: [GRID_CHECKBOX_SELECTION_COL_DEF.field, 'aimodels', 'status'],
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
				onCellDoubleClick={(params, event) => {
					if (!event.ctrlKey) {
						event.defaultMuiPrevented = true;
					}
					if (
						canUpdate &&
						params.field !== 'edit' &&
						params.field !== 'status'
					) {
						setCurrentCellId(params.field);
						setCurrentRowId(params.row.id);
					}
				}}
				sx={{
					border: 'none',
					'.MuiDataGrid-row': {
						cursor: 'pointer',
					},
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
				}}
			/>
		)
	);
};

AITestingTable.propTypes = {
	currentColumns: PropTypes.array,
	rows: PropTypes.array,
	setCurrentCellId: PropTypes.func,
	setCurrentRowId: PropTypes.func,
	setSelectedRows: PropTypes.func,
	selectedRows: PropTypes.array,
};
