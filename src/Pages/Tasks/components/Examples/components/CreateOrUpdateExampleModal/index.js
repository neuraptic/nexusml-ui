import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { CirclePicker } from 'react-color';

// Components
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
	Checkbox,
	Divider,
	FormControlLabel,
	Grid,
	Input,
	Menu,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
	faFileCsv,
	faKeyboard,
	faCloudArrowUp,
	faCheck,
	faBan,
	faTag,
	faFilePen,
	faPenToSquare,
	faArrowLeft,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line, LineChart } from 'recharts';
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';
import { Loader } from '../../../../../../Components/Shared/Loader';
import PageRow from '../../../../../../Components/Shared/PageRow';
import Section from '../../../../../../Components/Shared/Section';
import { CustomPagination } from '../../../../../../Components/Shared/CustomPagination';
import { SearchInput } from '../../../../../../Components/Shared/Inputs/SearchInput';
import { TextInput } from '../../../../../../Components/Shared/Inputs/TextInput';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Services
import { elementTypeToIconMap } from '../../../../../../services/tasks';
import {
	createCSVTemplate,
	getFilesFromParsedCSV,
	parseCSVFile,
	parseCSVTimeSeriesFile,
} from '../../csv.services';
import { createValidatedExampleObjects } from '../../examples.services';
import { getLocalDateTime } from '../../../../../../services/date';
import requestFactory from '../../../../../../services/request.factory';

// Redux
import {
	CREATE_EXAMPLE,
	CREATE_TAG,
	DELETE_TAG,
	GET_EXAMPLE_FILE,
	GET_EXAMPLES,
	UPDATE_EXAMPLE,
	UPDATE_TAG,
} from '../../../../../../redux/examples.slice';
import { GET_SCHEMA_NODE_CATEGORIES } from '../../../../../../redux/schema.slice';
import { CREATE_TASK_FILE } from '../../../../../../redux/tasks.slice';

// Alerts
import {
	IMAGE_FILE_UPLOAD_ERROR,
	IMAGE_FILE_UPLOAD_SUCCESS,
} from '../../../../../../AlertsList/examplesAlerts';
import { ADD_ALERT, REMOVE_ALERT } from '../../../../../../redux/alerts.slice';

// Consts
import { colors } from '../../../../../../consts/colors';
import { getTextColorBasedOnBackgroundColor } from '../../../../../../services/getTextColorBasedOnBackgroundColor';
import { ConfirmationDialog } from '../../../../../../Components/Shared/ConfirmationDialog';

