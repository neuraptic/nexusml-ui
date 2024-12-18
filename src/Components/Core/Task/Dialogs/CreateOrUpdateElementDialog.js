import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// Components
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Collapse,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	FormControlLabel,
	IconButton,
	InputLabel,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateOrUpdateCategoryDialog from './CreateOrUpdateCategoryDialog';
import { CustomPagination } from '../../../Shared/CustomPagination';
import StandardButton from '../../../Shared/Buttons/StandardButton';
import { Loader } from '../../../Shared/Loader';

// Services
import requestFactory from '../../../../services/request.factory';

// Redux
import {
	GET_SCHEMA,
	CREATE_SCHEMA_NODE,
	GET_SCHEMA_NODE_CATEGORIES,
	CREATE_SCHEMA_NODE_CATEGORY,
	DELETE_SCHEMA_NODE_CATEGORY,
} from '../../../../redux/schema.slice';

const inputsElementTypes = {
	image_file: 'Image',
	document_file: 'Document',
	audio_file: 'Audio',
	video_file: 'Video',
	text: 'Text',
	integer: 'Integer',
	float: 'Float',
	boolean: 'Boolean',
	category: 'Category',
	datetime: 'Date',
	shape: 'Shape',
	slice: 'Slice',
};

const outputsElementTypes = {
	integer: 'Integer',
	float: 'Float',
	category: 'Category',
	shape: 'Shape',
	slice: 'Slice',
};

