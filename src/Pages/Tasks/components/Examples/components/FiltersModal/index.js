import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { endOfToday } from 'date-fns';

// Components
import {
	Checkbox,
	FormControl,
	Grid,
	ListItemText,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
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

const labelingTypes = {
	labeled: 'Labeled',
	unlabeled: 'Unlabeled',
	pending_review: 'Pending Review',
	rejected: 'Rejected',
};

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

	useEffect(() => {
		let count = 0;

		if (filters.only_with_comments && filters.only_with_comments !== false)
			count += 1;
		if (filters.labeling_status?.length > 0) count += 1;
		if (filters.query !== '') count += 1;
		if (filters.order !== '' || filters.order_by !== '') count += 1;
		if (filters.period !== '') count += 1;

		setFiltersCount(count);
	}, [filters]);

	const handleChangeFilters = (e) => {
		const { id, name, value, checked } = e.target;
		if (value === 'on') {
			if (id === 'only_with_comments')
				setFilters({ ...filters, [name]: checked });
			if (id === 'labeling_status') {
				setFilters({
					...filters,
					labeling_status: filters.labeling_status.includes(name)
						? filters.labeling_status.filter((status) => status !== name)
						: [...filters.labeling_status, name],
				});
			}
		}
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

	const handleChangeLabelingStatus = (e) => {
		const statuses = e.target.value;
		setFilters({ ...filters, labeling_status: statuses });
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
					{Object.keys(filters).includes('only_with_comments') && (
						<Grid
							item
							xs={12}
							sx={{
								display: 'flex',
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
								By comments:
							</Grid>
							<Grid item xs={9} sx={{ display: 'flex', alignItems: 'center' }}>
								<FormControl>
									<Checkbox
										id="only_with_comments"
										color="primary"
										name="only_with_comments"
										checked={filters.only_with_comments}
										onChange={handleChangeFilters}
									/>
								</FormControl>
								Only examples with comments
							</Grid>
						</Grid>
					)}
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
							By labeling status:
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
							<FormControl fullWidth sx={{ backgroundColor: 'white' }}>
								<Select
									id="labeling_status"
									multiple
									value={filters.labeling_status}
									onChange={handleChangeLabelingStatus}
									renderValue={(selected) =>
										selected.map((value) => labelingTypes[value]).join(', ')
									}
								>
									<MenuItem value="labeled">
										<Checkbox
											checked={filters.labeling_status.includes('labeled')}
										/>
										<ListItemText primary="Labeled" />
									</MenuItem>
									<MenuItem value="unlabeled">
										<Checkbox
											checked={filters.labeling_status.includes('unlabeled')}
										/>
										<ListItemText primary="Unlabeled" />
									</MenuItem>
									<MenuItem value="pending_review">
										<Checkbox
											checked={filters.labeling_status.includes(
												'pending_review'
											)}
										/>
										<ListItemText primary="Pending review" />
									</MenuItem>
									<MenuItem value="rejected">
										<Checkbox
											checked={filters.labeling_status.includes('rejected')}
										/>
										<ListItemText primary="Rejected" />
									</MenuItem>
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