export const CreateOrUpdateExampleModal = (props) => {
	const {
		open,
		setOpen,
		allColumns,
		type,
		step = 0,
		currentRowId,
		setCurrentRowId,
		setSelectedRows,
		setOpenDeleteExampleModal,
	} = props;

	const dispatch = useDispatch();

	const hiddenFileInput = useRef(null);

	// Global states
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { currentExample: currentExampleState, tags: tagsState } = useSelector(
		(state) => state.examples
	);
	// const examplesState = useSelector((state) => state.examples);
	const { categories: categoriesState, schema: schemaState } = useSelector(
		(state) => state.schema
	);
	const { location: userLocationState } = useSelector((state) => state.user);
	const userState = useSelector((state) => state.user);

	// Local states
	const [creationStep, setCreationStep] = useState(step);
	const [fileToUpload, setFileToUpload] = useState(null);
	const [isLoadingFile, setIsLoadingFile] = useState(false);
	const [csvReport, setCsvReport] = useState({});
	const [manualExample, setManualExample] = useState({
		values: [],
		tags: [],
		labeling_status: 'unlabeled',
	});
	const [csvData, setCsvData] = useState([]);
	const [uploadStatus, setUploadStatus] = useState('Processing CSV file...');
	const [tmpImages, setTmpImages] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage] = useState(4);

	// CSV upload errors
	const [csvErrors, setCsvErrors] = useState([]);
	const [openCsvErrorModal, setOpenCsvErrorModal] = useState(false);

	// ##############################

	// Tags
	const [openCreateTagMenu, setOpenCreateTagMenu] = useState(null);
	const [tag, setTag] = useState({
		name: '',
		description: '',
		color: '#000000',
	});
	const [anchorEl, setAnchorEl] = useState(null);
	const [openTagMenu, setOpenTagMenu] = useState(false);
	const [searchByTag, setSearchByTag] = useState('');
	const [filteredTags, setFilteredTags] = useState([]);
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

	const handleOpenTagMenu = (event) => {
		setAnchorEl(event.currentTarget);
		setOpenTagMenu(true);
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
				exampleId: currentExampleState.id,
				examplesToUpdate: {
					values,
					tags: currentExampleState.tags?.includes(tagName)
						? currentExampleState.tags?.filter((tag) => tag !== tagName)
						: [...(currentExampleState.tags || []), tagName],
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
		setOpenTagMenu(true);
		setCurrentTag(null);
	};

	const handleOpenCreateTagMenu = () => {
		setTag({
			name: '',
			description: '',
			color: '#000000',
		});
		setOpenCreateTagMenu(true);
		setOpenTagMenu(false);
	};

	const handleCloseTagMenu = () => {
		setOpenTagMenu(false);
		setCurrentTag(null);
		setTag({
			name: '',
			description: '',
			color: '#000000',
		});
	};

	const handleCloseCreateTagMenu = () => {
		setOpenCreateTagMenu(false);
		setOpenTagMenu(true);
	};

	const highlightMatches = (item) => {
		const lowerCaseItem = item.toLowerCase();
		const result = [];

		const searchText = searchByTag;

		let currentIndex = 0;

		for (let i = 0; i < searchText.length; i += 1) {
			const char = searchText[i];
			const index = lowerCaseItem.indexOf(char.toLowerCase(), currentIndex);

			if (index !== -1) {
				result.push(<span key={i}>{item.substring(currentIndex, index)}</span>);
				result.push(
					<span key={`${i}-highlight`} style={styles.highlight}>
						{item.substring(index, index + char.length)}
					</span>
				);
				currentIndex = index + char.length;
			}
		}

		result.push(<span key="remaining">{item.substring(currentIndex)}</span>);
		return result;
	};

	const handleChangeTag = (tagName) => {
		setManualExample({
			...manualExample,
			tags: manualExample.tags.includes(tagName)
				? manualExample.tags.filter((tag) => tag !== tagName)
				: [...manualExample.tags, tagName],
		});
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
		setManualExample({
			...manualExample,
			tags: manualExample.tags.filter((tag) => tag !== currentTag.name),
		});
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

	const getThumbnails = async () => {
		const tmpArray = manualExample.values.filter(
			(example) =>
				example.value !== '' && Object.keys(example).includes('thumbnailUrl')
		);
		if (manualExample.values.length > 0) {
			if (tmpArray.length > 0) {
				await Promise.all(
					tmpArray.map(async (example) =>
						requestFactory({
							type: 'GET',
							url: `/tasks/${currentTaskState.id}/files/${example.value}`,
							userState,
							dispatch,
						})
					)
				).then((res) => {
					const tmpExamples = manualExample.values.map((example) => {
						if (res.find((r) => r.id === example.value))
							return {
								...example,
								thumbnailUrl: res.find((r) => r.id === example.value)[
									'download_url'
								],
							};
						return example;
					});
					setManualExample({ ...manualExample, values: tmpExamples });
				});
			}
		}
	};

	const getExample = async (tmp) => {
		let newTmp = tmp;
		allColumns.forEach(async (column) => {
			if (column.field === 'status')
				newTmp = {
					...tmp,
					labeling_status: currentExampleState.labeling_status,
				};
			if (column.field !== 'status' && column.field !== 'edit') {
				if (
					column.valueType === 'generic_file' ||
					column.valueType === 'document_file' ||
					column.valueType === 'image_file' ||
					column.valueType === 'video_file' ||
					column.valueType === 'audio_file'
				) {
					if (
						currentExampleState[
							column.fieldType !== 'metadata'
								? `${column.fieldType}s`
								: column.fieldType
						] &&
						currentExampleState[
							column.fieldType !== 'metadata'
								? `${column.fieldType}s`
								: column.fieldType
						].find((example) => example.element === column.field) &&
						currentExampleState[
							column.fieldType !== 'metadata'
								? `${column.fieldType}s`
								: column.fieldType
						].find((example) => example.element === column.field).value &&
						currentExampleState[
							column.fieldType !== 'metadata'
								? `${column.fieldType}s`
								: column.fieldType
						].find((example) => example.element === column.field).value !== ''
					) {
						Promise.resolve(
							requestFactory({
								type: 'GET',
								url: `/tasks/${currentTaskState.id}/files/${
									currentExampleState[
										column.fieldType !== 'metadata'
											? `${column.fieldType}s`
											: column.fieldType
									].find((example) => example.element === column.field).value
								}`,
								userState,
								dispatch,
							})
						).then((res) => {
							const tmpExamples = newTmp.values.map((example) => {
								if (example.value === res.id)
									return { ...example, thumbnailUrl: res.download_url };
								return example;
							});
							setManualExample({ ...newTmp, values: tmpExamples });
						});

						newTmp = {
							...newTmp,
							values: newTmp.values.map((element) => {
								if (element.element === column.field) {
									return {
										element: column.field,
										value:
											(currentExampleState[
												column.fieldType !== 'metadata'
													? `${column.fieldType}s`
													: column.fieldType
											] &&
												currentExampleState[
													column.fieldType !== 'metadata'
														? `${column.fieldType}s`
														: column.fieldType
												].find((example) => example.element === column.field)
													.value) ||
											'',
										thumbnailUrl: '',
										tmpInfo: '',
										isLoading: false,
									};
								}
								return element;
							}),
						};
					}
				} else {
					newTmp = {
						...newTmp,
						values: newTmp.values?.map((element) => {
							if (element.element === column.field) {
								return {
									element: column.field,
									value:
										(currentExampleState[
											column.fieldType !== 'metadata'
												? `${column.fieldType}s`
												: column.fieldType
										] &&
											currentExampleState[
												column.fieldType !== 'metadata'
													? `${column.fieldType}s`
													: column.fieldType
											].find((example) => example.element === column.field)
												?.value) ||
										'',
								};
							}
							return element;
						}),
					};
				}
			}
		});
		setManualExample(newTmp);
	};

	useEffect(() => {
		if (!open) {
			setCreationStep(0);
			setFileToUpload(null);
		}

		if (allColumns.length > 0) {
			let tmp = manualExample;
			allColumns.forEach((column) => {
				if (column.field !== 'status' && column.field !== 'edit')
					if (
						column.valueType === 'generic_file' ||
						column.valueType === 'document_file' ||
						column.valueType === 'image_file' ||
						column.valueType === 'video_file' ||
						column.valueType === 'audio_file'
					) {
						tmp = {
							...tmp,
							values: [
								...tmp.values,
								{
									element: column.field,
									value: column.multiValue ? [] : '',
									thumbnailUrl: column.multiValue ? [] : '',
									tmpInfo: column.multiValue ? [] : '',
									isLoading: false,
								},
							],
						};
					} else if (column.valueType === 'boolean') {
						tmp = {
							...tmp,
							values: [
								...tmp.values,
								{
									element: column.field,
									value: false,
								},
							],
						};
					} else if (column.valueType === 'datetime') {
						tmp = {
							...tmp,
							values: [
								...tmp.values,
								{
									element: column.field,
									value: null,
								},
							],
						};
					} else {
						tmp = {
							...tmp,
							values: [
								...tmp.values,
								{
									element: column.field,
									value: '',
								},
							],
						};
					}
				tmp = {
					...tmp,
					tags: currentExampleState.tags || [],
				};
				setManualExample(tmp);
			});
			if (type === 'update') {
				if (Object.keys(currentExampleState)?.length > 0) {
					getExample(tmp);
					getThumbnails();
				}
			}
		}
	}, [open]);

	useEffect(() => {
		setCsvReport(createCSVTemplate(allColumns));
	}, [allColumns]);

	const handleClose = (isUpdated) => {
		if (isUpdated)
			dispatch(
				GET_EXAMPLES({
					taskId: currentTaskState.uuid,
					dispatch,
					userState,
				})
			);
		setCreationStep(0);
		setOpen(false);
		setOpenCsvErrorModal(false);
		setFileToUpload(null);
		setManualExample({
			values: [],
			labeling_status: 'unlabeled',
			tags: { elements: [], groups: [] },
		});
	};

	const handleAddExampleManually = () => {
		setCreationStep(1);
	};

	const handleChangeCurrentRowStatus = (e) => {
		setManualExample({ ...manualExample, labeling_status: e.target.value });
	};

	useEffect(() => {
		if (tmpImages.length > 0 && tmpImages[0]?.element)
			setManualExample({
				...manualExample,
				values: manualExample.values.map((val) =>
					val.element === tmpImages[0].element
						? {
								element: tmpImages[0].element,
								value: allColumns.find(
									(column) => column.field === tmpImages[0]?.element
								)?.multiValue
									? tmpImages.map((image) => image.value)
									: tmpImages[0]?.value,
								thumbnailUrl: allColumns.find(
									(column) => column.field === tmpImages[0]?.element
								)?.multiValue
									? tmpImages.map((image) => image.thumbnailUrl)
									: tmpImages[0]?.thumbnailUrl,
								tmpInfo: allColumns.find(
									(column) => column.field === tmpImages[0]?.element
								)?.multiValue
									? tmpImages.map((image) => image.tmpInfo)
									: tmpImages[0]?.tmpInfo,
								isLoading: false,
						  }
						: val
				),
			});
	}, [tmpImages]);

	const handleChangeManualExample = async ({
		e,
		usedFor,
		fileType,
		field,
		valueType,
		dateValue,
	}) => {
		let value = null;
		if (!dateValue) {
			value = e.target.value;
		}

		if (!dateValue && e.target.files?.length > 0 && fileType === 'image') {
			e.preventDefault();
			e.stopPropagation();

			setManualExample({
				...manualExample,
				values: manualExample.values.map((val) =>
					val.element === field ? { ...val, isLoading: true } : val
				),
			});

			setTimeout(5000);

			const { files } = e.target;

			const resFiles = Promise.all(
				Object.keys(files)?.map(async (key) => {
					const res = await dispatch(
						CREATE_TASK_FILE({
							taskId: currentTaskState.id,
							file: files[key],
							userState,
							dispatch,
							usedFor,
							fileType,
						})
					);

					if (res.payload) {
						const resFile = await dispatch(
							GET_EXAMPLE_FILE({
								taskId: currentTaskState.id,
								fileId: res.payload.id,
								userState,
								dispatch,
								thumbnail: fileType === 'image',
							})
						);
						dispatch(
							ADD_ALERT({ type: 'success', message: IMAGE_FILE_UPLOAD_SUCCESS })
						);
						setTimeout(() => {
							dispatch(REMOVE_ALERT(IMAGE_FILE_UPLOAD_SUCCESS));
						}, 2000);

						return {
							element: field,
							value: res.payload.id,
							thumbnailUrl: resFile.payload.download_url,
							tmpInfo: res.payload,
							isLoading: false,
						};
					}

					dispatch(
						ADD_ALERT({ type: 'error', message: IMAGE_FILE_UPLOAD_ERROR })
					);

					return {
						element: field,
						value: '',
						thumbnailUrl: '',
						tmpInfo: '',
						isLoading: false,
					};
				})
			);

			const result = await resFiles;

			if (result.length > 0) setTmpImages(result);
		} else if (
			!dateValue &&
			e.target.files &&
			e.target.files[0] &&
			fileType === 'csv'
		) {
			e.preventDefault();
			e.stopPropagation();

			// Parse csv file
			const parsedData = await parseCSVTimeSeriesFile(
				e.target.files[0],
				allColumns,
				dispatch,
				setIsLoadingFile,
				setFileToUpload,
				schemaState
			);

			// Set parsed value to manual example
			setManualExample({
				...manualExample,
				values: manualExample.values.map((val) => {
					if (val.element === field)
						return {
							...val,
							isLoading: false,
							fileName: e.target.files[0].name,
							value: parsedData,
						};
					return val;
				}),
			});
		} else if ((value === 'on' || value === 'off') && field !== 'anomaly') {
			setManualExample({
				...manualExample,
				values: manualExample.values.map((val) => {
					if (val.element === field) {
						return { element: field, value: e.target.checked };
					}
					return val;
				}),
			});
		} else if (field === 'anomaly') {
			const { name, checked } = e.target;

			setManualExample({
				...manualExample,
				values: manualExample.values.map((val) => {
					if (val.element === name && checked) return { ...val, value: 1.0 };
					if (val.element === name && !checked) return { ...val, value: 0.0 };
					return val;
				}),
			});
		} else if (dateValue) {
			setManualExample({
				...manualExample,
				values: manualExample.values.map((val) => {
					if (val.element === field) {
						return {
							element: field,
							value: getLocalDateTime(new Date(dateValue), userLocationState),
						};
					}
					return val;
				}),
			});
		} else {
			setManualExample({
				...manualExample,
				values: manualExample.values.map((val) => {
					if (val.element === field)
						return {
							element: field,
							value:
								valueType === 'number' ||
								valueType === 'integer' ||
								valueType === 'float'
									? Number(value)
									: value,
						};
					return val;
				}),
			});
		}
	};

	const handleSaveCreate = async () => {
		if (creationStep === 0) {
			setCreationStep(1);
		}
		if (creationStep === 1) {
			setCreationStep(0);
			setOpen(false);
			setFileToUpload(null);

			// CREATE EXAMPLE MANUALLY
			let tmpExample = [];

			const values = manualExample.values
				.filter((val) => {
					if (
						val.value === '' ||
						val.value === null ||
						val.value === undefined ||
						val.value.length === 0
					)
						return false;
					return val;
				})
				.map((val) => ({ element: val.element, value: val.value }));

			if (manualExample.tags?.length > 0) {
				tmpExample = {
					labeling_status: manualExample.labeling_status,
					values,
					tags: manualExample.tags,
				};
			} else {
				tmpExample = {
					labeling_status: manualExample.labeling_status,
					values,
				};
			}

			await dispatch(
				CREATE_EXAMPLE({
					taskId: currentTaskState.id,
					newExample: {
						batch: [tmpExample],
					},
					userState,
					dispatch,
				})
			);
			setTimeout(() => {}, 1000);

			setCurrentRowId('');
			setSelectedRows([]);
			handleClose(true);
		}
	};

	const handleSaveUpdate = async () => {
		setCreationStep(0);
		setOpen(false);

		// CREATE EXAMPLE MANUALLY
		const tmpExample = manualExample.values
			.filter((val) => {
				if (val.value === '') return false;
				return val;
			})
			.map((val) => ({ element: val.element, value: val.value }));

		await dispatch(
			UPDATE_EXAMPLE({
				taskId: currentTaskState.id,
				exampleId: currentRowId,
				examplesToUpdate: {
					labeling_status: manualExample.labeling_status,
					values: tmpExample,
					tags: manualExample.tags,
				},
				dispatch,
				userState,
			})
		);

		handleClose(true);
	};

	const handleClickUploadFile = () => {
		hiddenFileInput.current.click();
	};

	const handleChangeUploadCSV = async (event) => {
		setIsLoadingFile(true);
		setFileToUpload(event.target.files[0]);
		const newExamples = createValidatedExampleObjects(
			await parseCSVFile(
				event.target.files[0],
				allColumns,
				dispatch,
				setIsLoadingFile,
				setFileToUpload,
				schemaState,
				currentTaskState,
				csvData,
				setCsvData
			),
			schemaState,
			dispatch
		);

		const res = await getFilesFromParsedCSV(
			newExamples,
			schemaState,
			dispatch,
			currentTaskState,
			userState,
			setUploadStatus,
			userState,
			setCsvErrors
		);

		if (!res.errors) {
			await dispatch(
				CREATE_EXAMPLE({
					taskId: currentTaskState.id,
					newExample: { batch: res },
					userState,
					dispatch,
				})
			);

			await dispatch(
				GET_EXAMPLES({
					taskId: currentTaskState.id,
					userState,
					dispatch,
				})
			);
			setIsLoadingFile(false);
			handleClose();
		} else {
			setIsLoadingFile(false);
			setCsvErrors(res.errors);
			setOpenCsvErrorModal(true);
		}
	};

	const handleResetInputFile = (e) => {
		e.target.value = null;
	};

	const handleOpenDeleteExampleModal = () => {
		setOpenDeleteExampleModal(true);
	};

	const handleChangePage = async ({ newPage, currentElementType, column }) => {
		setPage(newPage);
		await dispatch(
			GET_SCHEMA_NODE_CATEGORIES({
				userState,
				taskId: currentTaskState.uuid,
				dispatch,
				nodeName: column.field,
				nodeType: currentElementType,
				nodeId: column.id,
				page: parseInt(newPage + 1),
			})
		);
	};

	return (
		<>
			<StandardModal
				open={open}
				setOpen={setOpen}
				title="Create example:"
				content={
					<>
						{creationStep === 0 && (
							<Box sx={styles().dialogContentContainer}>
								<Box sx={styles().createTypeContainer}>
									<div style={styles().csvUploadColumn}>
										<button
											type="button"
											onClick={handleAddExampleManually}
											className={cssStyles.createExampleButton}
										>
											Create manually
											<FontAwesomeIcon icon={faKeyboard} />
										</button>
									</div>
									<div style={styles().csvUploadColumn}>
										{isLoadingFile && (
											<button
												type="button"
												onClick={handleClickUploadFile}
												style={styles().createExampleButton}
											>
												{uploadStatus}
												<Loader size="L" local />
											</button>
										)}
										{!isLoadingFile && fileToUpload === null && (
											<>
												<button
													type="button"
													onClick={handleClickUploadFile}
													style={styles().createExampleButton}
												>
													Add CSV file
													<FontAwesomeIcon icon={faFileCsv} />
												</button>
												<input
													type="file"
													ref={hiddenFileInput}
													onChange={handleChangeUploadCSV}
													style={{ display: 'none' }}
												/>
											</>
										)}
										{!isLoadingFile && fileToUpload !== null && (
											<button
												type="button"
												style={styles().createExampleButton}
											>
												Selected file:
												{fileToUpload.name} upload finished
												<FontAwesomeIcon icon={faCloudArrowUp} />
											</button>
										)}
										{!isLoadingFile &&
											fileToUpload === null &&
											Object.keys(csvReport)?.length > 0 && (
												<div className={cssStyles.Export_btn}>
													<StandardButton
														type="textButton"
														value={
															<CSVLink
																filename={csvReport.filename}
																headers={csvReport.headers}
																data={[]}
															>
																Export CSV template
															</CSVLink>
														}
													/>
												</div>
											)}
									</div>
								</Box>
							</Box>
						)}

						{creationStep === 1 && (
							<Box sx={styles().exampleColumnsContainer}>
								<Grid container sx={styles().exampleColumnsRow}>
									<Grid item xs={12} sm={3} sx={styles().nameColumn}>
										STATUS
									</Grid>
									<Grid item xs={12} sm={9} sx={styles().inputColumn}>
										<Select
											value={manualExample.labeling_status}
											onChange={handleChangeCurrentRowStatus}
											SelectDisplayProps={{
												style: {
													display: 'flex',
													alignItems: 'center',
													gap: '6px',
												},
											}}
										>
											<MenuItem
												value="labeled"
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '6px',
												}}
											>
												<FontAwesomeIcon
													icon={faCheck}
													style={{
														fontSize: '18px',
													}}
												/>
												Labeled
											</MenuItem>
											<MenuItem
												value="unlabeled"
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '6px',
												}}
											>
												<FontAwesomeIcon
													icon={faTag}
													style={{
														fontSize: '18px',
													}}
												/>
												Unlabeled
											</MenuItem>
											<MenuItem
												value="pending_review"
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '6px',
												}}
											>
												<FontAwesomeIcon
													icon={faFilePen}
													style={{
														fontSize: '18px',
													}}
												/>
												Pending review
											</MenuItem>
											<MenuItem
												value="rejected"
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '6px',
												}}
											>
												<FontAwesomeIcon
													icon={faBan}
													style={{
														fontSize: '18px',
													}}
												/>
												Rejected
											</MenuItem>
										</Select>
									</Grid>
								</Grid>

								<Box sx={styles().exampleColumnsContainer}>
									<Grid container sx={styles().exampleColumnsRow}>
										<Grid item xs={12} sm={3} sx={styles().nameColumn}>
											TAGS
										</Grid>
										<Grid item xs={12} sm={9} sx={styles().inputColumn}>
											<Grid container gap={1}>
												<Grid item>
													<StandardButton
														type="icon"
														icon={<FontAwesomeIcon icon={faPlus} />}
														handleClick={handleOpenTagMenu}
													/>
												</Grid>
												{manualExample.tags?.map((tag) => (
													<Grid
														item
														style={{
															backgroundColor: tagsState.find(
																(el) => el.name === tag
															)?.color,
															padding: '6px',
															borderRadius: '6px',
															color: getTextColorBasedOnBackgroundColor(
																tagsState.find((el) => el.name === tag)?.color
															),
														}}
													>
														{tag}
													</Grid>
												))}
											</Grid>
										</Grid>
									</Grid>
								</Box>

								{allColumns.map(
									(column) =>
										column.field !== 'edit' &&
										column.field !== 'status' && (
											<Grid container sx={styles().exampleColumnsRow}>
												<Grid item xs={12} md={3} sx={styles().nameColumn}>
													<Grid
														container
														style={{
															display: 'flex',
															alignItems: 'center',
															gap: '6px',
														}}
													>
														{column.fieldType &&
															column.fieldType !== 'status' &&
															column.valueType &&
															elementTypeToIconMap[column.valueType](
																column.fieldType
															)}
														<div className={cssStyles.create_data_labels}>
															{column.fieldType !== 'status' && column.name}
														</div>
													</Grid>
												</Grid>
												<Grid item xs={12} md={9} sx={styles().inputColumn}>
													{
														// INTEGER TYPE
														column.valueType === 'integer' &&
															(!column.multiValue ? (
																<Input
																	className={cssStyles.common_input_type}
																	type="number"
																	value={
																		manualExample.values.find(
																			(element) =>
																				element.element === column.field
																		)?.value || ''
																	}
																	name={column.field}
																	onChange={(e) =>
																		handleChangeManualExample({
																			e,
																			field: column.field,
																			valueType: column.valueType,
																		})
																	}
																/>
															) : (
																<div style={styles().uploadContainer}>
																	{manualExample.values.find(
																		(element) =>
																			element.element === column.field
																	)?.isLoading ? (
																		<StandardButton
																			value={<Loader size="S" local />}
																			type="uploadFile"
																		/>
																	) : (
																		<StandardButton
																			accept=".csv"
																			value={
																				manualExample.values.find(
																					(element) =>
																						element.element === column.field
																				)?.fileName || 'Upload CSV'
																			}
																			type="uploadFile"
																			handleChange={(e) =>
																				handleChangeManualExample({
																					e,
																					usedFor: column.fieldType,
																					fileType: 'csv',
																					field: column.field,
																				})
																			}
																			id={column.field}
																			name={column.field}
																			handleClick={(e) =>
																				handleResetInputFile(e, 'time_serie')
																			}
																		/>
																	)}
																	<div style={cssStyles.csvDataPreview}>
																		{manualExample.values.find(
																			(element) =>
																				element.element === column.field
																		)?.value &&
																		manualExample.values.find(
																			(element) =>
																				element.element === column.field
																		)?.value.length > 1 ? (
																			<LineChart
																				width={200}
																				height={50}
																				data={
																					manualExample.values.find(
																						(element) =>
																							element.element === column.field
																					)?.value
																				}
																			>
																				<Line
																					dataKey={(v) => v}
																					stroke="#8884d8"
																					strokeWidth={1}
																					dot={false}
																				/>
																			</LineChart>
																		) : (
																			<div>
																				{
																					manualExample.values.find(
																						(element) =>
																							element.element === column.field
																					)?.value
																				}
																			</div>
																		)}
																	</div>
																</div>
															))
													}
													{
														// FLOAT TYPE
														column.valueType === 'float' &&
															(!column.multiValue ? (
																<Input
																	className={cssStyles.common_input_type}
																	value={
																		manualExample.values.find(
																			(element) =>
																				element.element === column.field
																		)?.value || ''
																	}
																	name={column.field}
																	onChange={(e) =>
																		handleChangeManualExample({
																			e,
																			field: column.field,
																			valueType: column.valueType,
																		})
																	}
																	type="number"
																/>
															) : (
																<div style={styles().uploadContainer}>
																	{manualExample.values.find(
																		(element) =>
																			element.element === column.field
																	)?.isLoading ? (
																		<StandardButton
																			value={<Loader size="S" local />}
																			type="uploadFile"
																		/>
																	) : (
																		<StandardButton
																			accept=".csv"
																			value={
																				manualExample.values.find(
																					(element) =>
																						element.element === column.field
																				)?.fileName || 'Upload CSV'
																			}
																			type="uploadFile"
																			handleChange={(e) =>
																				handleChangeManualExample({
																					e,
																					usedFor: column.fieldType,
																					fileType: 'csv',
																					field: column.field,
																				})
																			}
																			id={column.field}
																			name={column.field}
																			handleClick={(e) =>
																				handleResetInputFile(e, 'time_serie')
																			}
																		/>
																	)}
																	<div style={styles().csvDataPreview}>
																		{manualExample.values.find(
																			(element) =>
																				element.element === column.field
																		)?.value &&
																		manualExample.values.find(
																			(element) =>
																				element.element === column.field
																		)?.value.length > 1 ? (
																			<LineChart
																				width={200}
																				height={50}
																				data={
																					manualExample.values.find(
																						(element) =>
																							element.element === column.field
																					)?.value
																				}
																			>
																				<Line
																					dataKey={(v) => v}
																					stroke="#8884d8"
																					strokeWidth={1}
																					dot={false}
																				/>
																			</LineChart>
																		) : (
																			<div>
																				{
																					manualExample.values.find(
																						(element) =>
																							element.element === column.field
																					)?.value
																				}
																			</div>
																		)}
																	</div>
																</div>
															))
													}
													{
														// BOOLEAN TYPE
														column.valueType === 'boolean' && (
															<FormControlLabel
																control={
																	<Switch
																		checked={
																			manualExample.values.find(
																				(element) =>
																					element.element === column.field
																			)?.value
																		}
																		name={column.field}
																		onChange={(e) =>
																			handleChangeManualExample({
																				e,
																				field: column.field,
																			})
																		}
																	/>
																}
																label={
																	manualExample.values.find(
																		(element) =>
																			element.element === column.field
																	)?.value
																		? 'True'
																		: 'False'
																}
															/>
														)
													}
													{
														// DATETIME TYPE
														column.valueType === 'datetime' &&
															(!column.multiValue ? (
																<LocalizationProvider
																	dateAdapter={AdapterDayjs}
																>
																	<DateTimePicker
																		className={cssStyles.date_pick_input_type}
																		value={
																			manualExample.values.find(
																				(element) =>
																					element.element === column.field
																			)?.value || ''
																		}
																		name={column.field}
																		onChange={(dateValue) => {
																			handleChangeManualExample({
																				dateValue,
																				field: column.field,
																			});
																		}}
																		renderInput={(params) => (
																			<TextField
																				{...params}
																				helperText={null}
																			/>
																		)}
																		inputFormat="YYYY/MM/DD hh:mm"
																	/>
																</LocalizationProvider>
															) : (
																<div style={styles().uploadContainer}>
																	<div
																		style={{
																			display: 'flex',
																			alignItems: 'top',
																		}}
																	>
																		{manualExample.values.find(
																			(element) =>
																				element.element === column.field
																		)?.isLoading ? (
																			<StandardButton
																				value={<Loader size="S" local />}
																				type="uploadFile"
																			/>
																		) : (
																			<StandardButton
																				accept=".csv"
																				value={
																					manualExample.values.find(
																						(element) =>
																							element.element === column.field
																					)?.fileName || 'Upload CSV'
																				}
																				type="uploadFile"
																				handleChange={(e) =>
																					handleChangeManualExample({
																						e,
																						usedFor: column.fieldType,
																						fileType: 'csv',
																						field: column.field,
																					})
																				}
																				id={column.field}
																				name={column.field}
																				handleClick={(e) =>
																					handleResetInputFile(e, 'time_serie')
																				}
																			/>
																		)}
																	</div>
																	<div style={styles().csvDataPreview}>
																		{manualExample.values.find(
																			(element) =>
																				element.element === column.field
																		)?.value &&
																		manualExample.values.find(
																			(element) =>
																				element.element === column.field
																		)?.value.length > 1 ? (
																			manualExample.values
																				.find(
																					(element) =>
																						element.element === column.field
																				)
																				?.value.map((date) => (
																					<LocalizationProvider
																						dateAdapter={AdapterDayjs}
																					>
																						<DateTimePicker
																							className={
																								cssStyles.date_pick_input_type
																							}
																							value={date}
																							name={column.field}
																							disabled
																							renderInput={(params) => (
																								<TextField
																									{...params}
																									helperText={null}
																								/>
																							)}
																							inputFormat="YYYY/MM/DD hh:mm"
																						/>
																					</LocalizationProvider>
																				))
																		) : (
																			<div>
																				{
																					manualExample.values.find(
																						(element) =>
																							element.element === column.field
																					)?.value
																				}
																			</div>
																		)}
																	</div>
																</div>
															))
													}
													{
														// TEXT TYPE
														column.valueType === 'text' && (
															<TextField
																multiline
																rows={5}
																maxRows={5}
																inputProps={{ maxLength: 32000 }}
																id={column.field}
																className={cssStyles.common_input_type}
																value={
																	manualExample.values.find(
																		(element) =>
																			element.element === column.field
																	)?.value || ''
																}
																name={column.field}
																onChange={(e) =>
																	handleChangeManualExample({
																		e,
																		field: column.field,
																	})
																}
															/>
														)
													}
													{
														// CATEGORY TYPE
														column.valueType === 'category' && (
															<Select
																id="Category"
																sx={styles().typeCategory}
																value={
																	manualExample.values.find(
																		(element) =>
																			element.element === column.field
																	)?.value || ''
																}
																name={column.field}
																onChange={(e) =>
																	handleChangeManualExample({
																		e,
																		field: column.field,
																	})
																}
															>
																<MenuItem value={null}>None</MenuItem>
																{categoriesState &&
																	categoriesState[
																		column.fieldType !== 'metadata'
																			? `${column.fieldType}s`
																			: column.fieldType
																	] &&
																	categoriesState[
																		column.fieldType !== 'metadata'
																			? `${column.fieldType}s`
																			: column.fieldType
																	].length > 0 &&
																	categoriesState[
																		column.fieldType !== 'metadata'
																			? `${column.fieldType}s`
																			: column.fieldType
																	]
																		.find((c) => c.id === column.id)
																		?.categories?.map((category) => (
																			<MenuItem
																				value={category.name}
																				key={category.id}
																			>
																				<em>
																					{category.display_name ||
																						category.name}
																				</em>
																			</MenuItem>
																		))}
																{categoriesState &&
																	categoriesState[
																		column.fieldType !== 'metadata'
																			? `${column.fieldType}s`
																			: column.fieldType
																	] &&
																	categoriesState[
																		column.fieldType !== 'metadata'
																			? `${column.fieldType}s`
																			: column.fieldType
																	].length > 0 &&
																	categoriesState[
																		column.fieldType !== 'metadata'
																			? `${column.fieldType}s`
																			: column.fieldType
																	].find((c) => c.id === column.id) && (
																		<Grid
																			conteiner
																			style={{
																				display: 'flex',
																				justifyContent: 'center',
																			}}
																		>
																			<CustomPagination
																				total={
																					categoriesState[
																						column.fieldType !== 'metadata'
																							? `${column.fieldType}s`
																							: column.fieldType
																					].find((c) => c.id === column.id)
																						.total_count ||
																					categoriesState[
																						column.fieldType !== 'metadata'
																							? `${column.fieldType}s`
																							: column.fieldType
																					].find((c) => c.id === column.id)
																						?.categories?.length
																				}
																				rowsPerPage={rowsPerPage}
																				page={page}
																				handleChangePage={(e, value) => {
																					handleChangePage({
																						e,
																						newPage: value,
																						currentElementType:
																							column.fieldType !== 'metadata'
																								? `${column.fieldType}s`
																								: column.fieldType,
																						column,
																					});
																				}}
																				rowsPerPageOptions={[4]}
																				simple
																			/>
																		</Grid>
																	)}
															</Select>
														)
													}
													{
														// DOCUMENT FILE TYPE
														column.valueType === 'document_file' && (
															<div style={styles().uploadContainer}>
																{manualExample.values.find(
																	(element) => element.element === column.field
																)?.isLoading ? (
																	<StandardButton
																		value={<Loader size="S" local />}
																		type="uploadFile"
																	/>
																) : (
																	<StandardButton
																		accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf"
																		value={
																			manualExample.values.find(
																				(element) =>
																					element.element === column.field
																			)?.value || 'Upload document'
																		}
																		type="uploadFile"
																		handleChange={(e) =>
																			handleChangeManualExample({
																				e,
																				usedFor: column.fieldType,
																				fileType: 'document',
																				field: column.field,
																			})
																		}
																		id={column.field}
																		name={column.field}
																		handleClick={handleResetInputFile}
																	/>
																)}
																<div className={cssStyles.data_preview}>
																	Can't load document preview
																</div>
															</div>
														)
													}
													{
														// IMAGE TYPE
														column.valueType === 'image_file' && (
															<div style={styles().uploadContainer}>
																{manualExample.values.find(
																	(element) => element.element === column.field
																)?.isLoading ? (
																	<StandardButton
																		value={<Loader size="S" local />}
																		type="uploadFile"
																		multivalue={!!column.multiValue}
																	/>
																) : (
																	<StandardButton
																		accept="image/.jpg, image/.png"
																		value="Upload image"
																		type="uploadFile"
																		handleChange={(e) =>
																			handleChangeManualExample({
																				e,
																				usedFor: column.fieldType,
																				fileType: 'image',
																				field: column.field,
																			})
																		}
																		id={column.field}
																		name={column.field}
																		handleClick={handleResetInputFile}
																		multivalue={!!column.multiValue}
																	/>
																)}
																<div className={cssStyles.data_preview}>
																	{Array.isArray(
																		manualExample.values.find(
																			(element) =>
																				element.element === column.field
																		)?.value
																	) ? (
																		manualExample.values
																			.find(
																				(element) =>
																					element.element === column.field
																			)
																			?.value?.map((image, key) => (
																				<img
																					alt={
																						manualExample.values.find(
																							(element) =>
																								element.element === column.field
																						).value[key]
																					}
																					src={
																						manualExample.values.find(
																							(element) =>
																								element.element === column.field
																						)?.thumbnailUrl[key] !== '' &&
																						manualExample.values.find(
																							(element) =>
																								element.element === column.field
																						)?.thumbnailUrl[key]
																					}
																					style={styles().imagePreview}
																				/>
																			))
																	) : (
																		<img
																			alt={
																				manualExample.values.find(
																					(element) =>
																						element.element === column.field
																				)?.value
																			}
																			src={
																				manualExample.values.find(
																					(element) =>
																						element.element === column.field
																				)?.thumbnailUrl !== '' &&
																				manualExample.values.find(
																					(element) =>
																						element.element === column.field
																				)?.thumbnailUrl
																			}
																			style={styles().imagePreview}
																		/>
																	)}
																</div>
															</div>
														)
													}
													{
														// VIDEO TYPE
														column.valueType === 'video_file' && (
															<div style={styles().uploadContainer}>
																{manualExample.values.find(
																	(element) => element.element === column.field
																)?.isLoading ? (
																	<StandardButton
																		value={<Loader size="S" local />}
																		type="uploadFile"
																	/>
																) : (
																	<StandardButton
																		accept="video/*"
																		value={
																			manualExample.values.find(
																				(element) =>
																					element.element === column.field
																			)?.value || 'Upload video'
																		}
																		type="uploadFile"
																		handleChange={(e) =>
																			handleChangeManualExample({
																				e,
																				usedFor: column.fieldType,
																				fileType: 'video',
																				field: column.field,
																			})
																		}
																		id={column.field}
																		name={column.field}
																		handleClick={handleResetInputFile}
																	/>
																)}
																<div className={cssStyles.data_preview}>
																	Can't load video preview
																</div>
															</div>
														)
													}
													{
														// AUDIO TYPE
														column.valueType === 'audio_file' && (
															<div style={styles().uploadContainer}>
																{manualExample.values.find(
																	(element) => element.element === column.field
																)?.isLoading ? (
																	<StandardButton
																		value={<Loader size="S" local />}
																		type="uploadFile"
																	/>
																) : (
																	<StandardButton
																		accept="audio/*"
																		value={
																			manualExample.values.find(
																				(element) =>
																					element.element === column.field
																			)?.value || 'Upload audio'
																		}
																		type="uploadFile"
																		handleChange={(e) =>
																			handleChangeManualExample({
																				e,
																				usedFor: column.fieldType,
																				fileType: 'audio',
																				field: column.field,
																			})
																		}
																		id={column.field}
																		name={column.field}
																		handleClick={handleResetInputFile}
																	/>
																)}
																<div className={cssStyles.data_preview}>
																	Can't load audio preview
																</div>
															</div>
														)
													}

													<Menu
														anchorEl={anchorEl}
														id="main-tag-menu"
														open={openTagMenu}
														onClose={handleCloseTagMenu}
														slotProps={{
															paper: {
																elevation: 0,
																sx: {
																	width: '300px',
																	overflow: 'visible',
																	filter:
																		'drop-shadow(0px 1px 5px rgba(0,0,0,0.1))',
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
														transformOrigin={{
															horizontal: 'left',
															vertical: 'top',
														}}
														anchorOrigin={{
															horizontal: 'left',
															vertical: 'bottom',
														}}
													>
														<Grid container sx={{ padding: '3px 6px' }}>
															<SearchInput
																handleChange={(e) => {
																	const { value } = e.target;
																	let filteredItems = [];
																	filteredItems = tagsState.filter((item) =>
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
																			checked={manualExample.tags?.includes(
																				tag.name
																			)}
																			onChange={() => handleChangeTag(tag.name)}
																		/>
																	</Grid>
																	<Grid
																		item
																		xs={10}
																		sx={{ paddingLeft: '6px' }}
																	>
																		<Typography
																			variant="inherit"
																			noWrap
																			sx={{
																				maxWidth: '95%',
																				backgroundColor: tag.color,
																				color:
																					getTextColorBasedOnBackgroundColor(
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
															sx={{
																justifyContent: 'center',
																padding: '3px 0px',
															}}
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
																	filter:
																		'drop-shadow(0px 1px 5px rgba(0,0,0,0.1))',
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
														transformOrigin={{
															horizontal: 'left',
															vertical: 'top',
														}}
														anchorOrigin={{
															horizontal: 'left',
															vertical: 'bottom',
														}}
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
																sx={{
																	display: 'flex',
																	justifyContent: 'center',
																}}
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
																	sx={{
																		display: 'flex',
																		justifyContent: 'center',
																	}}
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
																		currentTag
																			? handleEditTag()
																			: handleCreateTag()
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
												</Grid>
											</Grid>
										)
								)}
							</Box>
						)}

						{type === 'update' && (
							<PageRow
								type="danger"
								column1={
									<Section title="Delete this examples">
										<span style={{ fontSize: 'small', color: colors.darkGray }}>
											Once deleted, it will be gone forever. Please be certain.
										</span>
									</Section>
								}
								column2={
									<Section style={{ fontWeight: 'bold' }}>
										<StandardButton
											handleClick={handleOpenDeleteExampleModal}
											type="danger"
											value="Delete this example"
										/>
									</Section>
								}
							/>
						)}
					</>
				}
				actions={
					<>
						{creationStep === 1 && (
							<StandardButton
								loading={manualExample.values.some(
									(element) => element.isLoading
								)}
								value={type === 'create' ? 'Create example' : 'Update example'}
								handleClick={
									type === 'create' ? handleSaveCreate : handleSaveUpdate
								}
							/>
						)}
						<StandardButton value="Close" handleClick={handleClose} close />
					</>
				}
			/>
			{openCsvErrorModal && (
				<StandardModal
					open={openCsvErrorModal}
					setOpen={setOpenCsvErrorModal}
					title="CSV upload errors report:"
					content={
						<ul>
							{csvErrors.map((error) => (
								<li key={uuidv4()}>{error}</li>
							))}
						</ul>
					}
					actions={
						<StandardButton value="Close" handleClick={handleClose} close />
					}
				/>
			)}
		</>
	);
};

CreateOrUpdateExampleModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	allColumns: PropTypes.array,
	type: PropTypes.string,
	step: PropTypes.number,
	currentRowId: PropTypes.string,
	setOpenDeleteExampleModal: PropTypes.func,
	setCurrentRowId: PropTypes.func,
	setSelectedRows: PropTypes.func,
};
