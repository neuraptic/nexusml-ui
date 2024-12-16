/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
import { v4 as uuidv4 } from 'uuid';

// Components
import {
	Box,
	Checkbox,
	Divider,
	Grid,
	Menu,
	ThemeProvider,
	Tooltip,
	Typography,
	createTheme,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCheck,
	faBan,
	faTag,
	faFilePen,
	faMessage,
	faPenToSquare,
	faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { CirclePicker } from 'react-color';
import { CustomTooltip } from '../../../../Components/Shared/CustomTooltip';
import { SearchInput } from '../../../../Components/Shared/Inputs/SearchInput';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';
import { TextInput } from '../../../../Components/Shared/Inputs/TextInput';
import { ConfirmationDialog } from '../../../../Components/Shared/ConfirmationDialog';

// Services
import { elementTypeToIconMap } from '../../../../services/tasks';
import { createCell } from './cellCreation.services';
import requestFactory from '../../../../services/request.factory';
import { getTextColorBasedOnBackgroundColor } from '../../../../services/getTextColorBasedOnBackgroundColor';

// Consts
import { colors } from '../../../../consts/colors';
import { dataTypeToColorMap } from '../../../../consts/dataTypeToColorMap';

// Alerts
import { ADD_ALERT } from '../../../../redux/alerts.slice';

// Redux
import {
	CREATE_TAG,
	DELETE_TAG,
	GET_EXAMPLES,
	UPDATE_EXAMPLE,
	UPDATE_TAG,
} from '../../../../redux/examples.slice';

// Styles
import styles from './styles';

// Tooltip theme
const tooltipTheme = createTheme({
	components: {
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					color: 'black',
					backgroundColor: 'white',
					border: '1px solid gray',
				},
			},
		},
	},
});

export const getCategoryValues = async ({
	id,
	nodeType,
	setIsLocalLoading = null,
	allColumns,
}) => {
	if (!allColumns.length) return;
	const categories = [];
	if (setIsLocalLoading !== null) setIsLocalLoading(true);
	const nodeTypeForRequest =
		nodeType === 'metadata' ? nodeType : `${nodeType}s`;
	const res = await requestFactory(
		'get',
		`/schema/${nodeTypeForRequest}/${id}/categories`
	);
	categories.push({ field: id, categories: res });
	if (setIsLocalLoading !== null) setIsLocalLoading(false);

	return {
		id,
		res,
		categories,
	};
};

