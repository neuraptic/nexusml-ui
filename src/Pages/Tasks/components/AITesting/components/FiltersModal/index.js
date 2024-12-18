import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { endOfToday } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Components
import { FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';
import QueryBuilder from '../QueryBuilder';

// Services
import {
	getLastMonth,
	getLastWeek,
	getThisMonth,
	getThisWeek,
	getToday,
	getTodayEnd,
	getYesterday,
	getYesterdayEnd,
} from '../../../../../../services/date';

// Consts
import { colors } from '../../../../../../consts/colors';

export const FiltersModal = (props) => {
	const {
		open,
		setOpen,
		filters,
		setFilters,
		view,
		setFiltersCount,
		tmpColumns,
	} = props;

	// Global states
	const aimodels = useSelector((state) => state.aimodels);

	useEffect(() => {
		let count = 0;

		if (filters.only_with_comments && filters.only_with_comments !== false)
			count += 1;
		if (filters.labeling_status?.length > 0) count += 1;
		if (filters.query !== '') count += 1;
		if (filters.order !== '' || filters.order_by !== '') count += 1;
		if (filters.period !== '') count += 1;
		if (filters.ai_model !== '') count += 1;

		setFiltersCount(count);
	}, [filters]);

	const handleChangeFilters = (e) => {
		const { name, value } = e.target;

		setFilters({ ...filters, [name]: value });
	};

	const handleChangeFromDateRange = (date) => {
		setFilters({ ...filters, 'created_at[min]': date });
	};

	const handleChangeToDateRange = (date) => {
		setFilters({ ...filters, 'created_at[max]': date });
	};

	const handleChangeByPeriod = (e) => {
		const { value } = e.target;
		switch (value) {
			case 'TODAY':
				setFilters({
					...filters,
					period: value,
					'created_at[min]': getToday(),
					'created_at[max]': getTodayEnd(),
				});
				break;
			case 'YESTERDAY':
				setFilters({
					...filters,
					period: value,
					'created_at[min]': getYesterday(),
					'created_at[max]': getYesterdayEnd(),
				});
				break;
			case 'THIS_WEEK':
				setFilters({
					...filters,
					period: value,
					'created_at[min]': getThisWeek().start,
					'created_at[max]': getThisWeek().end,
				});
				break;
			case 'LAST_WEEK':
				setFilters({
					...filters,
					period: value,
					'created_at[min]': getLastWeek().start,
					'created_at[max]': getLastWeek().end,
				});
				break;
			case 'THIS_MONTH':
				setFilters({
					...filters,
					period: value,
					'created_at[min]': getThisMonth().start,
					'created_at[max]': getThisMonth().end,
				});
				break;
			case 'LAST_MONTH':
				setFilters({
					...filters,
					period: value,
					'created_at[min]': getLastMonth().start,
					'created_at[max]': getLastMonth().end,
				});
				break;
			case 'CUSTOM':
				setFilters({
					...filters,
					period: value,
					'created_at[min]': null,
					'created_at[max]': null,
				});
				break;
			default:
				return null;
		}
	};

	const resetFilters = () => {
		if (view === 'examples')
			setFilters({
				only_with_comments: false,
				labeling_status: [],
				query: '',
				order: '',
				order_by: '',
				period: '',
				'created_at[min]': null,
				'created_at[max]': endOfToday(),
			});
		else
			setFilters({
				query: '',
				order: '',
				order_by: '',
				ai_model: '',
				period: '',
				'created_at[min]': null,
				'created_at[max]': endOfToday(),
			});
	};

	const handleClose = () => {
		setOpen(!open);
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Filters"
			content={
				<Grid container spacing={1}>
					<Grid
						item
						xs={12}
						sx={{
							display: 'flex',
							gap: 2,
							marginBottom: '12px',
							padding: '12px',
							backgroundColor: colors.ligtherGray,
							outline: `1px solid ${colors.gray}`,
							borderRadius: '12px',
						}}
					>
						<Grid
							item
							xs={3}
							sx={{
								display: 'flex',
								alignItems: 'center',
								fontWeight: 'bold !important',
							}}
						>
							By AI Model:
						</Grid>
						<Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
							<FormControl fullWidth>
								<Select
									id="ai_model"
									name="ai_model"
									value={filters.ai_model}
									onChange={handleChangeFilters}
								>
									{aimodels?.AIModels?.length > 0 &&
										aimodels.AIModels.map((model) => (
											<MenuItem key={uuidv4()} value={model.uuid}>
												{model?.version || ''}
											</MenuItem>
										))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
					<Grid
						item
						xs={12}
						sx={{
							display: 'flex',
							gap: 2,
							marginBottom: '12px',
							padding: '12px',
							backgroundColor: colors.ligtherGray,
							outline: `1px solid ${colors.gray}`,
							borderRadius: '12px',
						}}
					>
						<Grid
							item
							xs={3}
							sx={{
								display: 'flex',
								alignItems: 'center',
								fontWeight: 'bold !important',
							}}
						>
							By period:
						</Grid>
						<Grid
							item
							xs={filters.period !== 'CUSTOM' ? 9 : 3}
							sx={{ display: 'flex', alignItems: 'center' }}
						>
							<FormControl fullWidth>
								<Select
									id="periodFilter"
									name="periodFilter"
									placeholder="Period"
									value={filters.period}
									onChange={handleChangeByPeriod}
									sx={{ backgroundColor: 'white' }}
								>
									<MenuItem value="TODAY">Today</MenuItem>
									<MenuItem value="YESTERDAY">Yesterday</MenuItem>
									<MenuItem value="THIS_WEEK">This Week</MenuItem>
									<MenuItem value="LAST_WEEK">Last Week</MenuItem>
									<MenuItem value="THIS_MONTH">This Month</MenuItem>
									<MenuItem value="LAST_MONTH">Last Month</MenuItem>
									<MenuItem value="CUSTOM">Custom</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						{filters.period === 'CUSTOM' && (
							<Grid item xs={6} sx={{ display: 'flex', gap: 1 }}>
								<Grid xs={6}>
									<FormControl fullWidth sx={{ backgroundColor: 'white' }}>
										<DateTimePicker
											label="From"
											name="fromDate"
											value={filters['created_at[min]']}
											onChange={(newValue) =>
												handleChangeFromDateRange(newValue)
											}
											renderInput={(params) => (
												<TextField {...params} helperText={null} />
											)}
											inputFormat="YYYY/MM/DD hh:mm A"
										/>
									</FormControl>
								</Grid>
								<Grid xs={6}>
									<FormControl fullWidth sx={{ backgroundColor: 'white' }}>
										<DateTimePicker
											label="To"
											name="toDate"
											value={filters['created_at[max]']}
											onChange={(newValue) => handleChangeToDateRange(newValue)}
											renderInput={(params) => (
												<TextField {...params} helperText={null} />
											)}
											inputFormat="YYYY/MM/DD hh:mm A"
										/>
									</FormControl>
								</Grid>
							</Grid>
						)}
					</Grid>
					<Grid
						item
						xs={12}
						sx={{
							display: 'flex',
							gap: 2,
							marginBottom: '12px',
							padding: '12px',
							backgroundColor: colors.ligtherGray,
							outline: `1px solid ${colors.gray}`,
							borderRadius: '12px',
						}}
					>
						<Grid
							item
							xs={3}
							sx={{
								display: 'flex',
								alignItems: 'center',
								fontWeight: 'bold !important',
							}}
						>
							Query builder:
						</Grid>
						<Grid
							item
							xs={9}
							sx={{
								display: 'flex',
								flexWrap: 'wrap',
								alignItems: 'center',
							}}
						>
							<QueryBuilder
								tmpColumns={tmpColumns}
								filters={filters}
								setFilters={setFilters}
							/>
						</Grid>
					</Grid>
				</Grid>
			}
			actions={
				<>
					<StandardButton handleClick={resetFilters} value="Reset filters" />
					<StandardButton value="Close" handleClick={handleClose} close />
				</>
			}
		/>
	);
};

FiltersModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	filters: PropTypes.object,
	setFilters: PropTypes.func,
	view: PropTypes.string,
	setFiltersCount: PropTypes.func,
	tmpColumns: PropTypes.array,
};
