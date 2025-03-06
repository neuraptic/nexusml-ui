import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { endOfToday, format } from 'date-fns';

// Manage roles & permissions
import { HasAccess } from '@permify/react-role';

// Components
import { Badge, Container, Grid } from '@mui/material';
import { Box } from '@mui/system';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';
import { ExamplesTable } from './components/ExamplesTable';
import { CustomPagination } from '../../../../Components/Shared/CustomPagination';
import AccessDenied from '../../../../Components/Core/AccessDenied';
import { CommentsModal } from './components/CommentsModal';
import { EditElementModal } from './components/EditElementModal';
import { DeleteExampleModal } from './components/DeleteExampleModal';
import { CreateOrUpdateExampleModal } from './components/CreateOrUpdateExampleModal';
import { EditViewModal } from './components/EditViewModal';
import { FiltersModal } from './components/FiltersModal';

// Styles
import styles from './styles';

// Consts

// Redux
import {
	GET_EXAMPLES,
	GET_EXAMPLE_FILE,
	SET_CURRENT_EXAMPLE,
	SET_EXAMPLE_DOCUMENTS_BUFFER,
	SET_EXAMPLE_IMAGES_BUFFER,
} from '../../../../redux/examples.slice';

// Services
import { getColumns, getRows } from './examples.services';

// Consts
import { defaultRoles } from '../../../../consts/rolesAndPermissions';
import { colors } from '../../../../consts/colors';