export const getColumns = ({
	setAllColumns,
	classes,
	schemaState,
	examplesState,
	categoriesState,
	currentTaskState,
	setCurrentRowId,
	dispatch,
	imagesBufferState,
	documentsBufferState,
	documentSelectedNumPages,
	onDocumentLoadSuccess,
	from,
	setOpenCommentsModal,
	useState,
	useEffect,
	currentExampleState,
	tagsState,
	userState,
}) => {
	const tmpCols = [];

	if (Object.keys(schemaState) && Object.keys(schemaState).length > 0) {
		if (from !== 'predictions') {
			// STATUS
			tmpCols.push({
				fieldType: 'status',
				field: 'status',
				name: 'Status',
				sortable: true,
				disableColumnMenu: true,
				headerClassName: 'border-right',
				cellClassName: 'gray-column-border-right',
				width: 150,

				renderHeader: () => (
					<Box key={uuidv4()} className={classes.headerCell}>
						Status
					</Box>
				),
				renderCell: (params) => {
					const handleClick = async (status) => {
						const currentRowId = params.row.id;
						let tmpUpdate = { values: [] };
						const tmpExample = examplesState.find(
							(example) => example.id === currentRowId
						);
						const inputs = tmpExample.inputs
							?.filter((val) => {
								if (val.value === '') return false;
								return val;
							})
							?.map((val) => ({ element: val.element, value: val.value }));
						const metadata = tmpExample.metadata
							?.filter((val) => {
								if (val.value === '') return false;
								return val;
							})
							?.map((val) => ({ element: val.element, value: val.value }));
						const outputs = tmpExample.outputs
							?.filter((val) => {
								if (val.value === '') return false;
								return val;
							})
							?.map((val) => ({ element: val.element, value: val.value }));

						if (tmpExample) {
							tmpUpdate = { ...tmpUpdate, labeling_status: status };
							if (inputs) tmpUpdate.values.push(...inputs);
							if (metadata) tmpUpdate.values.push(...metadata);
							if (outputs) tmpUpdate.values.push(...outputs);
						}

						await dispatch(
							UPDATE_EXAMPLE({
								taskId: currentTaskState.uuid,
								exampleId: currentRowId,
								examplesToUpdate: tmpUpdate,
								dispatch,
								userState,
							})
						);
						tmpUpdate = {};
						await dispatch(
							GET_EXAMPLES({
								taskId: currentTaskState.uuid,
								userState,
								dispatch,
							})
						);
					};

					if (examplesState && examplesState.length > 0) {
						return (
							<Box
								className={classes.rowCell}
								sx={{
									maxWidth: '130px',
									display: 'flex',
								}}
							>
								<ThemeProvider theme={tooltipTheme}>
									<Tooltip
										title={
											<div
												style={{
													display: 'flex',
													gap: '6px',
												}}
											>
												<Typography style={{ cursor: 'pointer' }}>
													<CustomTooltip title="Labeled">
														<FontAwesomeIcon
															icon={faCheck}
															style={{
																fontSize: '18px',
																color:
																	params.row.status === 'labeled' &&
																	colors.green,
															}}
															onClick={() => handleClick('labeled')}
														/>
													</CustomTooltip>
												</Typography>
												<Typography style={{ cursor: 'pointer' }}>
													<CustomTooltip title="Unlabeled">
														<FontAwesomeIcon
															icon={faTag}
															style={{
																fontSize: '18px',
																color:
																	params.row.status === 'unlabeled' &&
																	colors.red,
															}}
															onClick={() => handleClick('unlabeled')}
														/>
													</CustomTooltip>
												</Typography>
												<Typography style={{ cursor: 'pointer' }}>
													<CustomTooltip title="Pending review">
														<FontAwesomeIcon
															icon={faFilePen}
															style={{
																fontSize: '18px',
																color:
																	params.row.status === 'pending_review' &&
																	colors.red,
															}}
															onClick={() => handleClick('pending_review')}
														/>
													</CustomTooltip>
												</Typography>
												<Typography style={{ cursor: 'pointer' }}>
													<CustomTooltip title="Rejected">
														<FontAwesomeIcon
															icon={faBan}
															style={{
																fontSize: '18px',
																color:
																	params.row.status === 'rejected' &&
																	colors.red,
															}}
															onClick={() => handleClick('rejected')}
														/>
													</CustomTooltip>
												</Typography>
											</div>
										}
									>
										<div>
											{params.row.status === 'labeled' && (
												<div
													style={{
														display: 'flex',
														gap: 4,
														alignItems: 'center',
														cursor: 'pointer',
													}}
												>
													<FontAwesomeIcon
														icon={faCheck}
														style={{
															fontSize: '18px',
															color:
																params.row.status === 'labeled' && colors.green,
														}}
													/>
													Labeled
												</div>
											)}
											{params.row.status === 'unlabeled' && (
												<div
													style={{
														display: 'flex',
														gap: 4,
														alignItems: 'center',
														cursor: 'pointer',
													}}
												>
													<FontAwesomeIcon
														icon={faTag}
														style={{
															fontSize: '18px',
															color:
																params.row.status === 'unlabeled' && colors.red,
														}}
													/>
													Unlabeled
												</div>
											)}
											{params.row.status === 'pending_review' && (
												<div
													style={{
														display: 'flex',
														gap: 4,
														alignItems: 'center',
														cursor: 'pointer',
													}}
												>
													<FontAwesomeIcon
														icon={faFilePen}
														style={{
															fontSize: '18px',
															color:
																params.row.status === 'pending_review' &&
																colors.red,
														}}
													/>
													Pending review
												</div>
											)}
											{params.row.status === 'rejected' && (
												<div
													style={{
														display: 'flex',
														gap: 4,
														alignItems: 'center',
														cursor: 'pointer',
													}}
												>
													<FontAwesomeIcon
														icon={faBan}
														style={{
															fontSize: '18px',
															color:
																params.row.status === 'rejected' && colors.red,
														}}
													/>
													Rejected
												</div>
											)}
										</div>
									</Tooltip>
								</ThemeProvider>
							</Box>
						);
					}
				},
				valueGetter: (params) => {
					if (examplesState && examplesState.length > 0)
						return params.row.status;
				},
			});
		}

		// COMMENTS
		tmpCols.push({
			fieldType: 'comments',
			field: 'comments',
			sortable: false,
			disableColumnMenu: true,
			headerClassName: 'message-column',
			cellClassName: 'message-column',
			maxWidth: 50,
			renderCell: (params) =>
				examplesState &&
				examplesState.length > 0 && (
					<FontAwesomeIcon
						icon={faMessage}
						style={{ color: colors.blue, width: '50px', cursor: 'pointer' }}
						onClick={() => {
							setCurrentRowId(params.row.id);
							setOpenCommentsModal(true);
						}}
					/>
				),
			renderHeader: () => <div />,
		});

		// TAGS
		tmpCols.push({
			fieldType: 'tags',
			field: 'tags',
			sortable: false,
			disableColumnMenu: true,
			headerClassName: 'tags-column',
			cellClassName: 'tags-column',
			maxWidth: 100,
			renderCell: (params) => {
				const [filteredTags, setFilteredTags] = useState([]);

				const [anchorEl, setAnchorEl] = useState(null);
				const [open, setOpen] = useState(null);
				const [openCreateTagMenu, setOpenCreateTagMenu] = useState(null);

				const [tag, setTag] = useState({
					name: '',
					description: '',
					color: '#000000',
				});
				const [searchByTag, setSearchByTag] = useState('');

				const [currentTag, setCurrentTag] = useState(null);
				const [openConfirmDeleteTag, setOpenConfirmDeleteTag] = useState(null);

				useEffect(() => {
					setSearchByTag('');
					setFilteredTags(tagsState);
				}, []);

				useEffect(() => {
					setFilteredTags(tagsState);
				}, [tagsState]);

				useEffect(() => {
					if (currentTag) {
						setTag({
							name: currentTag.name,
							description: currentTag.description,
							color: currentTag.color,
						});
					}
				}, [currentTag]);

				useEffect(() => {
					if (open !== null) setOpen(!openCreateTagMenu);
				}, [openCreateTagMenu]);

				const handleClick = (event) => {
					setAnchorEl(event.currentTarget);
					setOpen(true);
				};

				const highlightMatches = (item) => {
					const lowerCaseItem = item.toLowerCase();
					const result = [];

					const searchText = searchByTag;

					let currentIndex = 0;

					for (let i = 0; i < searchText.length; i += 1) {
						const char = searchText[i];
						const index = lowerCaseItem.indexOf(
							char.toLowerCase(),
							currentIndex
						);

						if (index !== -1) {
							result.push(
								<span key={i}>{item.substring(currentIndex, index)}</span>
							);
							result.push(
								<span key={`${i}-highlight`} style={styles().highlight}>
									{item.substring(index, index + char.length)}
								</span>
							);
							currentIndex = index + char.length;
						}
					}

					result.push(
						<span key="remaining">{item.substring(currentIndex)}</span>
					);
					return result;
				};

				const handleUpdateExample = async (tagName) => {
					const values = [];

					if (currentExampleState.inputs?.length > 0) {
						currentExampleState.inputs.forEach((input) => {
							values.push({ element: input.element, value: input.value });
						});
					}
					if (currentExampleState.outputs?.length > 0) {
						currentExampleState.outputs.forEach((output) => {
							values.push({ element: output.element, value: output.value });
						});
					}
					if (currentExampleState.metadata?.length > 0) {
						currentExampleState.metadata.forEach((meta) => {
							values.push({ element: meta.element, value: meta.value });
						});
					}

					await dispatch(
						UPDATE_EXAMPLE({
							taskId: currentTaskState.uuid,
							userState,
							dispatch,
							exampleId: params.row.id,
							examplesToUpdate: {
								values,
								tags: params.row.currentExample.tags?.includes(tagName)
									? params.row.currentExample.tags?.filter(
											(tag) => tag !== tagName
									  )
									: [...(params.row.currentExample.tags || []), tagName],
							},
						})
					);
				};

				const handleCreateTag = async () => {
					if (tag.name === '') return;

					await dispatch(
						CREATE_TAG({
							taskId: currentTaskState.uuid,
							userState,
							dispatch,
							newTag: tag,
						})
					);

					handleUpdateExample();
				};

				const handleReturnMainMenu = () => {
					setOpenCreateTagMenu(false);
					setCurrentTag(null);
				};

				const handleOpenCreateTagMenu = () => {
					setTag({
						name: '',
						description: '',
						color: '#000000',
					});
					setOpenCreateTagMenu(true);
					setOpen(false);
				};

				const handleClose = () => {
					setOpen(false);
					setCurrentTag(null);
					setTag({
						name: '',
						description: '',
						color: '#000000',
					});
				};

				const handleCloseCreateTagMenu = () => {
					setOpenCreateTagMenu(false);
				};

				const handleEditTag = async () => {
					await dispatch(
						UPDATE_TAG({
							userState,
							taskId: currentTaskState.uuid,
							tagId: currentTag.uuid,
							data: tag,
							dispatch,
						})
					);
					handleCloseCreateTagMenu();
				};

				const handleDeleteTag = async () => {
					await dispatch(
						DELETE_TAG({
							userState,
							taskId: currentTaskState.uuid,
							tagId: currentTag.uuid,
							dispatch,
						})
					);
					handleCloseCreateTagMenu();
				};

				const handleOpenConfirmDeleteTag = () =>
					setOpenConfirmDeleteTag(!openConfirmDeleteTag);

				return (
					<>
						<Grid
							container
							sx={{
								width: '100%',
								height:
									!params.row.examplesState.find(
										(example) => example.id === params.row.id
									).tags ||
									params.row.examplesState.find(
										(example) => example.id === params.row.id
									).tags?.length === 0
										? '100%'
										: 'auto',
								display: 'flex',
								alignItems: 'start',
								justifyContent: 'start',
								margin: 0,
								padding: 0,
								gap: '6px',
							}}
							onClick={(e) => {
								setCurrentRowId(params.row.id);
								handleClick(e);
							}}
						>
							{params.row.examplesState.find(
								(example) => example.id === params.row.id
							).tags?.length > 0
								? params.row.examplesState
										.find((example) => example.id === params.row.id)
										.tags.map((tag) => {
											const tmp = params.row.tagsState.find(
												(tagState) => tagState.name === tag
											);
											if (tmp)
												return (
													<div
														style={{
															width: '10px',
															height: '10px',
															backgroundColor: tmp.color,
															borderRadius: '50%',
														}}
													/>
												);
											return null;
										})
								: ' '}
						</Grid>
						<>
							{/* <FontAwesomeIcon
								icon={faTags}
								style={{ color: colors.blue, width: '50px', cursor: 'pointer' }}
								onClick={(e) => {
									setCurrentRowId(params.row.id);
									handleClick(e);
								}}
							/> */}
							{
								// Tags main menu
							}
							<Menu
								anchorEl={anchorEl}
								id="main-tag-menu"
								open={open}
								onClose={handleClose}
								slotProps={{
									paper: {
										elevation: 0,
										sx: {
											width: '300px',
											overflow: 'visible',
											filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
											mt: 1.5,
											'& .MuiAvatar-root': {
												width: 150,
												height: 32,
												ml: -0.5,
												mr: 1,
											},
											'&::before': {
												content: '""',
												display: 'block',
												position: 'absolute',
												top: 0,
												left: 14,
												width: 10,
												height: 10,
												bgcolor: 'background.paper',
												transform: 'translateY(-50%) rotate(45deg)',
												zIndex: 0,
											},
										},
									},
								}}
								transformOrigin={{ horizontal: 'left', vertical: 'top' }}
								anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
							>
								<Grid container sx={{ padding: '3px 6px' }}>
									<SearchInput
										handleChange={(e) => {
											const { value } = e.target;
											let filteredItems = [];
											filteredItems = params.row.tagsState.filter((item) =>
												item.display_name
													? item.display_name
															.toLowerCase()
															.includes(value.toLowerCase())
													: item.name
															.toLowerCase()
															.includes(value.toLowerCase())
											);

											setSearchByTag(value);
											setFilteredTags(filteredItems);
										}}
									/>
								</Grid>
								<Grid
									container
									sx={{
										fontSize: 'small',
										padding: '3px 0px',
										paddingLeft: '6px',
									}}
								>
									Tags:
								</Grid>
								{filteredTags?.length > 0 &&
									filteredTags.map((tag) => (
										<Grid
											container
											key={tag.uuid}
											sx={{ width: '100%', padding: '3px' }}
										>
											<Grid item xs={1}>
												<Checkbox
													sx={{ margin: 0, padding: '6px' }}
													checked={
														params.row.currentExample.tags?.includes(
															tag.name
														) || false
													}
													onChange={() => handleUpdateExample(tag.name)}
												/>
											</Grid>
											<Grid item xs={10} sx={{ paddingLeft: '6px' }}>
												<Typography
													variant="inherit"
													noWrap
													sx={{
														maxWidth: '95%',
														backgroundColor: tag.color,
														color: getTextColorBasedOnBackgroundColor(
															tag.color
														),
														padding: '6px',
														borderRadius: '6px',
													}}
												>
													{highlightMatches(tag.name)}
												</Typography>
											</Grid>
											<Grid item xs={1}>
												<FontAwesomeIcon
													icon={faPenToSquare}
													style={{
														cursor: 'pointer',
													}}
													onClick={() => {
														handleOpenCreateTagMenu();
														setCurrentTag(tag);
													}}
												/>
											</Grid>
										</Grid>
									))}
								<Grid
									container
									sx={{ justifyContent: 'center', padding: '3px 0px' }}
								>
									<StandardButton
										value="Create new tag"
										handleClick={handleOpenCreateTagMenu}
									/>
								</Grid>
							</Menu>

							{
								// Create tag menu
							}
							<Menu
								anchorEl={anchorEl}
								id="create-tag-menu"
								open={openCreateTagMenu}
								onClose={handleCloseCreateTagMenu}
								slotProps={{
									paper: {
										elevation: 0,
										sx: {
											width: '300px',
											overflow: 'visible',
											filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
											mt: 1.5,
											'& .MuiAvatar-root': {
												width: 150,
												height: 32,
												ml: -0.5,
												mr: 1,
											},
											'&::before': {
												content: '""',
												display: 'block',
												position: 'absolute',
												top: 0,
												left: 14,
												width: 10,
												height: 10,
												bgcolor: 'background.paper',
												transform: 'translateY(-50%) rotate(45deg)',
												zIndex: 0,
											},
										},
									},
								}}
								transformOrigin={{ horizontal: 'left', vertical: 'top' }}
								anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
							>
								<Grid container>
									<Grid
										item
										xs={2}
										sx={{
											display: 'flex',
											justifyContent: 'center',
											padding: '6px 0px',
										}}
									>
										<FontAwesomeIcon
											icon={faArrowLeft}
											style={{
												cursor: 'pointer',
											}}
											onClick={() => {
												handleReturnMainMenu();
											}}
										/>
									</Grid>
									<Grid
										item
										xs={10}
										sx={{ display: 'flex', justifyContent: 'center' }}
									>
										{currentTag ? 'Update tag' : 'Create tag'}
									</Grid>
								</Grid>
								<Divider />
								<Grid container sx={{ padding: '12px' }}>
									<Grid container>
										<Grid item xs={4}>
											Name:
										</Grid>
										<Grid item xs={8}>
											<TextInput
												value={tag.name}
												placeholder="Tag name"
												onChange={(e) => {
													setTag({ ...tag, name: e.target.value });
												}}
											/>
										</Grid>
									</Grid>
									<Grid container>
										<Grid item xs={4}>
											Description:
										</Grid>
										<Grid item xs={8}>
											<TextInput
												value={tag.description}
												placeholder="Tag description"
												onChange={(e) =>
													setTag({
														...tag,
														description: e.target.value,
													})
												}
											/>
										</Grid>
									</Grid>
									<Grid container>
										<Grid item xs={12}>
											Color:
										</Grid>
										<Grid
											item
											xs={12}
											sx={{ display: 'flex', justifyContent: 'center' }}
										>
											<CirclePicker
												color={tag.color}
												onChange={(color) => {
													setTag({ ...tag, color: color.hex });
												}}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid container>
									<Grid
										item
										xs={12}
										gap={1}
										sx={{
											display: 'flex',
											justifyContent: 'center',
										}}
									>
										<StandardButton
											value={currentTag ? 'Save changes' : 'Create'}
											handleClick={() =>
												currentTag ? handleEditTag() : handleCreateTag()
											}
										/>
										{currentTag && (
											<StandardButton
												value="Delete tag"
												type="danger"
												handleClick={handleOpenConfirmDeleteTag}
											/>
										)}
									</Grid>
								</Grid>
							</Menu>
							{openConfirmDeleteTag && (
								<ConfirmationDialog
									open={openConfirmDeleteTag}
									setOpen={setOpenConfirmDeleteTag}
									title="Confirm delete tag"
									onConfirm={handleDeleteTag}
								/>
							)}
						</>
					</>
				);
			},
			renderHeader: () => (
				<Box key={uuidv4()} className={classes.headerCell}>
					Tags
				</Box>
			),
		});

		// ITERATE EACH EXAMPLE
		Object.keys(schemaState).forEach((type) => {
			// ITERATE INPUTS
			if (
				type === 'inputs' &&
				schemaState[type] &&
				schemaState[type].length > 0
			) {
				schemaState[type].forEach((input) => {
					if (input.type !== 'shape' && input.type !== 'slice')
						tmpCols.push({
							id: input.id,
							fieldType: 'input',
							valueType: input.type,
							multiValue: input.multi_value,
							field: input.name,
							name: input.display_name || input.name,
							sortable: true,
							disableColumnMenu: true,
							width: 150,
							renderHeader: () => (
								<>
									<CustomTooltip title={input.display_name || input.name}>
										<Box
											sx={{
												display: 'flex !important',
												alignItems: 'center',
												minWidth: '80px',
												width: '100%',
												position: 'relative',
												marginRight: '24px',
											}}
										>
											{input.type && elementTypeToIconMap[input.type]('input')}
											<div>{input.display_name || input.name}</div>
										</Box>
									</CustomTooltip>
									{input.multi_value && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											style={styles().cross}
										>
											<line
												x1="0"
												y1="0"
												x2="12"
												y2="12"
												strokeWidth="2"
												style={{ color: dataTypeToColorMap['input'] }}
											/>
											<line
												x1="0"
												y1="9"
												x2="9"
												y2="0"
												strokeWidth="2"
												style={{ color: dataTypeToColorMap['input'] }}
											/>
										</svg>
									)}
								</>
							),
							renderCell: (params) => {
								if (params.row[input.id] !== undefined) {
									return (
										<div
											style={{
												width: '100%',
												height: '100%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<Grid
												container
												spacing={1}
												sx={{
													padding: '12px',
													display: 'flex',
													justifyContent: 'left',
													alignItems: 'center',
													'& > *': {
														maxWidth: '120px',
													},
												}}
											>
												{createCell[input.type]({
													classes,
													cellValue:
														params.row[input.id] || params.row[input.element],
													cellName: input.name,
													imagesBufferState,
													documentsBufferState,
													documentSelectedNumPages,
													onDocumentLoadSuccess,
													categoriesState,
													valueType: 'inputs',
													params,
													multiValue: input.multi_value,
												})}
											</Grid>
										</div>
									);
								}
							},
							valueGetter: (params) => {
								if (examplesState && examplesState.length > 0)
									return params.row[input.id];
							},
						});
				});
			}

			// ITERATE OUTPUTS
			if (
				type === 'outputs' &&
				schemaState[type] &&
				schemaState[type].length > 0
			) {
				schemaState[type].forEach((output) => {
					if (output.type !== 'shape' && output.type !== 'slice')
						tmpCols.push({
							id: output.id,
							fieldType: 'output',
							valueType: output.type,
							multiValue: output.multi_value,
							field: output.name,
							name: output.display_name || output.name,
							sortable: true,
							disableColumnMenu: true,
							width: 125,
							renderCell: (params) => {
								if (params.row[output.id] !== undefined) {
									return (
										<div
											style={{
												width: '100%',
												height: '100%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											{createCell[output.type]({
												classes,
												cellValue:
													params.row[output.id] || params.row[output.element],
												cellName: output.name,
												imagesBufferState,
												documentsBufferState,
												documentSelectedNumPages,
												onDocumentLoadSuccess,
												categoriesState,
												valueType: 'outputs',
												params,
												multiValue: output.multi_value,
											})}
										</div>
									);
								}
							},
							renderHeader: () => (
								<>
									<CustomTooltip title={output.display_name || output.name}>
										<Box
											sx={{
												display: 'flex !important',
												alignItems: 'center',
												minWidth: '80px',
												'&>*': {
													display: 'block !important',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
												},
											}}
										>
											{output.type &&
												elementTypeToIconMap[output.type]('output')}
											{output.display_name || output.name}
										</Box>
									</CustomTooltip>
									{output.multi_value && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											style={styles().cross}
										>
											<line
												x1="0"
												y1="0"
												x2="12"
												y2="12"
												strokeWidth="2"
												style={{ color: dataTypeToColorMap['input'] }}
											/>
											<line
												x1="0"
												y1="9"
												x2="9"
												y2="0"
												strokeWidth="2"
												style={{ color: dataTypeToColorMap['input'] }}
											/>
										</svg>
									)}
								</>
							),
							valueGetter: (params) => {
								if (examplesState && examplesState.length > 0)
									return params.row[output.id];
							},
						});
				});
			}

			// ITERATE METADATA
			if (
				type === 'metadata' &&
				schemaState[type] &&
				schemaState[type].length > 0
			) {
				schemaState[type].forEach((meta) => {
					if (meta.type !== 'shape' && meta.type !== 'slice')
						tmpCols.push({
							id: meta.id,
							fieldType: 'metadata',
							valueType: meta.type,
							multiValue: meta.multi_value,
							field: meta.name,
							name: meta.display_name || meta.name,
							sortable: true,
							disableColumnMenu: true,
							width: 125,
							renderCell: (params) =>
								createCell[meta.type]({
									classes,
									cellValue: params.row[meta.id],
									cellName: meta.name,
									imagesBufferState,
									documentsBufferState,
									onDocumentLoadSuccess,
									categoriesState,
									valueType: 'metadata',
									params,
									multiValue: meta.multi_value,
								}),
							renderHeader: () => (
								<>
									<CustomTooltip title={meta.display_name || meta.name}>
										<Box
											sx={{
												display: 'flex !important',
												alignItems: 'center',
												minWidth: '80px',
												'&>*': {
													display: 'block !important',
													textOverflow: 'ellipsis',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
												},
											}}
										>
											{meta.type && elementTypeToIconMap[meta.type]('metadata')}
											{meta.display_name || meta.name}
										</Box>
									</CustomTooltip>
									{meta.multi_value && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											style={styles().cross}
										>
											<line
												x1="0"
												y1="0"
												x2="12"
												y2="12"
												strokeWidth="2"
												style={{ color: dataTypeToColorMap['input'] }}
											/>
											<line
												x1="0"
												y1="9"
												x2="9"
												y2="0"
												strokeWidth="2"
												style={{ color: dataTypeToColorMap['input'] }}
											/>
										</svg>
									)}
								</>
							),
							valueGetter: (params) => {
								if (examplesState && examplesState.length > 0)
									return params.row[meta.id];
							},
						});
				});
			}
		});
	}

	setAllColumns(tmpCols);
};

