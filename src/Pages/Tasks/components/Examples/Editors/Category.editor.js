import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import {
	Checkbox,
	ListItemText,
	MenuItem,
	Select,
	Skeleton,
} from '@mui/material';
import { CustomPagination } from '../../../../../Components/Shared/CustomPagination';

// Redux
import { GET_SCHEMA_NODE_CATEGORIES } from '../../../../../redux/schema.slice';

export const CategoryEditor = (props) => {
	const {
		classes,
		currentElement,
		currentCellId,
		currentElementType,
		currentValue = '',
		setCurrentValue,
		name,
		currentCategories,
		disabled = false,
		currentElementMultiValue,
	} = props;

	const dispatch = useDispatch();

	// Global states
	const userState = useSelector((state) => state.user);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { isLoading: isLoadingSchemaState, categories: categoriesState } =
		useSelector((state) => state.schema);

	// Local states
	const [page, setPage] = useState(0);
	const [rowsPerPage] = useState(4);

	useEffect(() => {
		if (currentElement) setCurrentValue(currentElement.value);
	}, [currentElement]);

	const handleChange = (e) => {
		if (!name) setCurrentValue(e.target.value);
		else setCurrentValue(name, e.target.value);
	};

	const handleChangeMultivalue = (e) => {
		console.log(e.target.value);
		console.log(currentValue);
		if (!e.target.value || e.target.value === 'none') setCurrentValue([]);
		const inCurrentValue = currentValue.includes(e.target.value);
		console.log(inCurrentValue);
		if (inCurrentValue) {
			const tmp = currentValue.filter((value) => value !== e.target.value);
			setCurrentValue(tmp);
		} else {
			const tmp = [...e.target.value];
			setCurrentValue(tmp);
		}
	};

	const handleChangePage = async (e, newPage) => {
		setPage(newPage);
		await dispatch(
			GET_SCHEMA_NODE_CATEGORIES({
				userState,
				taskId: currentTaskState.uuid,
				dispatch,
				nodeName: currentCellId,
				nodeType: currentElementType,
				nodeId: categoriesState[currentElementType].find(
					(cat) => cat.name === currentCellId
				).id,
				page: parseInt(newPage + 1),
			})
		);
	};

	if (currentElementMultiValue)
		return (
			currentCategories &&
			currentCategories.categories &&
			currentCategories.categories.length > 0 && (
				<Select
					id="Category"
					className={classes.typeCategory}
					value={currentValue || []}
					multiple
					name={name || currentCategories.name}
					onChange={handleChangeMultivalue}
					fullWidth
					disabled={disabled}
					renderValue={(selected) => selected.join(', ')}
				>
					<MenuItem value={null}>None</MenuItem>
					{!isLoadingSchemaState ? (
						currentCategories.categories.map((category) => (
							<MenuItem value={category.name} key={category.id}>
								<Checkbox
									checked={
										currentValue.includes(category.display_name) ||
										currentValue.includes(category.name)
									}
								/>
								<ListItemText>
									{category.display_name || category.name}{' '}
								</ListItemText>
								{/* <em>{category.display_name || category.name}</em> */}
							</MenuItem>
						))
					) : (
						<div>
							<MenuItem>
								<Skeleton
									animation="wave"
									variant="text"
									style={{ height: '24px', minWidth: '175px' }}
								/>
							</MenuItem>
							<MenuItem>
								<Skeleton
									animation="wave"
									variant="text"
									style={{ height: '24px', minWidth: '175px' }}
								/>
							</MenuItem>
							<MenuItem>
								<Skeleton
									animation="wave"
									variant="text"
									style={{ height: '24px', minWidth: '175px' }}
								/>
							</MenuItem>
							<MenuItem>
								<Skeleton
									animation="wave"
									variant="text"
									style={{ height: '24px', minWidth: '175px' }}
								/>
							</MenuItem>
						</div>
					)}
					<CustomPagination
						total={
							currentCategories.total_count ||
							currentCategories.categories.length
						}
						rowsPerPage={rowsPerPage}
						page={page}
						handleChangePage={handleChangePage}
						rowsPerPageOptions={[4]}
						simple
					/>
				</Select>
			)
		);
	return (
		currentCategories &&
		currentCategories.categories &&
		currentCategories.categories.length > 0 && (
			<Select
				id="Category"
				className={classes.typeCategory}
				value={currentValue}
				name={name || currentCategories.name}
				onChange={handleChange}
				fullWidth
				disabled={disabled}
				sx={{ backgroundColor: 'white' }}
			>
				<MenuItem value={null}>None</MenuItem>
				{!isLoadingSchemaState ? (
					currentCategories.categories.map((category) => (
						<MenuItem value={category.name} key={category.id}>
							<em>{category.display_name || category.name}</em>
						</MenuItem>
					))
				) : (
					<div>
						<MenuItem>
							<Skeleton
								animation="wave"
								variant="text"
								style={{ height: '24px', minWidth: '175px' }}
							/>
						</MenuItem>
						<MenuItem>
							<Skeleton
								animation="wave"
								variant="text"
								style={{ height: '24px', minWidth: '175px' }}
							/>
						</MenuItem>
						<MenuItem>
							<Skeleton
								animation="wave"
								variant="text"
								style={{ height: '24px', minWidth: '175px' }}
							/>
						</MenuItem>
						<MenuItem>
							<Skeleton
								animation="wave"
								variant="text"
								style={{ height: '24px', minWidth: '175px' }}
							/>
						</MenuItem>
					</div>
				)}
				<CustomPagination
					total={
						currentCategories.total_count || currentCategories.categories.length
					}
					rowsPerPage={rowsPerPage}
					page={page}
					handleChangePage={handleChangePage}
					rowsPerPageOptions={[4]}
					simple
				/>
			</Select>
		)
	);
};

CategoryEditor.propTypes = {
	classes: PropTypes.object,
	currentElement: PropTypes.object,
	currentCellId: PropTypes.string,
	currentElementType: PropTypes.string,
	currentValue: PropTypes.any,
	setCurrentValue: PropTypes.func,
	name: PropTypes.string,
	currentCategories: PropTypes.object,
	disabled: PropTypes.bool,
	currentElementMultiValue: PropTypes.bool,
};
