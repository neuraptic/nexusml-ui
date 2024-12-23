import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, endOfToday } from 'date-fns';

// Manage roles & permissions
import { HasAccess } from '@permify/react-role';

// Components
import { Badge, Container, Grid } from '@mui/material';
import { Box } from '@mui/system';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import { Cached } from '@mui/icons-material';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';
import { CustomPagination } from '../../../../Components/Shared/CustomPagination';
import AccessDenied from '../../../../Components/Core/AccessDenied';
import { AIPredictionsTable } from './components/AIPredictionsTable';

// Modals
import { CreateOrUpdateAIPredictionModal } from './components/CreateOrUpdatePredictionModal';
import { EditViewModal } from './components/EditViewModal';
import { FiltersModal } from './components/FiltersModal';

// Styles
import styles from './styles';

// Redux
import {
	CREATE_EXAMPLE,
	GET_EXAMPLE_FILE,
	GET_EXAMPLES,
	SET_EXAMPLE_DOCUMENTS_BUFFER,
	SET_EXAMPLE_IMAGES_BUFFER,
} from '../../../../redux/examples.slice';
import {
	GET_PREDICTIONS,
	SET_CURRENT_PREDICTION,
} from '../../../../redux/predictions.slice';

// Services
import { getColumns, getRows } from './aipredictions.services';

// Consts
import { defaultRoles } from '../../../../consts/rolesAndPermissions';
import { colors } from '../../../../consts/colors';

