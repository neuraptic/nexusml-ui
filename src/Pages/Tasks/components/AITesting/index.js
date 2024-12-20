import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { endOfToday, format } from 'date-fns';

// Manage roles & permissions
import { HasAccess } from '@permify/react-role';

// Components
import { Container, Grid, Badge } from '@mui/material';
import { Box } from '@mui/system';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import { Cached } from '@mui/icons-material';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';
import { CustomPagination } from '../../../../Components/Shared/CustomPagination';
import AccessDenied from '../../../../Components/Core/AccessDenied';
import { EditElementModal } from './components/EditElementModal';
import { CreateOrUpdateAITestingModal } from './components/CreateOrUpdateAITestingModal';
import { EditViewModal } from './components/EditViewModal';
import { AITestingTable } from './components/AITestingTable';
import { DeleteTestModal } from './components/DeleteTestModal';
import { FiltersModal } from './components/FiltersModal';

// Styles
import styles from './styles';

// Redux
import {
	GET_EXAMPLE_FILE,
	SET_EXAMPLE_DOCUMENTS_BUFFER,
	SET_EXAMPLE_IMAGES_BUFFER,
} from '../../../../redux/examples.slice';
import { GET_TESTS, SET_CURRENT_TEST } from '../../../../redux/testing.slice';

// Services
import { getColumns, getRows } from './aitesting.services';

// Consts
import { defaultRoles } from '../../../../consts/rolesAndPermissions';
import { colors } from '../../../../consts/colors';

