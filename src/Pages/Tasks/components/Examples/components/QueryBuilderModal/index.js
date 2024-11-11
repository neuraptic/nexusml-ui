import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Components
import { Grid } from '@mui/material';
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';
import QueryBuilder from '../QueryBuilder';

export const QueryBuilderModal = (props) => {
	const { open, setOpen, allColumns, query, setQuery, filters, setFilters } =
		props;

	// Local states
	const [tmpColumns, setTmpColumns] = useState([]);

	useEffect(() => {
		if (allColumns.length > 0)
			setTmpColumns(
				allColumns.filter(
					(column) =>
						column.fieldType !== 'status' &&
						column.fieldType !== 'comments' &&
						column
				)
			);
	}, [allColumns]);

	const handleSaveChanges = async () => {
		if (query.field !== '' && query.value !== '')
			setFilters({
				...filters,
				query: `${query.field}=${query.value}`,
			});
		setOpen(false);
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Query builder:"
			content={
				<Grid>
					{tmpColumns.length > 0 && (
						<QueryBuilder
							tmpColumns={tmpColumns}
							query={query}
							setQuery={setQuery}
						/>
					)}
				</Grid>
			}
			actions={
				<>
					<StandardButton value="Save view" handleClick={handleSaveChanges} />
					<StandardButton
						value="Close"
						handleClick={() => setOpen(!open)}
						close
					/>
				</>
			}
		/>
	);
};

QueryBuilderModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	allColumns: PropTypes.array,
	query: PropTypes.object,
	setQuery: PropTypes.func,
	filters: PropTypes.object,
	setFilters: PropTypes.func,
};