export const TaskAIPredictions = () => {
	const dispatch = useDispatch();

	// Global states
	const {
		predictions: predictionsState,
		totalPredictions: totalPredictionsState,
	} = useSelector((state) => state.predictions);
	const userState = useSelector((state) => state.user);
	const {
		imagesBuffer: imagesBufferState,
		documentsBuffer: documentsBufferState,
	} = useSelector((state) => state.examples);
	const aimodels = useSelector((state) => state.aimodels);
	const { schema: schemaState, categories: categoriesState } = useSelector(
		(state) => state.schema
	);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
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
	const [openCreateExampleModal, setOpenCreateExampleModal] = useState(false);
	const [openEditElementModal, setOpenEditElementModal] = useState(false);
	const [openEditViewModal, setOpenEditViewModal] = useState(false);
	const [openMetricsModal, setOpenMetricsModal] = useState(false);
	const [openFiltersModal, setOpenFiltersModal] = useState(false);

	const handleOpenStatusTooltip = () => {
		setOpenStatusTooltip(!openStatusTooltip);
	};

	const getPredictionsWithFilters = async () => {
		await dispatch(
			GET_PREDICTIONS({
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
				environment: 'production',
			})
		);
	};

	useEffect(() => {
		if (
			currentTaskState.uuid &&
			(accessToken || process.env.NEXUSML_UI_AUTH_ENABLED === 'false') &&
			!predictionsState.isLoading &&
			filters.query.split('=')[1] !== ''
		)
			getPredictionsWithFilters();
	}, [filters]);

	useEffect(() => {
		if (
			(accessToken || process.env.NEXUSML_UI_AUTH_ENABLED === 'false') &&
			currentTaskState.uuid
		) {
			getPredictionsWithFilters();
		}
	}, [page, rowsPerPage]);

	const setImagesOnBuffer = async () => {
		const imageElements = [];
		if (schemaState && currentTaskState.id) {
			if (schemaState.inputs && schemaState.inputs.length > 0) {
				schemaState.inputs.forEach((input) => {
					if (input.type === 'image_file') {
						predictionsState.forEach((prediction) => {
							prediction.inputs?.forEach((predictionInput) => {
								if (predictionInput.element === input.name)
									if (predictionInput.value !== '') {
										const checkIfInBuffer = imagesBufferState.find(
											(image) => image.elementId === predictionInput.value
										);
										if (!checkIfInBuffer) imageElements.push(predictionInput);
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
							thumbnail: resThumbnail.payload?.download_url,
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
						predictionsState.forEach((example) => {
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
		dispatch(SET_CURRENT_PREDICTION({}));
		if (
			localStorage.getItem(`${currentTaskState.uuid}-predictionColumns`) &&
			localStorage.getItem(`${currentTaskState.uuid}-predictionColumns`)
				.length > 0
		) {
			setCurrentColumns(
				allColumns.filter((col) =>
					localStorage
						.getItem(`${currentTaskState.uuid}-predictionColumns`)
						.includes(col.field)
				)
			);
		}
	}, []);

	useEffect(() => {
		setImagesOnBuffer();
		setDocumentsOnBuffer();
	}, [predictionsState, currentTaskState, schemaState]);

	useEffect(() => {
		if (currentCellId !== '') setOpenEditElementModal(true);
		else setOpenEditElementModal(false);
	}, [currentCellId]);

	useEffect(() => {
		if (currentRowId !== '') {
			dispatch(
				SET_CURRENT_PREDICTION(
					predictionsState.find(
						(prediction) => prediction.uuid === currentRowId
					)
				)
			);
		} else {
			setCurrentRowId('');
			dispatch(SET_CURRENT_PREDICTION({}));
		}
	}, [currentRowId]);

	useEffect(() => {
		if (!openEditElementModal) {
			setCurrentRowId('');
			setCurrentCellId('');
			dispatch(SET_CURRENT_PREDICTION({}));
		}
	}, [openEditElementModal]);

	useEffect(() => {
		if (
			!imagesBufferState.imagesBufferIsLoading &&
			(accessToken || process.env.NEXUSML_UI_AUTH_ENABLED === 'false') &&
			currentTaskState.uuid
		) {
			getColumns({
				setAllColumns,
				classes: styles(),
				schemaState,
				predictionsState,
				categoriesState,
				currentTaskState,
				userState,
				setCurrentRowId,
				dispatch,
				imagesBufferState,
				documentsBufferState,
				HasAccess,
				openStatusTooltip,
				handleOpenStatusTooltip,
				setOpenMetricsModal,
			});
			getRows({
				setRows,
				schemaState,
				predictionsState,
				aimodels,
			});
		}
	}, [
		aimodels,
		schemaState,
		predictionsState,
		imagesBufferState,
		documentsBufferState,
	]);

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

	const openEditPredictionView = () => {
		setOpenEditViewModal(true);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(event.target.value);
	};

	useEffect(() => {
		if (!openMetricsModal) {
			setCurrentRowId('');
			setSelectedRows([]);
			dispatch(SET_CURRENT_PREDICTION({}));
		}
	}, [openMetricsModal]);

	const handleChangeOrderBy = (e) => {
		const { id } = e.target;
		const tmpValues = id.split(',');
		setFilters({ ...filters, order_by: tmpValues[0], order: tmpValues[1] });
	};

	const handleAddPredictionAsExample = () => {
		const selectedPredictions = predictionsState.filter((prediction) =>
			selectedRows.includes(prediction.uuid)
		);

		const extractValues = (prediction) => {
			const values = [];
			if (prediction.inputs.length > 0) {
				prediction.inputs.forEach((input) => {
					values.push({ element: input.element, value: input.value });
				});
			}
			if (prediction.outputs.length > 0) {
				prediction.outputs.forEach((output) => {
					values.push({ element: output.element, value: output.value });
				});
			}
			if (prediction.metadata.length > 0) {
				prediction.metadata.forEach((meta) => {
					values.push({ element: meta.element, value: meta.value });
				});
			}

			return {
				labeling_status: 'unlabeled',
				values,
			};
		};

		const tmpPredictions = selectedPredictions.map((prediction) => {
			const res = extractValues(prediction);

			// CREATE EXAMPLE MANUALLY
			const tmpExample = res.values
				.filter((val) => {
					if (val.value === '' || val.value === null || val.value === undefined)
						return false;
					return val;
				})
				.map((val) => ({ element: val.element, value: val.value }));

			return {
				labeling_status: 'unlabeled',
				values: tmpExample,
			};
		});

		dispatch(
			CREATE_EXAMPLE({
				taskId: currentTaskState.id,
				newExample: {
					batch: tmpPredictions,
				},
				userState,
				dispatch,
			})
		);

		dispatch(
			GET_EXAMPLES({
				taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
				userState,
				dispatch,
			})
		);
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
							<div style={styles().examplesFoundTitle}>Predictions:</div>
							<div style={styles().examplesFoundCount}>
								{totalPredictionsState} predictions found
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
									value="Create prediction"
									icon={<AddIcon />}
								/>
							}
						>
							<StandardButton
								value="Create prediction"
								type={!aimodels.productionAIModel?.uuid && 'disabled'}
								handleClick={openCreateExampleView}
								icon={<AddIcon />}
							/>
						</HasAccess>
						<HasAccess
							roles={defaultRoles}
							permissions="task.create"
							renderAuthFailed={
								<StandardButton
									type="disabled"
									value={
										(selectedRows.length <= 1 && 'Add prediction as example') ||
										(selectedRows.length > 1 && 'Add predictions as examples')
									}
									icon={<AddIcon />}
								/>
							}
						>
							<StandardButton
								value={
									(selectedRows.length <= 1 && 'Add prediction as example') ||
									(selectedRows.length > 1 && 'Add predictions as examples')
								}
								type={selectedRows.length <= 0 && 'disabled'}
								handleClick={handleAddPredictionAsExample}
								icon={<AddIcon />}
							/>
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
									tooltip="Fetch predictions"
									variant="disabled"
									icon={<Cached />}
								/>
							}
						>
							<StandardButton
								type="icon"
								tooltip="Fetch predictions"
								icon={<Cached />}
								handleClick={() => getPredictionsWithFilters()}
							/>
						</HasAccess>
						<StandardButton
							type="icon"
							tooltip="Edit view"
							icon={<PivotTableChartIcon />}
							handleClick={openEditPredictionView}
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
							handleClick={openEditPredictionView}
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
							<AIPredictionsTable
								currentColumns={currentColumns}
								rows={rows}
								setCurrentCellId={setCurrentCellId}
								setCurrentRowId={setCurrentRowId}
								currentRowId={currentRowId}
								setSelectedRows={setSelectedRows}
								filters={filters}
								setFilters={setFilters}
								selectedRows={selectedRows}
							/>
						</Box>
					</Grid>
					<CustomPagination
						page={page}
						rowsPerPage={rowsPerPage}
						rowsPerPageOptions={rowsPerPageOptions}
						handleChangePage={handleChangePage}
						handleChangeRowsPerPage={handleChangeRowsPerPage}
						total={totalPredictionsState}
					/>
				</Grid>
			</Container>
			{openCreateExampleModal && (
				<CreateOrUpdateAIPredictionModal
					open={openCreateExampleModal}
					setOpen={setOpenCreateExampleModal}
					type="create"
					allColumns={allColumns}
					schemaState={schemaState}
					setCurrentRowId={setCurrentRowId}
					setSelectedRows={setSelectedRows}
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
