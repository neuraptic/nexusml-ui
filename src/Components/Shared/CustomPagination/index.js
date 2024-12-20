import PropTypes from 'prop-types';

// Components
import { Pagination, TablePagination } from '@mui/material';

export const CustomPagination = (props) => {
	const {
		total,
		rowsPerPage,
		page,
		handleChangePage,
		handleChangeRowsPerPage,
		simple,
		rowsPerPageOptions = [5, 10, 25],
		column = null,
	} = props;

	return (
		total &&
		total > 0 && (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{!simple && (
					<Pagination
						count={Math.ceil(total / rowsPerPage)}
						siblingCount={0}
						page={page + 1}
						onChange={(e, value) => {
							if (column)
								handleChangePage({
									e,
									newPage: value - 1,
									currentElementType:
										column.fieldType !== 'metadata'
											? `${column.fieldType}s`
											: column.fieldType,
									column,
								});
							handleChangePage(e, value - 1);
						}}
						boundaryCount={1}
						size="small"
					/>
				)}
				<TablePagination
					rowsPerPageOptions={rowsPerPageOptions}
					component="div"
					count={total}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</div>
		)
	);
};

CustomPagination.propTypes = {
	total: PropTypes.number,
	rowsPerPage: PropTypes.number,
	page: PropTypes.number,
	handleChangePage: PropTypes.func,
	handleChangeRowsPerPage: PropTypes.func,
	simple: PropTypes.bool,
	rowsPerPageOptions: PropTypes.array,
	column: PropTypes.any,
};
