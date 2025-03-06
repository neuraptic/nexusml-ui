import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControl, Grid, IconButton, MenuItem, Select } from '@mui/material';
import { faEquals } from '@fortawesome/free-solid-svg-icons';

// Services
import { getElementToEdit } from '../../elementEditor.service';

const QueryBuilder = (props) => {
	const { tmpColumns, filters, setFilters } = props;

	// Global states
	const { categories: categoriesState } = useSelector((state) => state.schema);

	const handleChangeField = (e) => {
		const { value } = e.target;
		setFilters({ ...filters, query: `${value}=` });
	};

	const handleChangeValue = (name, value) => {
		setFilters({
			...filters,
			query: `${filters.query.split('=')[0]}=${value || ''}`,
		});
	};

	return (
		<Grid container sx={{ display: 'flex', gap: 1 }}>
			<Grid
				container
				spacing={3}
				sx={{ display: 'flex', alignItems: 'center' }}
			>
				<Grid item xs={3}>
					<FormControl fullWidth sx={{ backgroundColor: 'white' }}>
						<Select
							name={filters.query !== '' && filters.query.split('=')[0]}
							value={
								(filters.query !== '' && filters.query.split('=')[0]) || ''
							}
							onChange={handleChangeField}
						>
							{tmpColumns
								.filter(
									({ valueType }) =>
										valueType !== 'time_serie' &&
										valueType !== 'image_file' &&
										valueType !== 'audio_file' &&
										valueType !== 'video_file' &&
										valueType !== 'document_file' &&
										valueType !== 'generic_file'
								)
								.map(({ name, field }) => (
									<MenuItem key={uuidv4()} value={field}>
										{name}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={1}>
					<IconButton aria-label="delete" color="primary">
						<FontAwesomeIcon
							icon={faEquals}
							style={{
								fontSize: '18px',
							}}
						/>
					</IconButton>
				</Grid>
				<Grid item xs={3}>
					{filters.query !== '' &&
						filters.query.split('=')[0] &&
						categoriesState &&
						tmpColumns &&
						tmpColumns.find(
							(col) => col.field === filters.query.split('=')[0]
						) &&
						getElementToEdit[
							tmpColumns.find(
								(col) => col.field === filters.query.split('=')[0]
							).valueType
						]({
							currentCellId: filters.query.split('=')[0],
							currentElementType:
								tmpColumns.find(
									(col) => col.field === filters.query.split('=')[0]
								).fieldType === 'metadata'
									? 'metadata'
									: `${
											tmpColumns.find(
												(col) => col.field === filters.query.split('=')[0]
											).fieldType
									  }s`,
							currentElementValueType: tmpColumns.find(
								(col) => col.field === filters.query.split('=')[0]
							).valueType,
							currentValue: filters.query !== '' && filters.query.split('=')[1],
							setCurrentValue: handleChangeValue,
							categoriesState,
							name: filters.query !== '' && filters.query.split('=')[0],
						})}
				</Grid>
			</Grid>
		</Grid>
	);
};
export default QueryBuilder;

QueryBuilder.propTypes = {
	tmpColumns: PropTypes.array,
	filters: PropTypes.object,
	setFilters: PropTypes.func,
};