export const TaskAITesting = () => {
	const dispatch = useDispatch();

	// Global states
	const { tests: testsState, totalTests: totalTestsState } = useSelector(
		(state) => state.tests
	);
	const {
		imagesBuffer: imagesBufferState,
		documentsBuffer: documentsBufferState,
	} = useSelector((state) => state.examples);
	const aimodels = useSelector((state) => state.aimodels);
	const { schema: schemaState, categories: categoriesState } = useSelector(
		(state) => state.schema
	);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const userState = useSelector((state) => state.user);
	const { accessToken } = useSelector((state) => state.user);

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
	const [filtersCount, setFiltersCount] = useState(0);

	const [filters, setFilters] = useState({
		query: '',
		order: '',
		order_by: '',
		ai_model: '',
		period: '',
		'created_at[min]': null,
		'created_at[max]': endOfToday(),
	});
	const [openStatusTooltip, setOpenStatusTooltip] = useState(false);

	// Modals
	const [openDeleteExampleModal, setOpenDeleteExampleModal] = useState(false);
	const [openCreateExampleModal, setOpenCreateExampleModal] = useState(false);
	const [openEditExampleModal, setOpenEditExampleModal] = useState(false);
	const [openEditElementModal, setOpenEditElementModal] = useState(false);
	const [openEditViewModal, setOpenEditViewModal] = useState(false);
	const [openFiltersModal, setOpenFiltersModal] = useState(false);

	const handleOpenStatusTooltip = () => {
		setOpenStatusTooltip(!openStatusTooltip);
	};

	const getTestsWithFilters = async () => {
		await dispatch(
			GET_TESTS({
				taskId: currentTaskState.uuid,
				userState,
				dispatch,
				page: page + 1,
				per_page: rowsPerPage,
				order: filters.order,
				order_by: filters.order_by,
				ai_model: filters.ai_model,
				query: filters.query,
				'created_at[min]': format(
					new Date(filters['created_at[min]']),
					"yyyy-MM-dd'T'HH:mm:ss"
				),
				'created_at[max]': format(
					new Date(filters['created_at[max]']),
					"yyyy-MM-dd'T'HH:mm:ss"
				),
				environment: 'testing',
			})
		);
	};

	useEffect(() => {
		if (
			currentTaskState.uuid &&
			accessToken &&
			!testsState.isLoading &&
			filters.query.split('=')[1] !== ''
		)
			getTestsWithFilters();
	}, [filters]);

	useEffect(() => {
		if (accessToken && currentTaskState.uuid) {
			getTestsWithFilters();
		}
	}, [page, rowsPerPage]);

	const setImagesOnBuffer = async () => {
		const imageElements = [];
		if (schemaState && currentTaskState.id) {
			if (schemaState.inputs && schemaState.inputs.length > 0) {
				schemaState.inputs.forEach((input) => {
					if (input.type === 'image_file') {
						testsState.forEach((example) => {
							example.inputs.forEach((exampleInput) => {
								if (exampleInput.element === input.name)
									if (exampleInput.value !== '') {
										const checkIfInBuffer = imagesBufferState.find(
											(image) => image.elementId === exampleInput.value
										);
										if (!checkIfInBuffer) imageElements.push(exampleInput);
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
				).then((result) => result)),
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
						testsState.forEach((example) => {
							example.inputs.forEach((exampleInput) => {
								if (exampleInput.element === input.name)
									if (exampleInput.value !== '')
										documentElements.push(exampleInput);
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
		dispatch(SET_CURRENT_TEST({}));
		if (
			localStorage.getItem(`${currentTaskState.uuid}-testingColumns`) &&
			localStorage.getItem(`${currentTaskState.uuid}-testingColumns`).length > 0
		) {
			setCurrentColumns(
				allColumns.filter((col) =>
					localStorage
						.getItem(`${currentTaskState.uuid}-testingColumns`)
						.includes(col.field)
				)
			);
		}
	}, []);

	useEffect(() => {
		setImagesOnBuffer();
		setDocumentsOnBuffer();
	}, [testsState, currentTaskState, schemaState]);

	useEffect(() => {
		if (currentCellId !== '') setOpenEditElementModal(true);
		else setOpenEditElementModal(false);
	}, [currentCellId]);

	useEffect(() => {
		if (currentRowId !== '') {
			dispatch(
				SET_CURRENT_TEST(testsState.find((test) => test.uuid === currentRowId))
			);
		}
	}, [currentRowId]);

	useEffect(() => {
		if (!openEditElementModal) {
			setCurrentRowId('');
			setCurrentCellId('');
			dispatch(SET_CURRENT_TEST({}));
		}
	}, [openEditElementModal]);

	useEffect(() => {
		if (
			!imagesBufferState.imagesBufferIsLoading &&
			accessToken &&
			currentTaskState.uuid
		) {
			getColumns({
				setAllColumns,
				classes: styles(),
				schemaState,
				testsState,
				categoriesState,
				userState,
				currentTaskState,
				setOpenEditExampleModal,
				setCurrentRowId,
				dispatch,
				imagesBufferState,
				documentsBufferState,
				HasAccess,
				openStatusTooltip,
				handleOpenStatusTooltip,
			});
			getRows({
				setRows,
				schemaState,
				testsState,
				aimodels: aimodels.aimodels,
			});
		}
	}, [schemaState, testsState, imagesBufferState, documentsBufferState]);

	useEffect(() => {
		setCurrentColumns(allColumns);

		if (
			localStorage.getItem(`${currentTaskState.uuid}-testingColumns`) &&
			localStorage.getItem(`${currentTaskState.uuid}-testingColumns`).length > 0
		) {
			setCurrentColumns(
				allColumns.filter((col) => {
					const tmp = localStorage.getItem(
						`${currentTaskState.uuid}-testingColumns`
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

	const openEditTestView = () => {
		setOpenEditViewModal(true);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(event.target.value);
	};

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
							xs={2}
							sx={{
								display: 'flex',
								gap: 1,
								justifyContent: { xs: 'flex-start' },
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
							xs={10}
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
										backgroundColor: colors.taskTarget,
									}}
								/>
								AI outputs
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
							<div style={styles().examplesFoundTitle}>Tests:</div>
							<div style={styles().examplesFoundCount}>
								{totalTestsState} tests found
							</div>
						</div>
					</Grid>
				</Grid>
				<Grid
					container
					spacing={1}
					sx={{
						fontSize: 'small',
						marginBottom: '24px',
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
									value="Create test"
									icon={<AddIcon />}
								/>
							}
						>
							<StandardButton
								value="Create test"
								type={!aimodels.testingAIModel?.uuid && 'disabled'}
								handleClick={openCreateExampleView}
								icon={<AddIcon />}
							/>
						</HasAccess>
						<HasAccess
							roles={defaultRoles}
							permissions="task.delete"
							renderAuthFailed={
								<StandardButton
									type="disabled"
									value="Delete test"
									icon={<DeleteIcon />}
								/>
							}
						>
							{selectedRows.length === 0 ? (
								<StandardButton
									type="disabled"
									value="Delete test"
									icon={<DeleteIcon />}
								/>
							) : (
								<StandardButton
									value={
										selectedRows.length <= 1 ? 'Delete test' : 'Delete tests'
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
						<HasAccess
							roles={defaultRoles}
							permissions="task.delete"
							renderAuthFailed={
								<StandardButton
									type="icon"
									tooltip="Fetch tests"
									variant="disabled"
									icon={<Cached />}
								/>
							}
						>
							<StandardButton
								type="icon"
								tooltip="Fetch tests"
								icon={<Cached />}
								handleClick={() => getTestsWithFilters()}
							/>
						</HasAccess>
						<StandardButton
							type="icon"
							tooltip="Edit view"
							icon={<PivotTableChartIcon />}
							handleClick={openEditTestView}
						/>
						<StandardButton
							type="icon"
							tooltip="Order by"
							variant="dropdown"
							value={[
								{
									value: 'created_at,asc',
									display: 'Created at: from oldest to newest',
								},
								{
									value: 'created_at,desc',
									display: 'Created at: from newest to oldest',
								},
							]}
							icon={<SortIcon />}
							handleChange={handleChangeOrderBy}
							handleClick={openEditTestView}
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
							<AITestingTable
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
						total={totalTestsState}
					/>
				</Grid>
			</Container>
			{openCreateExampleModal && (
				<CreateOrUpdateAITestingModal
					open={openCreateExampleModal}
					setOpen={setOpenCreateExampleModal}
					type="create"
					allColumns={allColumns}
					schemaState={schemaState}
					setCurrentRowId={setCurrentRowId}
					setSelectedRows={setSelectedRows}
				/>
			)}
			{openEditExampleModal && (
				<CreateOrUpdateAITestingModal
					open={openEditExampleModal}
					setOpen={setOpenEditExampleModal}
					type="update"
					step={1}
					schemaState={schemaState}
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
			{openDeleteExampleModal && (
				<DeleteTestModal
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
					view="testing"
					setFiltersCount={setFiltersCount}
					tmpColumns={currentColumns}
				/>
			)}
		</HasAccess>
	);
};