function CreateOrUpdateElementDialog(props) {
	const { openDialog, setOpenDialog, mode, elementType, prevElement } = props;

	const dispatch = useDispatch();

	// Global states
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { isLoading: isLoadingSchemaState, categories: categoriesState } =
		useSelector((state) => state.schema);
	const userState = useSelector((state) => state.user);

	// Local states
	const [newElement, setNewElement] = useState({
		display_name: '',
		description: '',
		name: '',
		type: '',
		multi_value: null,
		nullable: false,
		required: false,
		categories: [],
		total_count: 0,
	});
	const [elementCategories, setElementCategories] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [showCategories, setShowCategories] = useState(true);
	const [openCreateCategoryDialog, setOpenCreateCategoryDialog] =
		useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (
			prevElement &&
			prevElement.type === 'category' &&
			categoriesState &&
			categoriesState[elementType] &&
			categoriesState[elementType].find(
				(category) => category.id === prevElement.id
			)
		) {
			setElementCategories(
				categoriesState[elementType].find(
					(category) => category.id === prevElement.id
				).categories
			);
			setNewElement({
				...newElement,
				total_count: categoriesState[elementType].find(
					(category) => category.id === prevElement.id
				).total_count,
			});
		}
	}, [prevElement, categoriesState]);

	const handleChange = (e) => {
		const { name, value, checked } = e.target;
		console.log(name, value);
		if (name === 'nullable' || name === 'required')
			setNewElement({ ...newElement, [name]: checked });
		else setNewElement({ ...newElement, [name]: value });
	};

	useEffect(() => {
		if (mode === 'update' && categoriesState) {
			setNewElement({
				display_name: prevElement.display_name,
				description: prevElement.description,
				name: prevElement.name,
				type: prevElement.type,
				multi_value: prevElement.multi_value,
				nullable: prevElement.nullable,
				required: prevElement.required,
				categories: elementCategories || [],
				total_count:
					categoriesState[elementType]?.find(
						(category) => category.id === prevElement.id
					)?.total_count || 0,
			});
		}
	}, [
		prevElement,
		mode,
		currentTaskState.id,
		elementType,
		page,
		elementCategories,
	]);

	const handleCreateElement = async () => {
		setIsLoading(true);
		const tmpElement = {};
		Object.keys(newElement).forEach((element) => {
			if (
				element !== 'categories' &&
				newElement[element] !== 'none' &&
				element !== 'total_count'
			)
				tmpElement[element] = newElement[element];
		});

		const res = await dispatch(
			CREATE_SCHEMA_NODE({
				node: tmpElement,
				taskId: currentTaskState.uuid,
				nodeType: elementType,
				userState,
				dispatch,
			})
		).catch(() => {
			setIsLoading(false);
		});

		if (res?.payload?.res.uuid && elementCategories.length > 0) {
			await Promise.all(
				elementCategories.map(async (category) => {
					dispatch(
						CREATE_SCHEMA_NODE_CATEGORY({
							taskId: currentTaskState.uuid,
							nodeType: elementType,
							nodeId: res.payload.res.id,
							category,
							userState,
							dispatch,
						})
					);
				})
			);
		} else {
			setIsLoading(false);
		}

		await dispatch(
			GET_SCHEMA({ userState, taskId: currentTaskState.id, dispatch })
		);

		setIsLoading(false);
		setOpenDialog(false);
	};

	const handleUpdateElement = async () => {
		setIsLoading(true);

		let tmpElement = {};
		Object.keys(newElement).forEach((element) => {
			if (
				element !== 'categories' &&
				element !== 'total_count' &&
				newElement[element] !== 'none'
			)
				tmpElement = { ...tmpElement, [element]: newElement[element] };
		});

		console.log(newElement);

		const res = await requestFactory({
			type: 'PUT',
			url: `/tasks/${currentTaskState.uuid}/schema/${elementType}/${prevElement.uuid}`,
			data: tmpElement,
			userState,
			dispatch,
		});
		if (res)
			await dispatch(
				GET_SCHEMA({ userState, taskId: currentTaskState.id, dispatch })
			);
		setIsLoading(false);
		// setOpenDialog(false);
	};

	const handleCreateCategory = async (category) => {
		if (mode === 'create') {
			setElementCategories([...elementCategories, category]);
		}
		if (mode === 'update') {
			await dispatch(
				CREATE_SCHEMA_NODE_CATEGORY({
					taskId: currentTaskState.uuid,
					nodeType: elementType,
					nodeId: prevElement.id,
					category,
					userState,
					dispatch,
				})
			);
		}
		setOpenCreateCategoryDialog(false);
	};

	const handleDeleteCategory = async (category) => {
		setElementCategories(
			elementCategories.filter((c) => c.name !== category.name)
		);
		if (mode === 'update') {
			await dispatch(
				DELETE_SCHEMA_NODE_CATEGORY({
					taskId: currentTaskState.uuid,
					nodeType: elementType,
					nodeId: prevElement.id,
					categoryId: category.id,
					userState,
					dispatch,
				})
			);
		}

		setOpenCreateCategoryDialog(false);
	};

	const handleChangePage = async (e, newPage) => {
		setPage(newPage);
		await dispatch(
			GET_SCHEMA_NODE_CATEGORIES({
				userState,
				taskId: currentTaskState.uuid,
				dispatch,
				nodeType: elementType,
				nodeId: prevElement.id,
				page: parseInt(newPage + 1),
			})
		);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<>
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				scroll="body"
			>
				<DialogTitle>
					{elementType.charAt(0).toUpperCase() + elementType.slice(1)}:
					{mode === 'create' ? ' Create new element' : ' Modify element'}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{mode === 'create' ? (
							<>
								You're trying to add a new element to the {elementType} of the
								task. Please fill in the following fields (all fields showing as
								red are required), and click on the "Create" button.
							</>
						) : (
							<>
								You're trying to modify an element of the task. Please fill in
								the following fields (all fields showing as red are required),
								and click on the "update" button.
							</>
						)}
					</DialogContentText>
					<TextField
						id="name"
						label="Name"
						name="name"
						value={newElement.name}
						fullWidth
						required
						sx={{
							mt: 2,
						}}
						onChange={handleChange}
					/>
					<TextField
						id="display_name"
						label="Display name"
						name="display_name"
						value={newElement.display_name}
						sx={{
							mt: 2,
						}}
						onChange={handleChange}
						fullWidth
					/>
					<TextField
						id="description"
						label="Description"
						name="description"
						value={newElement.description}
						sx={{
							mt: 2,
						}}
						onChange={handleChange}
						fullWidth
					/>
					<FormControl
						fullWidth
						sx={{
							mt: 2,
						}}
					>
						<InputLabel id="elementDataTypeLabel">Data Type *</InputLabel>
						<Select
							id="type"
							labelId="elementDataTypeLabel"
							name="type"
							label="Data Type"
							disabled={mode === 'update'}
							value={newElement.type}
							onChange={handleChange}
						>
							{elementType === 'inputs' &&
								Object.entries(inputsElementTypes).map(
									([elementTypeName, elementTypeDisplayName]) => (
										<MenuItem key={elementTypeName} value={elementTypeName}>
											{elementTypeDisplayName}
										</MenuItem>
									)
								)}
							{elementType === 'outputs' &&
								Object.entries(outputsElementTypes).map(
									([elementTypeName, elementTypeDisplayName]) => (
										<MenuItem key={elementTypeName} value={elementTypeName}>
											{elementTypeDisplayName}
										</MenuItem>
									)
								)}
							{elementType === 'metadata' &&
								Object.entries(inputsElementTypes).map(
									([elementTypeName, elementTypeDisplayName]) => (
										<MenuItem key={elementTypeName} value={elementTypeName}>
											{elementTypeDisplayName}
										</MenuItem>
									)
								)}
						</Select>
					</FormControl>
					{newElement.type === 'category' && (
						<>
							<Button
								variant="contained"
								color="primary"
								size="small"
								onClick={() => {
									setOpenCreateCategoryDialog(true);
								}}
								fullWidth
								sx={{
									marginTop: '12px',
								}}
							>
								Create new category
							</Button>
							<List
								component="nav"
								subheader={
									<Box
										onClick={() => setShowCategories(!showCategories)}
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											width: '100%',
										}}
									>
										{showCategories ? <ExpandLess /> : <ExpandMore />}
										<Typography
											variant="body1"
											component="div"
											sx={{
												width: '100%',
												fontWeight: 'bold',
												color: 'text.primary',
											}}
										>
											Categories list
										</Typography>
									</Box>
								}
								sx={{
									mt: 2,
								}}
							>
								<Collapse in={showCategories} timeout="auto" unmountOnExit>
									<List component="div" disablePadding>
										{!isLoadingSchemaState &&
											elementCategories &&
											elementCategories.map((category, index) => (
												<ListItem key={index}>
													<ListItemAvatar>
														<Avatar
															sx={{
																backgroundColor:
																	category.color && category.color.includes('#')
																		? category.color
																		: `#${category.color}`,
															}}
														>
															{category.display_name?.charAt(0) ||
																category.name.charAt(0)}
														</Avatar>
													</ListItemAvatar>
													<ListItemText
														primary={category.display_name || category.name}
													/>
													<ListItemSecondaryAction>
														<IconButton
															edge="end"
															aria-label="delete"
															color="primary"
															onClick={() => handleDeleteCategory(category)}
														>
															<DeleteIcon />
														</IconButton>
													</ListItemSecondaryAction>
												</ListItem>
											))}
										{isLoadingSchemaState && <Loader size="L" />}
									</List>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'center',
											alignItems: 'center',
											mt: '10px',
											mr: '10px',
										}}
									>
										<CustomPagination
											total={
												newElement.total_count !== 0
													? newElement.total_count
													: elementCategories.length
											}
											rowsPerPage={rowsPerPage}
											page={page}
											handleChangePage={handleChangePage}
											handleChangeRowsPerPage={handleChangeRowsPerPage}
											rowsPerPageOptions={[5]}
											simple
										/>
									</Box>
								</Collapse>
							</List>
						</>
					)}
					<FormControl
						fullWidth
						sx={{
							mt: 2,
						}}
					>
						<InputLabel id="multiValueLabel">Multi value</InputLabel>
						<Select
							id="multiValue"
							name="multi_value"
							labelId="multiValueLabel"
							label="Multi value"
							value={newElement.multi_value}
							onChange={handleChange}
						>
							<MenuItem value="none">
								<em>None</em>
							</MenuItem>
							<MenuItem value="unordered">Unordered</MenuItem>
							<MenuItem value="ordered">Ordered</MenuItem>
							<MenuItem value="time_based">Time Series</MenuItem>
						</Select>
					</FormControl>
					<FormControlLabel
						control={<Checkbox />}
						label="Nullable"
						name="nullable"
						checked={newElement.nullable}
						onChange={handleChange}
						sx={{
							mt: 2,
							width: '100%',
						}}
					/>
					<FormControlLabel
						control={<Checkbox />}
						label="Required"
						name="required"
						checked={newElement.required}
						onChange={handleChange}
						sx={{
							mt: 2,
							width: '100%',
						}}
					/>
				</DialogContent>
				<DialogActions>
					<StandardButton
						handleClick={() => setOpenDialog(false)}
						value="Cancel"
						close
					/>
					<StandardButton
						handleClick={
							mode === 'create' ? handleCreateElement : handleUpdateElement
						}
						value={mode === 'create' ? 'Create' : 'Update'}
						loading={isLoading}
					/>
				</DialogActions>
			</Dialog>
			<CreateOrUpdateCategoryDialog
				openCreateOrUpdateCategoryDialog={openCreateCategoryDialog}
				handleCloseCreateOrUpdateCategoryDialog={setOpenCreateCategoryDialog}
				handleCreateCategoryElement={handleCreateCategory}
				mode={mode}
				elementCategories={elementCategories}
				setElementCategories={setElementCategories}
			/>
		</>
	);
}

CreateOrUpdateElementDialog.propTypes = {
	openDialog: PropTypes.bool,
	setOpenDialog: PropTypes.func,
	mode: PropTypes.string,
	elementType: PropTypes.string,
	prevElement: PropTypes.object,
};

export default CreateOrUpdateElementDialog;