export const getRows = ({
	setRows,
	schemaState,
	examplesState,
	predictionsState,
	from,
	React,
	tagsState,
}) => {
	const tmpRows = [];
	let tmpRowData = {};

	if (
		from !== 'predictions' &&
		examplesState &&
		examplesState.length > 0 &&
		Object.keys(schemaState) &&
		Object.keys(schemaState).length > 0
	) {
		examplesState.forEach((example) => {
			tmpRowData = {
				...tmpRowData,
				id: example.element || example.id,
				status: example.labeling_status,
				react: React,
				tagsState,
				currentExample: example,
				examplesState,
			};

			// INPUTS
			if (example && example.inputs && example.inputs.length > 0) {
				example.inputs.forEach((input) => {
					let tmp = [];
					if (
						schemaState &&
						schemaState.inputs &&
						schemaState.inputs.length > 0
					)
						tmp = schemaState.inputs.find(
							(element) => element.name === input.element
						);
					if (tmp && Object.keys(tmp).length > 0)
						tmpRowData = {
							...tmpRowData,
							[tmp.id]:
								typeof input.value === 'boolean' ||
								typeof input.value === 'number'
									? `${input.value}`
									: input.value || '',
						};
				});
			}

			// OUTPUTS
			if (example && example.outputs && example.outputs.length > 0) {
				example.outputs.forEach((output) => {
					let tmp = [];
					if (
						schemaState &&
						schemaState.outputs &&
						schemaState.outputs.length > 0
					)
						tmp = schemaState.outputs.find(
							(element) => element.name === output.element
						);
					if (tmp && Object.keys(tmp).length > 0)
						tmpRowData = { ...tmpRowData, [tmp.id]: output.value || '' };
				});
			}

			// METADATA
			if (example && example.metadata && example.metadata.length > 0) {
				example.metadata.forEach((meta) => {
					let tmp = [];
					if (
						schemaState &&
						schemaState.metadata &&
						schemaState.metadata.length > 0
					)
						tmp = schemaState.metadata.find(
							(element) => element.name === meta.element
						);
					if (tmp && Object.keys(tmp).length > 0)
						tmpRowData = { ...tmpRowData, [tmp.id]: meta.value || '' };
				});
			}

			if (Object.keys(tmpRowData) && Object.keys(tmpRowData).length > 0)
				tmpRows.push(tmpRowData);

			tmpRowData = {};
		});
	}
	if (
		from === 'predictions' &&
		predictionsState &&
		predictionsState.length > 0 &&
		Object.keys(schemaState) &&
		Object.keys(schemaState).length > 0
	) {
		predictionsState.forEach((prediction) => {
			tmpRowData = {
				...tmpRowData,
				id: prediction.id,
			};

			// INPUTS
			if (prediction && prediction.inputs && prediction.inputs.length > 0) {
				prediction.inputs.forEach((input) => {
					let tmp = [];
					if (
						schemaState &&
						schemaState.inputs &&
						schemaState.inputs.length > 0
					)
						tmp = schemaState.inputs.find(
							(element) => element.name === input.element
						);
					if (tmp && Object.keys(tmp).length > 0)
						tmpRowData = {
							...tmpRowData,
							[tmp.id]:
								typeof input.value === 'boolean' ||
								typeof input.value === 'number'
									? `${input.value}`
									: input.value || '',
						};
				});
			}

			// OUTPUTS
			if (prediction && prediction.outputs && prediction.outputs.length > 0) {
				prediction.outputs.forEach((output) => {
					let tmp = [];
					if (
						schemaState &&
						schemaState.outputs &&
						schemaState.outputs.length > 0
					)
						tmp = schemaState.outputs.find(
							(element) => element.name === output.element
						);
					if (tmp && Object.keys(tmp).length > 0)
						tmpRowData = { ...tmpRowData, [tmp.id]: output.value || '' };
				});
			}

			// METADATA
			if (prediction && prediction.metadata && prediction.metadata.length > 0) {
				prediction.metadata.forEach((meta) => {
					let tmp = [];
					if (
						schemaState &&
						schemaState.metadata &&
						schemaState.metadata.length > 0
					)
						tmp = schemaState.metadata.find(
							(element) => element.name === meta.element
						);
					if (tmp && Object.keys(tmp).length > 0)
						tmpRowData = { ...tmpRowData, [tmp.id]: meta.value || '' };
				});
			}

			if (Object.keys(tmpRowData) && Object.keys(tmpRowData).length > 0)
				tmpRows.push(tmpRowData);

			tmpRowData = {};
		});
	}

	setRows(tmpRows);
};

export const createValidatedExampleObjects = (
	parsedData,
	schemaState,
	dispatch
) => {
	let tmp = {};
	let result = [];

	const createData = (element) => {
		tmp = {
			labeling_status: element.status,
			values: Object.keys(element)
				.filter((el) => el !== 'status')
				.map((el) => ({
					element: el,
					value: element[el],
				})),
		};

		const tmpValidationErrors = [];

		if (Object.keys(tmpValidationErrors).length > 0) {
			dispatch(ADD_ALERT({ type: 'error', message: tmpValidationErrors }));
			return null;
		}

		return tmp;
	};

	if (parsedData && parsedData.length > 0) {
		parsedData.forEach((element) => {
			const tmpData = createData(element);
			result.push(tmpData);
		});
	} else {
		result = createData(parsedData);
	}

	return result;
};

// todo: check if neccesary or need to be updated
export const parseValue = (output, element) => {
	const result = output.value;

	if (output.type === 'number') {
		return parseInt(output.value);
	}

	if (element.type === 'Boolean') {
		if (output.checked) return true;
		return false;
	}

	return result;
};
