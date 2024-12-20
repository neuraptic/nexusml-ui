import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { usePermify } from '@permify/react-role';

// Components
import {
	DataGridPro,
	GRID_CHECKBOX_SELECTION_COL_DEF,
} from '@mui/x-data-grid-pro';
import { Loader } from '../../../../../../Components/Shared/Loader';

// Redux
import { SET_CURRENT_SHAPES } from '../../../../../../redux/examples.slice';

// Services
import checkIsAuthorized from '../../../../../../services/checkIsAuthorized';

// Consts
import { colors } from '../../../../../../consts/colors';

export const ExamplesTable = (props) => {
	const {
		rows,
		currentColumns,
		setCurrentCellId,
		setCurrentRowId,
		currentRowId,
		setSelectedRows,
		selectedRows,
	} = props;

	const { isAuthorized } = usePermify();
	const dispatch = useDispatch();

	// Global states
	const { isLoading: isLoadingExamplesState } = useSelector(
		(state) => state.examples
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

	useEffect(() => {
		if (currentRowId === '') {
			dispatch(SET_CURRENT_SHAPES([]));
		}
	}, [currentRowId]);

	if (isLoadingExamplesState) {
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
				<Loader size="L" local />
			</div>
		);
	}

	return (
		currentColumns &&
		currentColumns.length > 0 && (
			<DataGridPro
				initialState={{
					pinnedColumns: {
						left: [
							GRID_CHECKBOX_SELECTION_COL_DEF.field,
							'status',
							'tags',
							'comments',
						],
					},
				}}
				rows={rows}
				columns={currentColumns}
				checkboxSelection
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
					// Personaliced classes
					'& .gray-column': {
						backgroundColor: colors.gray,
					},
					'& .border-right': {
						boxShadow: `-2px 0 ${colors.gray} inset`,
					},
					'& .gray-column-border-right': {
						backgroundColor: colors.ligthGray,
						boxShadow: `-2px 0 ${colors.gray} inset`,
					},
					'& .tags-column': {
						borderRight: `1px solid ${colors.gray}`,
					},
				}}
			/>
		)
	);
};

ExamplesTable.propTypes = {
	currentColumns: PropTypes.array,
	rows: PropTypes.array,
	setCurrentCellId: PropTypes.func,
	setCurrentRowId: PropTypes.func,
	currentRowId: PropTypes.string,
	setSelectedRows: PropTypes.func,
	selectedRows: PropTypes.array,
};
