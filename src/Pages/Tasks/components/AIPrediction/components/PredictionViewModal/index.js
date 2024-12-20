/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// Components
import { Box, Fade, Grid } from '@mui/material';
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';

// Consts
import { colors } from '../../../../../../consts/colors';

// Services
import { getElementToEdit } from '../../../Examples/elementEditor.service';
import { elementTypeToIconMap } from '../../../../../../services/tasks';
import { createCell } from '../../../Examples/cellCreation.services';

export const PredictionViewModal = (props) => {
	const {
		open,
		setOpen,
		currentRowId,
		setCurrentRowId,
		currentCellId,
		setCurrentCellId,
		allColumns,
		rows,
		classes,
	} = props;

	// Global states
	const { currentPrediction: currentPredictionState } = useSelector(
		(state) => state.predictions
	);
	const { schema: schemaState } = useSelector((state) => state.schema);
	const {
		imagesBuffer: imagesBufferState,
		documentsBuffer: documentsBufferState,
		documentsBufferIsLoading: onDocumentLoadSuccess,
	} = useSelector((state) => state.examples);

	// Local states
	const [currentRow, setCurrentRow] = useState({});
	const [currentElement, setCurrentElement] = useState({});
	const [currentElementValueType, setCurrentElementValueType] = useState('');

	// Modals
	const [openFileViewerModal, setOpenFileViewerModal] = useState(false);

	useEffect(() => {}, [allColumns]);

	useEffect(() => {
		setCurrentRow(rows.find((row) => row.id === currentRowId));
	}, [currentRowId]);

	useEffect(() => {}, [currentRow]);

	useEffect(() => {
		setCurrentElement({});
		if (Object.keys(schemaState).length > 0 && currentCellId !== '') {
			// Check inputs
			if (schemaState.inputs && schemaState.inputs.length > 0) {
				schemaState.inputs.forEach((input) => {
					if (input.name === currentCellId) {
						setCurrentElementValueType(input.type);
					}
				});
			}

			// Check metadata
			if (schemaState.metadata && schemaState.metadata.length > 0) {
				schemaState.metadata.forEach((meta) => {
					if (meta.name === currentCellId) {
						setCurrentElementValueType(meta.type);
					}
				});
			}

			// Check outputs
			if (schemaState.outputs && schemaState.outputs.length > 0) {
				schemaState.outputs.forEach((output) => {
					if (output.name === currentCellId) {
						setCurrentElementValueType('');
					}
				});
			}

			if (
				currentPredictionState.inputs &&
				currentPredictionState.inputs.find(
					(input) => input.element === currentCellId
				)
			) {
				currentPredictionState.inputs.forEach((input) => {
					if (input.element === currentCellId) setCurrentElement(input);
				});
			}

			if (
				currentPredictionState.metadata &&
				currentPredictionState.metadata.find(
					(meta) => meta.element === currentCellId
				)
			)
				currentPredictionState.metadata.forEach((meta) => {
					if (meta.element === currentCellId) setCurrentElement(meta);
				});
		}
	}, [currentCellId, currentRowId]);

	const handleOpenFileViewer = (columnId) => {
		setCurrentCellId(columnId);
		setOpenFileViewerModal(!openFileViewerModal);
	};

	const handleClose = () => {
		setCurrentCellId('');
		setCurrentRowId('');
		setOpen(false);
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Prediction info:"
			maxWidth={openFileViewerModal ? 'xl' : 'md'}
			content={
				<Grid
					container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'start',
					}}
				>
					<Grid container>
						<Grid
							item
							xs={12}
							md={openFileViewerModal ? 8 : 6}
							sx={{ offsetY: 'auto', transition: 'all 1s' }}
						>
							{openFileViewerModal ? (
								<Fade
									in={openFileViewerModal ? true : undefined}
									out={!openFileViewerModal ? true : undefined}
									timeout={500}
								>
									<Grid container xs={11}>
										<Grid
											item
											xs={12}
											sx={{
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'start',
												paddingBottom: '12px',
											}}
										>
											{
												// DOCUMENT FILE TYPE
												currentElementValueType === 'document_file' &&
													currentElement &&
													getElementToEdit[currentElementValueType]({
														currentElement,
														currentCellId,
														currentRowId,
														allColumns,
														disabled: true,
														handleOpenFileViewer,
													})
											}
											{
												// IMAGE TYPE
												currentElementValueType === 'image_file' &&
													currentElement &&
													getElementToEdit[currentElementValueType]({
														currentElement,
														currentCellId,
														currentRowId,
														allColumns,
														disabled: true,
														handleOpenFileViewer,
													})
											}
										</Grid>
									</Grid>
								</Fade>
							) : (
								<table>
									{allColumns.map(
										(column) =>
											column.fieldType === 'input' && (
												<tr>
													<td
														style={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'left',
															padding: '6px',
															gap: 3,
														}}
													>
														{elementTypeToIconMap[column.valueType]('input')}
														{column.name}
													</td>
													<td
														style={{
															textAlign: 'center',
															padding: '6px',
															height: '100%',
														}}
													>
														{column.valueType === 'image_file' ? (
															<Box
																onClick={() =>
																	handleOpenFileViewer(column.name)
																}
																sx={{ cursor: 'pointer', maxWidth: '100px' }}
															>
																{createCell[column.valueType]({
																	classes,
																	cellValue: currentRow[column.id],
																	cellName: column.field,
																	imagesBufferState,
																	documentsBufferState,
																	onDocumentLoadSuccess,
																})}
															</Box>
														) : column.valueType === 'document_file' ? (
															<StandardButton
																value="View document"
																handleClick={() =>
																	handleOpenFileViewer(column.name)
																}
															/>
														) : (
															currentRow[column.id]
														)}
													</td>
												</tr>
											)
									)}
								</table>
							)}
						</Grid>
						<Grid
							item
							xs={12}
							md={openFileViewerModal ? 4 : 6}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'start',
								transition: 'all 1s',
							}}
						>
							<h2
								style={{
									display: 'flex',
									width: '100%',
									justifyContent: 'center',
								}}
							>
								Anomaly detected!
							</h2>
							<h4 style={{ padding: '6px', margin: 0 }}>Anomalies:</h4>
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									marginBottom: '12px',
								}}
							>
								{currentPredictionState &&
									currentPredictionState.outputs &&
									currentPredictionState.outputs.length > 0 &&
									currentPredictionState.outputs.map((output) => (
										<button
											key={uuidv4()}
											type="button"
											style={{
												backgroundColor: colors.lightBlueButton,
												maxWidth: '30%',
												padding: '6px 12px',
												borderRadius: '12px',
												margin: '6px',
												cursor: 'pointer',
												border: 'none',
												height: '30px',
											}}
										>
											{output.value.category}
										</button>
									))}
							</div>

							<h4 style={{ padding: '6px', margin: 0 }}>Probabilities:</h4>
							{currentPredictionState.outputs.map((output) => (
								<table style={{ width: '100%' }}>
									{Object.keys(output.value.scores).map((key) => (
										<tr>
											<td
												style={{
													borderBottom: `1px solid ${colors.gray}`,
													padding: '6px',
												}}
											>
												{key}
											</td>
											<td
												style={{
													display: 'flex',
													justifyContent: 'right',
													borderBottom: `1px solid ${colors.gray}`,
													padding: '6px',
												}}
											>
												{(output.value.scores[key] * 100).toFixed(2)}%
											</td>
										</tr>
									))}
								</table>
							))}
						</Grid>
					</Grid>
				</Grid>
			}
			actions={
				<div
					style={{
						display: 'flex',
						width: '100%',
						justifyContent: 'right',
						gap: '12px',
					}}
				>
					<StandardButton value="Add as example" type="filled" close />
					<StandardButton value="Close" handleClick={handleClose} close />
				</div>
			}
		/>
	);
};

PredictionViewModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	currentRowId: PropTypes.string,
	setCurrentRowId: PropTypes.func,
	currentCellId: PropTypes.string,
	setCurrentCellId: PropTypes.func,
	allColumns: PropTypes.array,
	rows: PropTypes.array,
	classes: PropTypes.array,
};