export const TaskExamples = () => {
	const dispatch = useDispatch();

	// Global states
	const {
		examples: examplesState,
		imagesBuffer: imagesBufferState,
		documentsBuffer: documentsBufferState,
		totalExamples: totalExamplesState,
		tags: tagsState,
		currentExample: currentExampleState,
	} = useSelector((state) => state.examples);
	const { categories: categoriesState, schema: schemaState } = useSelector(
		(state) => state.schema
	);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { accessToken } = useSelector((state) => state.user);
	const userState = useSelector((state) => state.user);

	// Local states
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const [rowsPerPageOptions] = useState([25, 50, 100]);
	const [currentRowId, setCurrentRowId] = useState('');
	const [selectedRows, setSelectedRows] = useState([]);
	const [currentCellId, setCurrentCellId] = useState('');
	const [currentColumns, setCurrentColumns] = useState([]);
	const [allColumns, setAllColumns] = useState([]);
	const [rows, setRows] = useState([]);

	const [filters, setFilters] = useState({
		only_with_comments: false,
		labeling_status: [],
		query: '',
		order: '',
		order_by: '',
		period: '',
		'created_at[min]': null,
		'created_at[max]': endOfToday(),
	});
	const [openStatusTooltip, setOpenStatusTooltip] = useState(false);
	const [filtersCount, setFiltersCount] = useState(0);

	// Modals
	const [openDeleteExampleModal, setOpenDeleteExampleModal] = useState(false);
	const [openCreateExampleModal, setOpenCreateExampleModal] = useState(false);
	const [openEditExampleModal, setOpenEditExampleModal] = useState(false);
	const [openEditElementModal, setOpenEditElementModal] = useState(true);
	const [openEditViewModal, setOpenEditViewModal] = useState(false);
	const [openCommentsModal, setOpenCommentsModal] = useState(false);
	const [openFiltersModal, setOpenFiltersModal] = useState(false);

	const handleOpenStatusTooltip = () => {
		setOpenStatusTooltip(!openStatusTooltip);
	};

	const getExamplesWithFilters = async () => {
		await dispatch(
			GET_EXAMPLES({
				taskId: currentTaskState.uuid,
				userState,
				dispatch,
				page: page + 1,
				per_page: rowsPerPage,
				labeling_status:
					filters.labeling_status.length > 0
						? filters['labeling_status'].join('|')
						: '',
				only_with_comments: filters.only_with_comments,
				query: filters.query,
				order: filters.order,
				order_by: filters.order_by,
				'created_at[min]': format(
					new Date(filters['created_at[min]']),
					"yyyy-MM-dd'T'HH:mm:ss"
				),
				'created_at[max]': format(
					new Date(filters['created_at[max]']),
					"yyyy-MM-dd'T'HH:mm:ss"
				),
			})
		);
	};

	useEffect(() => {
		if (
			currentTaskState.uuid &&
			(accessToken || process.env.NEXUSML_UI_AUTH_ENABLED === 'false') &&
			!examplesState.isLoading &&
			filters.query.split('=')[1] !== ''
		)
			getExamplesWithFilters();
	}, [filters]);

	const setImagesOnBuffer = async () => {
		const imageElements = [];
		if (schemaState && currentTaskState.id) {
			if (schemaState.inputs && schemaState.inputs.length > 0) {
				schemaState.inputs.forEach((input) => {
					if (input.type === 'image_file') {
						examplesState.forEach((example) => {
							example.inputs.forEach((exampleInput) => {
								if (exampleInput.element === input.name)
									if (exampleInput.value !== '') {
										const checkIfInBuffer = imagesBufferState.some(
											(image) => image.elementId === exampleInput.value
										);
										if (!checkIfInBuffer) imageElements.push(exampleInput);
									}
							});
						});
					}
				});
			}

			if (schemaState.metadata && schemaState.metadata.length > 0) {
				schemaState.metadata.forEach((meta) => {
					if (meta.type === 'image_file') {
						examplesState.forEach((example) => {
							example.metadata.forEach((exampleMetadata) => {
								if (exampleMetadata.element === meta.name)
									if (exampleMetadata.value !== '') {
										const checkIfInBuffer = imagesBufferState.some(
											(image) => image.elementId === exampleMetadata.value
										);
										if (!checkIfInBuffer) imageElements.push(exampleMetadata);
									}
							});
						});
					}
				});
			}

			if (schemaState.outputs && schemaState.outputs.length > 0) {
				schemaState.outputs.forEach((meta) => {
					if (meta.type === 'image_file') {
						examplesState.forEach((example) => {
							example.outputs.forEach((exampleOutput) => {
								if (exampleOutput.element === meta.name)
									if (exampleOutput.value !== '') {
										const checkIfInBuffer = imagesBufferState.some(
											(image) => image.elementId === exampleOutput.value
										);
										if (!checkIfInBuffer) imageElements.push(exampleOutput);
									}
							});
						});
					}
				});
			}
		}

		if (imageElements.length > 0) {
			let resAll = [];

			resAll = [
				...(await Promise.all(
					imageElements.map(async (element) => {
						if (Array.isArray(element.value)) {
							return Promise.all(
								element.value.map(async (fileId) => {
									const resThumbnail = await dispatch(
										GET_EXAMPLE_FILE({
											taskId: currentTaskState.id,
											fileId,
											userState,
											dispatch,
											thumbnail: true,
										})
									);

									return {
										elementId: fileId,
										elementName: element.element,
										thumbnail: resThumbnail.payload.download_url,
									};
								})
							);
						}

						const resThumbnail = await dispatch(
							GET_EXAMPLE_FILE({
								taskId: currentTaskState.id,
								fileId: element.value,
								userState,
								dispatch,
								thumbnail: true,
							})
						);

						return {
							elementId: element.value,
							elementName: element.element,
							thumbnail: resThumbnail.payload.download_url,
						};
					})
				)),
			];

			dispatch(SET_EXAMPLE_IMAGES_BUFFER([...imagesBufferState, ...resAll]));
		} else dispatch(SET_EXAMPLE_IMAGES_BUFFER());
	};

	const setDocumentsOnBuffer = async () => {
		const documentElements = [];
		if (schemaState && currentTaskState.id) {
			if (schemaState.inputs && schemaState.inputs.length > 0) {
				schemaState.inputs.forEach((input) => {
					if (input.type === 'document_file') {
						examplesState.forEach((example) => {
							example.inputs.forEach((exampleInput) => {
								if (exampleInput.element === input.name)
									if (exampleInput.value !== '')
										documentElements.push(exampleInput);
							});
						});
					}
				});
			}

			if (schemaState.metadata && schemaState.metadata.length > 0) {
				schemaState.metadata.forEach((meta) => {
					if (meta.type === 'document_file') {
						examplesState.forEach((example) => {
							example.metadata.forEach((exampleMetadata) => {
								if (exampleMetadata.element === meta.name)
									if (exampleMetadata.value !== '')
										documentElements.push(exampleMetadata);
							});
						});
					}
				});
			}

			if (schemaState.outputs && schemaState.outputs.length > 0) {
				schemaState.outputs.forEach((meta) => {
					if (meta.type === 'document_file') {
						examplesState.forEach((example) => {
							example.outputs.forEach((exampleOutput) => {
								if (exampleOutput.element === meta.name)
									if (exampleOutput.value !== '')
										documentElements.push(exampleOutput);
							});
						});
					}
				});
			}
		}

		if (documentElements.length > 0) {
			let resAll = [];

			resAll = [
				...(await Promise.all(
					documentElements.map(async (element) => {
						const resDocument = await dispatch(
							GET_EXAMPLE_FILE({
								taskId: currentTaskState.id,
								fileId: element.value,
								userState,
								dispatch,
							})
						);

						return {
							elementId: element.value,
							elementName: element.element,
							url: resDocument.payload.download_url,
						};
					})
				).then((result) => result)),
			];
			dispatch(
				SET_EXAMPLE_DOCUMENTS_BUFFER([...documentsBufferState, ...resAll])
			);
		} else dispatch(SET_EXAMPLE_DOCUMENTS_BUFFER());
	};

	useEffect(() => {
		setAllColumns([]);
		setCurrentColumns([]);
		setOpenEditViewModal(false);
		dispatch(SET_CURRENT_EXAMPLE({}));
		if (
			localStorage.getItem(`${currentTaskState.uuid}-exampleColumns`) &&
			localStorage.getItem(`${currentTaskState.uuid}-exampleColumns`).length > 0
		) {
			setCurrentColumns(
				allColumns.filter((col) =>
					localStorage
						.getItem(`${currentTaskState.uuid}-exampleColumns`)
						.includes(col.field)
				)
			);
		}
	}, []);

	useEffect(() => {
		setImagesOnBuffer();
		setDocumentsOnBuffer();
	}, [examplesState]);

	useEffect(() => {
		if (currentCellId !== '') setOpenEditElementModal(true);
		else setOpenEditElementModal(false);
	}, [currentCellId]);

	useEffect(() => {
		if (currentRowId !== '') {
			dispatch(
				SET_CURRENT_EXAMPLE(
					examplesState.find((example) => example.id === currentRowId)
				)
			);
		}
	}, [currentRowId]);

	useEffect(() => {
		if (!openEditElementModal) {
			setCurrentRowId('');
			setCurrentCellId('');
			dispatch(SET_CURRENT_EXAMPLE({}));
		}
	}, [openEditElementModal]);

	useEffect(() => {
		if (
			(accessToken || process.env.NEXUSML_UI_AUTH_ENABLED === 'false') &&
			currentTaskState.uuid
		) {
			getColumns({
				setAllColumns,
				classes: styles(),
				schemaState,
				examplesState,
				categoriesState,
				currentTaskState,
				userState,
				setOpenEditExampleModal,
				setCurrentRowId,
				dispatch,
				imagesBufferState,
				documentsBufferState,
				HasAccess,
				openStatusTooltip,
				handleOpenStatusTooltip,
				setOpenCommentsModal,
				useState,
				useEffect,
				currentExampleState,
				tagsState,
			});
			getRows({
				setRows,
				schemaState,
				examplesState,
				currentTaskState,
				userState,
				dispatch,
				React,
				tagsState,
			});
		}
	}, [
		schemaState,
		examplesState,
		imagesBufferState,
		documentsBufferState,
		tagsState,
	]);

	useEffect(() => {
		setCurrentColumns(allColumns);

		if (
			localStorage.getItem(`${currentTaskState.uuid}-exampleColumns`) &&
			localStorage.getItem(`${currentTaskState.uuid}-exampleColumns`).length > 0
		) {
			setCurrentColumns(
				allColumns.filter((col) => {
					const tmp = localStorage.getItem(
						`${currentTaskState.uuid}-exampleColumns`
					);
					if (tmp.includes(col.field)) return col;
					return false;
				})
			);
		} else {
			setCurrentColumns(allColumns);
		}
	}, [allColumns]);

	const openCreateExampleView = () => {
		setOpenCreateExampleModal(true);
	};

	const openEditExampleView = () => {
		setOpenEditViewModal(true);
	};

	useEffect(() => {
		if (
			(accessToken || process.env.NEXUSML_UI_AUTH_ENABLED === 'false') &&
			currentTaskState.uuid
		) {
			getExamplesWithFilters();
		}
	}, [page, rowsPerPage]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(event.target.value);
	};

	useEffect(() => {
		if (!openCommentsModal) {
			setCurrentRowId('');
			setSelectedRows([]);
			dispatch(SET_CURRENT_EXAMPLE({}));
		}
	}, [openCommentsModal]);

	const handleChangeOrderBy = (e) => {
		const { id } = e.target;
		const tmpValues = id.split(',');
		setFilters({ ...filters, order_by: tmpValues[0], order: tmpValues[1] });
	};

	return (
		<HasAccess
			roles={defaultRoles}
			permissions="task.read"
			renderAuthFailed={<AccessDenied />}
		>
			<Container maxWidth={false} sx={{ padding: '0px !important' }}>
				<Grid
					container
					sx={{
						marginBottom: '12px',
					}}
				>
					<Grid item xs={12} md={9} sx={{ display: 'flex' }}>
						<Grid
							item
							sx={{
								display: 'flex',
								gap: 1,
								justifyContent: { xs: 'flex-start' },
								width: '150px',
								fontSize: '13px',
								fontWeight: 600,
								letterSpacing: '0.14px',
								color: '#1492E6',
							}}
						>
							Icons color legend:
						</Grid>
						<Grid
							item
							sx={{
								display: 'flex',
								gap: 4,
								color: '#545454',
								fontSize: '13px',
								fontWeight: 600,
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<div
									style={{
										float: 'left',
										height: '10px',
										width: '10px',
										clear: 'both',
										backgroundColor: colors.taskInput,
									}}
								/>
								Inputs
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<div
									style={{
										float: 'left',
										height: '10px',
										width: '10px',
										clear: 'both',
										backgroundColor: colors.taskMetaData,
									}}
								/>
								Metadata
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<div
									style={{
										float: 'left',
										height: '10px',
										width: '10px',
										clear: 'both',
										backgroundColor: colors.taskOutput,
									}}
								/>
								Outputs
							</div>
						</Grid>
					</Grid>
					<Grid
						item
						xs={12}
						md={3}
						sx={{
							display: 'flex',
							justifyContent: { xs: 'flex-start', md: 'flex-end' },
						}}
					>
						<div style={styles().examplesFound}>
							<div style={styles().examplesFoundTitle}>Examples:</div>
							<div style={styles().examplesFoundCount}>
								{totalExamplesState} examples found
							</div>
						</div>
					</Grid>
				</Grid>
				<Grid
					container
					spacing={1}
					sx={{
						fontSize: 'small',
						marginBottom: '12px',
					}}
				>
					<Grid
						item
						xs={12}
						md={9}
						sx={{
							display: 'flex',
							gap: 1,
							justifyContent: { xs: 'flex-start' },
						}}
					>
						<HasAccess
							roles={defaultRoles}
							permissions="task.create"
							renderAuthFailed={
								<StandardButton
									type="disabled"
									value="Create example"
									icon={<AddIcon />}
								/>
							}
						>
							<StandardButton
								value="Create example"
								handleClick={openCreateExampleView}
								icon={<AddIcon />}
							/>
						</HasAccess>
						<HasAccess
							roles={defaultRoles}
							permissions="task.update"
							renderAuthFailed={
								<StandardButton
									type="disabled"
									value="Update example"
									icon={<EditIcon />}
								/>
							}
						>
							{currentRowId === '' ? (
								<StandardButton
									type="disabled"
									value="Update example"
									icon={<EditIcon />}
								/>
							) : (
								<StandardButton
									value="Update example"
									handleClick={() => setOpenEditExampleModal(true)}
									icon={<EditIcon />}
								/>
							)}
						</HasAccess>
						<HasAccess
							roles={defaultRoles}
							permissions="task.delete"
							renderAuthFailed={
								<StandardButton
									type="disabled"
									value="Delete example"
									icon={<DeleteIcon />}
								/>
							}
						>
							{selectedRows.length === 0 ? (
								<StandardButton
									type="disabled"
									value="Delete example"
									icon={<DeleteIcon />}
								/>
							) : (
								<StandardButton
									value={
										selectedRows.length <= 1
											? 'Delete example'
											: 'Delete examples'
									}
									handleClick={() => setOpenDeleteExampleModal(true)}
									icon={<DeleteIcon />}
								/>
							)}
						</HasAccess>
					</Grid>
					<Grid
						item
						xs={12}
						md={3}
						sx={{
							display: 'flex',
							gap: 1,
							justifyContent: { xs: 'flex-start', md: 'flex-end' },
						}}
					>
						<StandardButton
							type="icon"
							tooltip="Edit view"
							icon={<PivotTableChartIcon />}
							handleClick={openEditExampleView}
						/>
						<StandardButton
							type="icon"
							variant="dropdown"
							tooltip="Order by"
							value={[
								{
									value: 'created_at,asc',
									display: 'Created at: from oldest to newest',
								},
								{
									value: 'created_at,desc',
									display: 'Created at: from newest to oldest',
								},
								{
									value: 'modified_at,asc',
									display: 'Modified at: from oldest to newest',
								},
								{
									value: 'modified_at,desc',
									display: 'Modified at: from newest to oldest',
								},
								{
									value: 'activity_at,asc',
									display: 'Activity at: from oldest to newest',
								},
								{
									value: 'activity_at,desc',
									display: 'Activity at: from newest to oldest',
								},
							]}
							icon={<SortIcon />}
							handleChange={handleChangeOrderBy}
							handleClick={openEditExampleView}
						/>
						<Badge badgeContent={filtersCount} color="primary">
							<StandardButton
								type="icon"
								tooltip="Filters"
								icon={<TuneIcon />}
								handleClick={() => setOpenFiltersModal(true)}
							/>
						</Badge>
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={12}>
						<Box sx={styles().tableContainer}>
							<ExamplesTable
								rows={rows}
								currentColumns={currentColumns}
								setCurrentCellId={setCurrentCellId}
								setCurrentRowId={setCurrentRowId}
								currentRowId={currentRowId}
								openEditExampleModal={openEditExampleModal}
								selectedRows={selectedRows}
								setSelectedRows={setSelectedRows}
								filters={filters}
								setFilters={setFilters}
							/>
						</Box>
					</Grid>
					<CustomPagination
						page={page}
						rowsPerPage={rowsPerPage}
						rowsPerPageOptions={rowsPerPageOptions}
						handleChangePage={handleChangePage}
						handleChangeRowsPerPage={handleChangeRowsPerPage}
						total={totalExamplesState}
					/>
				</Grid>
			</Container>
			{openCreateExampleModal && (
				<CreateOrUpdateExampleModal
					open={openCreateExampleModal}
					setOpen={setOpenCreateExampleModal}
					type="create"
					step={0}
					allColumns={allColumns}
					schemaState={schemaState}
					setCurrentRowId={setCurrentRowId}
					setSelectedRows={setSelectedRows}
				/>
			)}
			{openEditExampleModal && (
				<CreateOrUpdateExampleModal
					open={openEditExampleModal}
					setOpen={setOpenEditExampleModal}
					type="update"
					step={1}
					allColumns={allColumns}
					currentRowId={currentRowId}
					setOpenDeleteExampleModal={setOpenDeleteExampleModal}
					setCurrentRowId={setCurrentRowId}
					setSelectedRows={setSelectedRows}
				/>
			)}
			{openEditElementModal && (
				<EditElementModal
					open={openEditElementModal}
					setOpen={setOpenEditElementModal}
					currentCellId={currentCellId}
					setCurrentCellId={setCurrentCellId}
					currentRowId={currentRowId}
					setCurrentRowId={setCurrentRowId}
					allColumns={allColumns}
				/>
			)}
			{openCommentsModal && (
				<CommentsModal
					open={openCommentsModal}
					setOpen={setOpenCommentsModal}
					currentRowId={currentRowId}
					currentTaskId={currentTaskState.uuid}
				/>
			)}
			{openDeleteExampleModal && (
				<DeleteExampleModal
					open={openDeleteExampleModal}
					setOpen={setOpenDeleteExampleModal}
					setOpenEditExampleModal={setOpenEditExampleModal}
					currentRowId={currentRowId}
					selectedRows={selectedRows}
					setSelectedRows={setSelectedRows}
					setCurrentRowId={setCurrentRowId}
				/>
			)}
			{openEditViewModal && (
				<EditViewModal
					open={openEditViewModal}
					setOpen={setOpenEditViewModal}
					allColumns={allColumns}
					currentColumns={currentColumns}
					setCurrentColumns={setCurrentColumns}
				/>
			)}
			{openFiltersModal && (
				<FiltersModal
					open={openFiltersModal}
					setOpen={setOpenFiltersModal}
					filters={filters}
					setFilters={setFilters}
					filtersCount={filtersCount}
					view="examples"
					setFiltersCount={setFiltersCount}
					tmpColumns={currentColumns}
				/>
			)}
		</HasAccess>
	);
};
