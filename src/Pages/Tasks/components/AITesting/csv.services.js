/* eslint-disable no-await-in-loop */
import Papa from 'papaparse';

// Redux
import { CREATE_TASK_FILE } from '../../../../redux/tasks.slice';

// Alerts
import { ADD_ALERT, REMOVE_ALERT } from '../../../../redux/alerts.slice';

// Services
import { newLog } from '../../../../services/logger';

export const parseCSVFile = async ({
	file,
	allColumns,
	schemaState,
	dispatch,
	setIsLoadingFile,
	setFileToUpload,
}) => {
	const parseFile = async (file) =>
		new Promise((resolve) => {
			Papa.parse(file, {
				header: true,
				delimiter: ',',
				newline: '\r\n',
				dynamicTyping: true,
				preview: 100,
				skipEmptyLines: true,
				complete: (results) => {
					if (results.errors.length > 0) {
						dispatch(
							ADD_ALERT({
								type: 'error',
								message: `Error parsing csv file: ${results.errors[0].message}`,
							})
						);
						setFileToUpload(null);
						setIsLoadingFile(false);
						return;
					}
					if (results.data.length === 0) {
						dispatch(
							ADD_ALERT({
								type: 'warning',
								message: 'No data found in csv file.',
							})
						);
						setTimeout(() => {
							dispatch(REMOVE_ALERT('No data found in csv file.'));
						}, 2000);
						setFileToUpload(null);
						setIsLoadingFile(false);
						return;
					}

					let headersMismatch = false;

					const tmpColumns = allColumns.filter(
						(column) =>
							column.fieldType !== 'output' &&
							column.fieldType !== 'aimodel' &&
							column.fieldType !== 'status'
					);
					if (Object.keys(results.data[0]).length !== tmpColumns.length) {
						headersMismatch = true;
					}

					if (headersMismatch) {
						dispatch(
							ADD_ALERT({
								type: 'error',
								message: 'Headers do not match schema.',
							})
						);
						setFileToUpload(null);
						setIsLoadingFile(false);
						return;
					}

					const headers = {};
					Object.keys(results.data[0]).forEach((key) => {
						headers[key] = key;
					});

					resolve(
						results.data.map((data) => {
							let tmp = {};
							Object.keys(data).forEach((key) => {
								if (
									data[key] !== '' &&
									data[key] !== null &&
									data[key] !== undefined
								) {
									// INPUTS
									if (
										schemaState &&
										schemaState.inputs &&
										schemaState.inputs.length > 0 &&
										schemaState.inputs.find((input) => input.name === key)
									) {
										schemaState.inputs.forEach((input) => {
											if (input.name === key) {
												if (input.type === 'float') {
													tmp = {
														...tmp,
														[key]: Number(data[key]),
													};
												} else if (
													(input.type === 'text' ||
														input.type === 'category') &&
													typeof data[key] === 'boolean'
												) {
													tmp = { ...tmp, [key]: String(data[key]) };
												} else tmp = { ...tmp, [key]: data[key] };
											}
										});
									}

									// METADATA
									if (
										schemaState &&
										schemaState.metadata &&
										schemaState.metadata.length > 0 &&
										schemaState.metadata.find((meta) => meta.name === key)
									) {
										schemaState.metadata.forEach((meta) => {
											if (meta.name === key) {
												if (meta.type === 'float') {
													tmp = {
														...tmp,
														[key]: Number(data[key].replace(',', '.')),
													};
												} else if (
													(meta.type === 'text' || meta.type === 'category') &&
													typeof data[key] === 'boolean'
												) {
													tmp = { ...tmp, [key]: String(data[key]) };
												} else tmp = { ...tmp, [key]: data[key] };
											}
										});
									}

									// OUTPUTS
									if (
										schemaState &&
										schemaState.outputs &&
										schemaState.outputs.length > 0 &&
										schemaState.outputs.find(
											(output) => output.name === key.split('-')[1]
										)
									) {
										const newKey = key.split('-')[1];
										schemaState.outputs.forEach((output) => {
											if (output.name === newKey) {
												if (output.type === 'float') {
													tmp = {
														...tmp,
														[key]: Number(data[key].replace(',', '.')),
													};
												} else if (
													(output.type === 'text' ||
														output.type === 'category') &&
													typeof data[key] === 'boolean'
												) {
													tmp = { ...tmp, [key]: String(data[key]) };
												} else tmp = { ...tmp, [key]: data[key] };
											}
										});
									}
								}
							});
							return tmp;
						})
					);
				},
			});
		});

	const parsedData = await parseFile(file);

	return parsedData;
};

export const createCSVTemplate = (allColumns) => {
	const tmpHeaders = [];
	allColumns.forEach((column) => {
		if (
			column.field !== 'status' &&
			column.field !== 'aimodel' &&
			column.fieldType !== 'output'
		) {
			tmpHeaders.push({
				...tmpHeaders[0],
				key: column.field,
				label: column.field,
			});
		}
	});

	const csvReport = {
		headers: tmpHeaders,
		filename: 'CSV Template.csv',
	};

	return csvReport;
};

