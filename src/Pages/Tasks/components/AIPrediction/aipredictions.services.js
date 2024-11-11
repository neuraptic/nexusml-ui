// Components
import { Box } from '@mui/material';
import { CustomTooltip } from '../../../../Components/Shared/CustomTooltip';

// Services
import { elementTypeToIconMap } from '../../../../services/tasks';
import { createCell } from '../Examples/cellCreation.services';
import requestFactory from '../../../../services/request.factory';

// Alerts
import { ADD_ALERT } from '../../../../redux/alerts.slice';

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
	const res = await requestFactory({
		type: 'get',
		url: `/schema/${nodeTypeForRequest}/${id}/categories`,
	});
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
	predictionsState,
	categoriesState,
	imagesBufferState,
	documentsBufferState,
	documentSelectedNumPages,
	onDocumentLoadSuccess,
}) => {
	const tmpCols = [];

	if (Object.keys(schemaState) && Object.keys(schemaState).length > 0) {
		// AI MODELS
		tmpCols.push({
			fieldType: 'aimodel',
			field: 'aimodel',
			sortable: false,
			disableColumnMenu: true,
			headerClassName: 'aimodel-column',
			cellClassName: 'aimodel-column',
			width: 100,
			renderCell: (params) => {
				<div>{params.row.aimodel}</div>;
			},
			renderHeader: () => <div>AI Model</div>,
		});

		// ITERATE EACH PREDICTION
		Object.keys(schemaState).forEach((type) => {
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
									let sorted = [];
									const tmp = predictionsState
										.find((prediction) => prediction.uuid === params.row.id)
										?.outputs.find((out) => out.element === output.name)
										?.value?.scores;
									if (tmp) {
										const sortable = [];

										Object.keys(tmp).forEach((score) => {
											sortable.push([score, tmp[score]]);
										});

										sorted = sortable.sort((a, b) => b[1] - a[1]).slice(0, 5);
									}
									return tmp ? (
										<CustomTooltip
											placement="left"
											title={
												<div
													style={{ display: 'flex', flexDirection: 'column' }}
												>
													{sorted.map((value) => (
														<div>
															{value[0]} - ({(value[1] * 100).toFixed(2)}%)
														</div>
													))}
												</div>
											}
										>
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
										</CustomTooltip>
									) : (
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
											elementTypeToIconMap[output.type]('targets')}
										<div>{output.display_name || output.name}</div>
									</Box>
								</CustomTooltip>
							),
							valueGetter: (params) => {
								if (predictionsState && predictionsState.length > 0)
									return params.row[output.id];
							},
						});
				});
			}

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
							width: 125,
							renderHeader: () => (
								<CustomTooltip title={input.display_name || input.name}>
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
										{input.type && elementTypeToIconMap[input.type]('input')}
										<div>{input.display_name || input.name}</div>
									</Box>
								</CustomTooltip>
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
										</div>
									);
								}
							},
							valueGetter: (params) => {
								if (predictionsState && predictionsState.length > 0)
									return params.row[input.id];
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
										<div>{meta.display_name || meta.name}</div>
									</Box>
								</CustomTooltip>
							),
							valueGetter: (params) => {
								if (predictionsState && predictionsState.length > 0)
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
	predictionsState,
	aimodels,
}) => {
	const tmpRows = [];
	let tmpRowData = {};

	if (
		predictionsState &&
		predictionsState.length > 0 &&
		Object.keys(schemaState) &&
		Object.keys(schemaState).length > 0
	) {
		predictionsState.forEach((prediction) => {
			if (
				prediction &&
				((prediction.invalid_data &&
					Array.isArray(prediction.invalid_data) &&
					prediction.invalid_data.length === 0) ||
					!prediction.invalid_data)
			) {
				tmpRowData = {
					...tmpRowData,
					id: prediction.uuid || prediction.id,
					aimodel:
						aimodels?.AIModels?.find(
							(model) => model.id === prediction.ai_model
						)?.version || '',
				};

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
							tmpRowData = {
								...tmpRowData,
								[tmp.id]: output.value.category || output.value || '',
							};
					});
				}

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

				// METADATA
				if (
					prediction &&
					prediction.metadata &&
					prediction.metadata.length > 0
				) {
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
			}
		});
	}

	setRows(tmpRows);
};

export const createValidatedTestingObjects = (
	parsedData,
	schemaState,
	dispatch
) => {
	let tmp = {};
	let result = [];

	const createData = (element) => {
		tmp = {
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
