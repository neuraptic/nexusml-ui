import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

// Components
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormControlLabel, Input, Switch, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
	faFileCsv,
	faKeyboard,
	faCloudArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line, LineChart } from 'recharts';
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';
import { Loader } from '../../../../../../Components/Shared/Loader';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Services
import { elementTypeToIconMap } from '../../../../../../services/tasks';
import {
	createCSVTemplate,
	getFilesFromParsedCSV,
	parseCSVFile,
} from '../../csv.services';
import { createValidatedTestingObjects } from '../../aitesting.services';
import { getLocalDateTime } from '../../../../../../services/date';
import { parseCSVTimeSeriesFile } from '../../../Examples/csv.services';

// Redux
import { GET_EXAMPLE_FILE } from '../../../../../../redux/examples.slice';
import { ADD_ALERT, REMOVE_ALERT } from '../../../../../../redux/alerts.slice';
import { CREATE_TASK_FILE } from '../../../../../../redux/tasks.slice';
import { CREATE_TEST, GET_TESTS } from '../../../../../../redux/testing.slice';

// Alerts
import {
	IMAGE_FILE_UPLOAD_ERROR,
	IMAGE_FILE_UPLOAD_SUCCESS,
} from '../../../../../../AlertsList/examplesAlerts';

export const CreateOrUpdateAITestingModal = (props) => {
	const { open, setOpen, allColumns, schemaState, step = 0 } = props;

	const dispatch = useDispatch();

	const hiddenFileInput = useRef(null);

	// Global states
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const userState = useSelector((state) => state.user);
	const { currentExample: currentExampleState } = useSelector(
		(state) => state.examples
	);
	const { tests: testsState } = useSelector((state) => state.tests);
	const { categories: categoriesState } = useSelector((state) => state.schema);
	const { location: userLocationState } = useSelector((state) => state.user);

	// Local states
	const [creationStep, setCreationStep] = useState(step);
	const [fileToUpload, setFileToUpload] = useState(null);
	const [isLoadingFile, setIsLoadingFile] = useState(false);
	const [csvReport, setCsvReport] = useState({});
	const [manualExample, setManualExample] = useState({
		values: [],
		targets: [],
	});
	const [tmpImage, setTmpImage] = useState({});
	const [uploadStatus, setUploadStatus] = useState('Processing CSV file...');

	// CSV upload errors
	const [csvErrors, setCsvErrors] = useState([]);
	const [openCsvErrorModal, setOpenCsvErrorModal] = useState(false);

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
									value: '',
									thumbnailUrl: '',
									tmpInfo: '',
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
									value: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
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
				setManualExample(tmp);
			});
		}
	}, [open, currentExampleState]);

	useEffect(() => {
		setCsvReport(createCSVTemplate(allColumns));
	}, [allColumns]);

	const handleClose = async () => {
		setCreationStep(0);
		setOpen(false);
		setFileToUpload(null);
		setManualExample({
			...manualExample,
			values: [],
		});
	};

	const handleAddExampleManually = () => {
		setCreationStep(1);
	};

	useEffect(() => {
		if (Object.keys(tmpImage).length > 0)
			setManualExample({
				...manualExample,
				values: manualExample.values.map((val) => {
					if (val.element === tmpImage.element)
						return {
							element: tmpImage.element,
							value: tmpImage.value,
							thumbnailUrl: tmpImage.thumbnailUrl,
							tmpInfo: tmpImage.tmpInfo,
							isLoading: false,
						};
					return val;
				}),
			});
	}, [tmpImage]);

	const handleChangeManualExample = async ({
		e,
		usedFor,
		fileType,
		field,
		valueType,
		dateValue,
	}) => {
		let value = null;
		const { name, checked } = e.target;
		if (!dateValue) {
			value = e.target.value;
		}

		if (
			!dateValue &&
			e.target.files &&
			e.target.files[0] &&
			fileType === 'image'
		) {
			e.preventDefault();
			e.stopPropagation();

			setManualExample({
				...manualExample,
				values: manualExample.values.map((val) => {
					if (val.element === field) return { ...val, isLoading: true };
					return val;
				}),
			});

			const file = e.target.files[0];

			const res = await dispatch(
				CREATE_TASK_FILE({
					taskId: currentTaskState.id,
					file,
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

				setTmpImage({
					element: field,
					value: res.payload.id,
					thumbnailUrl: resFile.payload.download_url,
					tmpInfo: res.payload,
					isLoading: false,
				});
				dispatch(
					ADD_ALERT({ type: 'success', message: IMAGE_FILE_UPLOAD_SUCCESS })
				);
				setTimeout(() => {
					dispatch(REMOVE_ALERT(IMAGE_FILE_UPLOAD_SUCCESS));
				}, 2000);
			} else {
				dispatch(
					ADD_ALERT({ type: 'error', message: IMAGE_FILE_UPLOAD_ERROR })
				);
			}
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
						return { element: field, value: 'checked' };
					}
					return val;
				}),
			});
		} else if (field === 'anomaly') {
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
							value: getLocalDateTime(dateValue, userLocationState),
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

			const tmpValues = manualExample.values
				.filter((val) => {
					if (
						val.value === '' ||
						val.value === null ||
						val.value === undefined ||
						schemaState.outputs.some((output) => output.name === val.element)
					)
						return false;
					return val;
				})
				.map((val) => ({ element: val.element, value: val.value }));

			const tmpTargets = manualExample.values
				.filter((val) => {
					if (
						val.value === '' ||
						val.value === null ||
						val.value === undefined ||
						!schemaState.outputs.some((output) => output.name === val.element)
					)
						return false;
					return val;
				})
				.map((val) => ({ element: val.element, value: val.value }));

			await dispatch(
				CREATE_TEST({
					taskId: currentTaskState.id,
					newTest: {
						batch: [
							{
								values: tmpValues,
								targets: tmpTargets,
							},
						],
					},
					testsState,
					userState,
					dispatch,
				})
			);

			setTimeout(() => {}, 1000);

			handleClose();
		}
	};

	const handleClickUploadFile = () => {
		hiddenFileInput.current.click();
	};

	const handleChangeUploadCSV = async (event) => {
		setIsLoadingFile(true);
		setFileToUpload(event.target.files[0]);
		const newTests = createValidatedTestingObjects(
			await parseCSVFile({
				file: event.target.files[0],
				allColumns,
				schemaState,
				dispatch,
				setIsLoadingFile,
				setFileToUpload,
			})
		);

		const res = await getFilesFromParsedCSV(
			newTests,
			schemaState,
			dispatch,
			currentTaskState,
			userState,
			setUploadStatus,
			setCsvErrors
		);

		if (!res.errors) {
			await dispatch(
				CREATE_TEST({
					taskId: currentTaskState.id,
					newTest: {
						batch: res,
					},
					testsState,
					userState,
					dispatch,
				})
			);

			await dispatch(
				GET_TESTS({
					taskId: currentTaskState.uuid,
					userState,
					dispatch,
					environment: 'testing',
				})
			);
			setIsLoadingFile(false);
			handleClose();
		} else {
			setIsLoadingFile(false);
			setCsvErrors(res.errors);
			setOpenCsvErrorModal(true);
		}

		setIsLoadingFile(false);
		handleClose();
	};

	const handleResetInputFile = (e) => {
		e.target.value = null;
	};

	return (
		<>
			<StandardModal
				open={open}
				setOpen={setOpen}
				title="Create test:"
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
												{fileToUpload.name}
												<FontAwesomeIcon icon={faCloudArrowUp} />
											</button>
										)}
										{!isLoadingFile && fileToUpload === null && csvReport && (
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
								{allColumns.map(
									(column) =>
										column.field !== 'edit' &&
										column.field !== 'status' &&
										column.fieldType !== 'target' && (
											<Box key={column.id} sx={styles().exampleColumnsRow}>
												<Box sx={styles().nameColumn}>
													{column.fieldType &&
														column.fieldType !== 'status' &&
														column.valueType &&
														elementTypeToIconMap[column.valueType](
															column.fieldType
														)}
													<div className={cssStyles.create_data_labels}>
														{column.fieldType !== 'status' && column.name}
													</div>
												</Box>
												<Box sx={styles().inputColumn}>
													{
														// INTEGER TYPE
														column.valueType === 'integer' &&
															(!column.multiValue ? (
																<Input
																	sx={cssStyles.common_input_type}
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
														column.valueType === 'datetime' && (
															<LocalizationProvider dateAdapter={AdapterDayjs}>
																<DateTimePicker
																	className={cssStyles.date_pick_input_type}
																	value={
																		manualExample.values.find(
																			(element) =>
																				element.element === column.field
																		)?.value || ''
																	}
																	name={column.field}
																	onChange={(dateValue) =>
																		handleChangeManualExample({
																			dateValue,
																			field: column.field,
																		})
																	}
																	renderInput={(params) => (
																		<TextField {...params} helperText={null} />
																	)}
																	inputFormat="YYYY/MM/DD hh:mm A"
																/>
															</LocalizationProvider>
														)
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
															</Select>
														)
													}
													{
														// GENERIC FILE TYPE
														column.valueType === 'generic_file' && (
															<div style={styles().uploadContainer}>
																<StandardButton value="Upload video" />
																<div className={cssStyles.data_preview}>
																	Generic file preview
																</div>
																<div className={cssStyles.data_preview}>
																	Generic file name
																</div>
															</div>
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
																	/>
																) : (
																	<StandardButton
																		accept="image/.jpg, image/.png"
																		value={
																			manualExample.values.find(
																				(element) =>
																					element.element === column.field
																			)?.value || 'Upload image'
																		}
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
																	/>
																)}
																<div className={cssStyles.data_preview}>
																	{manualExample.values.find(
																		(element) =>
																			element.element === column.field
																	)?.thumbnailUrl ? (
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
																	) : (
																		`Can't load image preview`
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
													{
														// SHAPE TYPE
														column.valueType === 'shape' && 'shape'
													}
												</Box>
											</Box>
										)
								)}
							</Box>
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
								value="Create test"
								handleClick={handleSaveCreate}
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

CreateOrUpdateAITestingModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	allColumns: PropTypes.array,
	schemaState: PropTypes.object,
	type: PropTypes.string,
	step: PropTypes.number,
	currentRowId: PropTypes.string,
};