async function requestFileSystemAccess() {
	try {
		const handle = await window.showDirectoryPicker();
		return handle;
	} catch (error) {
		console.error('Error requesting file system access:', error);
	}
}

async function matchAndRetrieveFile({ file, directoryHandle, rowNum, errors }) {
	try {
		const fileHandle = await directoryHandle.getFileHandle(file, {
			create: false,
		});
		return fileHandle.getFile();
	} catch (error) {
		// https://developer.mozilla.org/en-US/docs/Web/API/DOMError errors list
		switch (error.name) {
			case 'NotFoundError':
				errors.push(
					`At example ${
						rowNum + 1
					}: File ${file} not found (check if file name, extension or route are correct).`
				);
				break;
			default:
				break;
		}
	}
}

const matchAndRetrieveSubfolder = async ({
	file,
	directoryHandle,
	rowNum,
	errors,
}) => {
	const subFolders = file.split('/');

	if (subFolders.length > 1) {
		const subFolderName = subFolders.shift();
		for await (const entry of directoryHandle.values()) {
			if (entry.kind === 'directory' && entry.name === subFolderName) {
				return matchAndRetrieveSubfolder({
					file: subFolders.join('/'),
					directoryHandle: entry,
					rowNum,
					errors,
				});
			}
		}
	} else {
		return matchAndRetrieveFile({
			file,
			directoryHandle,
			rowNum,
			errors,
		});
	}
};

export const getFilesFromParsedCSV = async (
	parsedData,
	schemaState,
	dispatch,
	currentTaskState,
	userState,
	setUploadStatus
) => {
	const errors = [];
	const modifiedRows = [];
	let directoryHandle;

	// Check if schema have type file elements
	const checkFilesInInputs = schemaState.inputs
		.map((element) => element.type.split('_')[1] === 'file')
		.includes(true);
	const checkFilesInOutputs = schemaState.outputs
		.map((element) => element.type.split('_')[1] === 'file')
		.includes(true);
	const isFileTypeInSchema = checkFilesInInputs || checkFilesInOutputs;
	if (isFileTypeInSchema) directoryHandle = await requestFileSystemAccess();

	setUploadStatus(`Getting examples info`);
	await Promise.all(
		parsedData.map(async (row, rowNum) => {
			let modifiedRow = row;
			await Promise.all(
				Object.keys(modifiedRow.values).map(async (key) => {
					// Initializers and resets
					let responseData = {};
					let tmpFile = null;
					const columnName = modifiedRow.values[key].element;
					const cellValue = modifiedRow.values[key].value;
					let usedFor = null;

					// Select usedFor (input, metadata, output)
					if (
						schemaState &&
						schemaState.inputs &&
						schemaState.inputs.length > 0 &&
						schemaState.inputs.find((element) => element.name === columnName)
					) {
						usedFor = 'input';
					}
					if (
						schemaState &&
						schemaState.metadata &&
						schemaState.metadata.length > 0 &&
						schemaState.metadata.find((element) => element.name === columnName)
					) {
						usedFor = 'metadata';
					}
					if (
						schemaState &&
						schemaState.outputs &&
						schemaState.outputs.length > 0 &&
						schemaState.outputs.find((element) => element.name === columnName)
					) {
						usedFor = 'output';
					}

					// Get schema element
					const schemaElement = schemaState.inputs.find(
						(element) => element.name === columnName
					);

					// Check if is a file
					if (
						schemaElement &&
						(schemaElement.type === 'generic_file' ||
							schemaElement.type === 'document_file' ||
							schemaElement.type === 'image_file' ||
							schemaElement.type === 'video_file' ||
							schemaElement.type === 'audio_file')
					) {
						// Match file name in file directory
						if (!cellValue.includes('/')) {
							try {
								tmpFile = await matchAndRetrieveFile({
									file: cellValue,
									directoryHandle,
									rowNum,
									errors,
								});
							} catch (error) {
								newLog(error);
								return;
							}
						} else {
							try {
								tmpFile = await matchAndRetrieveSubfolder({
									file: cellValue,
									directoryHandle,
									rowNum,
									errors,
								});
							} catch (error) {
								newLog(error);
								return;
							}
						}

						let res = null;

						if (tmpFile && !tmpFile.errors) {
							try {
								res = await dispatch(
									CREATE_TASK_FILE({
										taskId: currentTaskState.id,
										file: tmpFile,
										userState,
										dispatch,
										usedFor,
										fileType: schemaElement.type.split('_')[0],
									})
								);

								if (res && res.payload && res.payload.id) {
									responseData = {
										...modifiedRow,
										values: modifiedRow.values.map((val) => {
											if (val.element === columnName)
												return {
													element: columnName,
													value: res.payload.id,
												};
											return val;
										}),
									};
									// Modify the cell value based on the response
									modifiedRow = responseData;
								}
							} catch (error) {
								newLog(error);
							}
						}
					}
				})
			);
			modifiedRows.push(modifiedRow);
		})
	);
	if (errors.length > 0) return { errors };
	return modifiedRows;
};
