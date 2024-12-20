import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { fabric } from 'fabric';

// Components
import {
	faEye,
	faEyeSlash,
	faDrawPolygon,
	faVectorSquare,
	faCheck,
	faXmark,
	faTrashCan,
	faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Box, Grid, Tooltip } from '@mui/material';
import SelectTargetModal from './SelectTargetModal';
import ChipShapesList from '../components/ChipShapesList';
import { Loader } from '../../../../../Components/Shared/Loader';
import StandardButton from '../../../../../Components/Shared/Buttons/StandardButton';

// Styles
import styles from './styles';

// Services
import { useWindowSize } from '../../../../../services/hooks/useWindowResize';
import {
	addMouseZoomEventHandler,
	addObjectModifiedEventHandler,
	addObjectMovingEventHandler,
	addObjectScalingEventHandler,
	addObjectSelectionCreatedEventHandler,
	addObjectSelectionUpdatedEventHandler,
	addObjectSelectionClearedEventHandler,
	onCancelPolygon,
	onPersistPolygon,
	onDeleteShape,
	addPanEventHandler,
	disableObjectSelection,
} from './ImageFileEditor.services';
import useKey from '../../../../../services/hooks/useKey';

// Redux
import {
	GET_EXAMPLE_FILE,
	GET_SHAPES,
} from '../../../../../redux/examples.slice';

// Consts
import { colors } from '../../../../../consts/colors';

export const ImageFileEditor = (props) => {
	const {
		currentElement,
		currentCellId,
		currentRowId,
		disabled,
		predictionsView = false,
		testView = false,
		handleOpenFileViewer,
	} = props;

	const dispatch = useDispatch();
	const windowSize = useWindowSize();
	const isAltPressed = useKey('Alt');

	const { editor, onReady } = useFabricJSEditor();

	// Global states
	const userState = useSelector((state) => state.user);
	const { outputs: outputsState } = useSelector((state) => state.schema.schema);
	const {
		isLoading: isLoadingState,
		examples: examplesState,
		currentExample: currentExampleState,
		currentShapes: currentShapesState,
	} = useSelector((state) => state.examples);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { currentPrediction: currentPredictionState } = useSelector(
		(state) => state.predictions
	);
	const { currentTest: currentTestState } = useSelector((state) => state.tests);

	// Local states
	const [openSelectTargetModal, setOpenSelectTargetModal] = useState(false);
	const [selectedOutputs, setSelectedOutputs] = useState([]);
	const [selectedOutput, setSelectedOutput] = useState({ id: '' });
	const [selectedShapeOutput, setSelectedShapeOutput] = useState({
		name: '',
		id: '',
	});
	const [selectedOutputValue, setSelectedOutputValue] = useState(null);

	const [isPolygonMode, setIsPolygonMode] = useState(false);
	const isDrawingPolygon = useRef(false);

	const [shapeVisibility, setShapeVisibility] = useState(true);
	const [currentElementShapes, setCurrentElementShapes] = useState([]);
	const [imageUrl, setImageUrl] = useState('');

	const [containerWidth, setContainerWidth] = useState(0);
	const [containerHeight, setContainerHeight] = useState(0);
	const [scalingFactor, setScalingFactor] = useState(1);
	const [zoom, setZoom] = useState(1);
	const [selectedShape, setSelectedShape] = useState('');

	const [isLoading, setIsLoading] = useState(false);
	const [isShapeUpdate, setIsShapeUpdate] = useState(false);

	const [imgWidth, setImgWidth] = useState(0);
	const [imgHeight, setImgHeight] = useState(0);

	const getShapes = async () => {
		await dispatch(
			GET_SHAPES({
				taskId: currentTaskState.uuid,
				exampleId: currentExampleState.uuid,
				userState,
				dispatch,
			})
		);
	};

	useEffect(() => {
		setIsLoading(true);
		getShapes();
	}, []);

	useEffect(() => {
		if (!testView && !predictionsView) {
			if (currentShapesState && currentShapesState.length > 0) {
				const tmpShapes = currentShapesState.filter(
					(shape) => shape.element === currentCellId
				);
				setCurrentElementShapes(tmpShapes);
			} else {
				setCurrentElementShapes([]);
			}
		} else if (
			testView &&
			!predictionsView &&
			currentTestState?.shapes?.length > 0
		) {
			const tmpShapes = currentTestState.shapes.filter(
				(shape) => shape.element === currentCellId
			);
			setCurrentElementShapes(tmpShapes);
		} else if (!testView && predictionsView)
			if (currentPredictionState?.shapes?.length > 0) {
				const tmpShapes = currentPredictionState.shapes.filter(
					(shape) => shape.element === currentCellId
				);
				setCurrentElementShapes(tmpShapes);
			} else {
				setCurrentElementShapes([]);
			}
	}, [testView, predictionsView, currentShapesState]);

	const getImage = async () => {
		const res = await dispatch(
			GET_EXAMPLE_FILE({
				taskId: currentTaskState.uuid,
				fileId: currentElement.value,
				userState,
				dispatch,
				thumbnail: false,
			})
		);
		if (res.payload.download_url) {
			setImageUrl(res.payload.download_url);
			setScalingFactor(1);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getImage();
	}, [currentElement]);

	function addTooltip({ object, text, score = null, color }) {
		object.tooltip = new fabric.Textbox(
			score ? `${text}-(${(score[0].value * 100).toFixed(2)}%)` : `${text}`,
			{
				left: object.left + object.width / 2,
				top: object.top,
				fontSize: 16,
				backgroundColor: color,
				padding: 5,
				selectable: false,
				evented: false,
				originX: 'center',
				originY: 'center',
			}
		);
		editor?.canvas.add(object.tooltip);
		object.tooltip.visible = false;
		object.tooltip.selectable = false;
		object.tooltip.id = `tooltip-${object.id}`;
		object.tooltip.uuid = `tooltip-${object.uuid}`;
	}

	useEffect(() => {
		if (currentElement && editor?.canvas.contextContainer !== null) {
			const canvasContainer = document.getElementById('canvas-container');
			setContainerWidth(canvasContainer.offsetWidth);
			setContainerHeight(canvasContainer.offsetHeight);

			editor?.canvas.off();
			if (editor && editor.canvas)
				if (isAltPressed) {
					editor.canvas.defaultCursor = 'move';
					editor?.canvas.setCursor('move');
				} else {
					editor.canvas.defaultCursor = 'default';
					editor?.canvas.setCursor('default');
				}

			addMouseZoomEventHandler({
				editor,
				setZoom,
				scalingFactor,
				containerWidth,
				containerHeight,
			});
			addObjectMovingEventHandler({ editor });
			addObjectScalingEventHandler({ editor });
			addObjectModifiedEventHandler({
				editor,
				fabric,
				scalingFactor,
				currentElementShapes,
				dispatch,
				taskId: currentTaskState.uuid,
				exampleId: currentExampleState.uuid,
				setSelectedShape,
				userState,
			});

			addPanEventHandler({ editor });
			if (isPolygonMode || isAltPressed || testView || predictionsView) {
				disableObjectSelection({ editor, isPolygonMode });
			} else {
				addObjectSelectionCreatedEventHandler({
					editor,
					setSelectedShape,
					currentElementShapes,
					isPolygonMode,
				});
				addObjectSelectionUpdatedEventHandler({
					editor,
					setSelectedShape,
					currentElementShapes,
				});
				addObjectSelectionClearedEventHandler({
					editor,
					setSelectedShape,
					setSelectedShapeOutput,
					currentElementShapes,
				});
			}

			fabric.Image.fromURL(imageUrl, (img) => {
				setImgWidth(img.width);
				setImgHeight(img.height);
				if (img.width > img.height) {
					setScalingFactor(containerWidth / img.width);
					img.scaleX = containerWidth / img.width;
					img.scaleY = containerWidth / img.width;
				} else {
					setScalingFactor(containerHeight / img.height);
					img.scaleX = containerHeight / img.height;
					img.scaleY = containerHeight / img.height;
				}

				if (
					canvasContainer.offsetWidth > 0 &&
					canvasContainer.offsetHeight > 0
				) {
					editor?.canvas.setWidth(canvasContainer.offsetWidth);
					editor?.canvas.setHeight(canvasContainer.offsetHeight);

					editor?.canvas.setBackgroundImage(img);
					editor?.canvas.renderAll();
				}
			});

			editor?.canvas.clear();

			if (shapeVisibility) {
				currentElementShapes.forEach((s, index) => {
					const polygon = new fabric.Polygon(
						s.polygon.map((p) => ({
							x: p.x * scalingFactor,
							y: p.y * scalingFactor,
						})),
						{
							id: s.id || index,
							uuid: s.uuid || index,
							stroke:
								outputsState.find(
									(anomaly) =>
										anomaly.name ===
										s?.outputs?.find(
											(output) => output.value > anomaly.threshold
										)?.element
								)?.color || 'red',
							strokeWidth: 0.5,
							fill: 'rgba(255,0,0,0.2)',
							transparentCorners: false,
							selectable: !predictionsView && !testView,
							hoverCursor: (predictionsView || testView) && 'cursor',
						}
					);
					polygon.setCoords();
					editor?.canvas.add(polygon);

					if (testView || predictionsView) {
						addTooltip({
							object: polygon,
							text:
								outputsState.find(
									(anomaly) =>
										anomaly.name ===
										s?.outputs?.find(
											(output) => output.value > anomaly.threshold
										)?.element
								)?.name || '',
							color:
								outputsState.find(
									(anomaly) =>
										anomaly.name ===
										s?.outputs?.find(
											(output) => output.value > anomaly.threshold
										)?.element
								)?.color || 'red',
							score: s.outputs.filter(
								(output) =>
									output.value >
									outputsState.find(
										(anomaly) =>
											anomaly.name ===
											s?.outputs?.find(
												(output) => output.value > anomaly.threshold
											)?.element
									).threshold
							),
						});

						// Event listeners for showing/hiding the tooltip
						editor?.canvas.on('mouse:over', (e) => {
							if (e?.target?.id === polygon.id) polygon.tooltip.visible = true;
							editor?.canvas.requestRenderAll();
						});

						editor?.canvas.on('mouse:out', () => {
							polygon.tooltip.visible = false;
							editor?.canvas.requestRenderAll();
						});
					} else {
						addTooltip({
							object: polygon,
							text: s?.outputs[0]?.value,
							color:
								outputsState.find(
									(anomaly) =>
										anomaly.name ===
										s?.outputs?.find(
											(output) => output.value > anomaly.threshold
										)?.element
								)?.color || 'red',
						});

						// Event listeners for showing/hiding the tooltip
						editor?.canvas.on('mouse:over', (e) => {
							if (e?.target?.id === polygon.id) {
								polygon.tooltip.visible = true;
								polygon.tooltip.selectable = false;
							}
							editor?.canvas.requestRenderAll();
						});

						editor?.canvas.on('mouse:out', () => {
							polygon.tooltip.visible = false;
							polygon.tooltip.selectable = false;
							editor?.canvas.requestRenderAll();
						});
					}
				});
			}
		}
	}, [
		currentElement,
		editor?.canvas,
		shapeVisibility,
		imageUrl,
		currentElementShapes,
		scalingFactor,
		isPolygonMode,
		windowSize,
		setSelectedShape,
		isAltPressed,
	]);

	useEffect(() => {
		if (!openSelectTargetModal && !isPolygonMode) setSelectedShapeOutput({});
	}, [openSelectTargetModal]);

	const handleCreateShape = () => {
		setOpenSelectTargetModal(true);
	};

	const handleEditShape = () => {
		setIsShapeUpdate(true);
		setOpenSelectTargetModal(true);
	};

	if (isLoadingState) return <Loader size="M" />;

	return (
		<>
			<Grid container>
				<Grid item xs={12} md={6}>
					<Box sx={styles().topMenu}>
						{!isPolygonMode && selectedShape === '' && !disabled && (
							<>
								<Tooltip title="Show/Hide shapes">
									<FontAwesomeIcon
										style={styles().topMenuIcon}
										icon={shapeVisibility ? faEye : faEyeSlash}
										onClick={() => setShapeVisibility(!shapeVisibility)}
									/>
								</Tooltip>
								<FontAwesomeIcon
									style={styles().topMenuIcon}
									icon={faVectorSquare}
									onClick={handleCreateShape}
								/>
								<FontAwesomeIcon
									style={styles().topMenuIcon}
									icon={faDrawPolygon}
									onClick={() => {
										setIsPolygonMode(true);
										handleCreateShape();
									}}
								/>
							</>
						)}
						{selectedShape !== '' && !disabled && (
							<div
								style={{
									display: 'flex',
									gap: 1,
									justifyContent: 'center',
									alignItems: 'center',
									color: colors.blue,
									margin: '0px 6px',
									padding: '0px 6px',
								}}
							>
								<div>Edit shape:</div>
								<Tooltip title="Confirm">
									<FontAwesomeIcon
										style={styles().topMenuIcon}
										icon={faCheck}
										onClick={() => {
											setSelectedShape('');
											setSelectedShapeOutput({});
										}}
									/>
								</Tooltip>
								<Tooltip title="Edit shape">
									<FontAwesomeIcon
										style={styles().topMenuIcon}
										icon={faPenToSquare}
										onClick={() => handleEditShape()}
									/>
								</Tooltip>
								<Tooltip title="Delete shape">
									<FontAwesomeIcon
										style={styles().topMenuIcon}
										icon={faTrashCan}
										onClick={() =>
											onDeleteShape({
												taskId: currentTaskState.uuid,
												exampleId: currentExampleState.uuid,
												currentShapesState,
												userState,
												dispatch,
												shapeId: selectedShape,
												setSelectedShape,
												currentRowId,
												currentExampleState,
												selectedShapeOutput,
											})
										}
									/>
								</Tooltip>
							</div>
						)}
						{isPolygonMode && !disabled && (
							<div
								style={{
									display: 'flex',
									color: colors.blue,
									margin: '0px 6px',
									padding: '0px 6px',
								}}
							>
								<div>Polygon shape:</div>
								<FontAwesomeIcon
									style={styles().topMenuIcon}
									icon={faCheck}
									onClick={() =>
										onPersistPolygon({
											setIsPolygonMode,
											isDrawingPolygon,
											currentElement,
											editor,
											scalingFactor,
											dispatch,
											currentRowId,
											selectedOutput,
											taskId: currentTaskState.uuid,
											exampleId: currentExampleState.uuid,
											userState,
											selectedOutputs,
											selectedShapeOutput,
											currentExampleState,
											examplesState,
										})
									}
								/>
								<FontAwesomeIcon
									style={styles().topMenuIcon}
									icon={faXmark}
									onClick={() =>
										onCancelPolygon({
											editor,
											setIsPolygonMode,
											isDrawingPolygon,
											setSelectedOutput,
										})
									}
								/>
							</div>
						)}
					</Box>
				</Grid>
				{!disabled && (
					<Grid
						item
						xs={12}
						md={6}
						sx={{
							display: 'flex',
							justifyContent: 'end',
							alignItems: 'center',
							fontSize: '0.8rem',
							color: colors.blue,
						}}
					>
						* Press Alt and drag to move arround
					</Grid>
				)}
			</Grid>
			{disabled && (
				<Grid container sx={{ marginBottom: '6px' }}>
					{predictionsView && (
						<Grid
							item
							xs={12}
							md={6}
							sx={{
								display: 'flex',
								alignItems: 'center',
								fontSize: '0.8rem',
								color: colors.blue,
							}}
						>
							<StandardButton
								value="Back to table"
								handleClick={handleOpenFileViewer}
							/>
						</Grid>
					)}
					<Grid
						item
						xs={12}
						md={12}
						sx={{
							display: 'flex',
							justifyContent: 'end',
							alignItems: 'center',
							fontSize: '0.8rem',
							color: colors.blue,
						}}
					>
						* Press Alt and drag to move arround
					</Grid>
				</Grid>
			)}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					outline: `1px solid ${colors.blue}`,
					cursor: isAltPressed ? 'pointer' : 'auto',
				}}
			>
				<Box
					id="canvas-container"
					sx={{
						minHeight: '500px',
						width: '100%',
						cursor: isAltPressed ? 'pointer' : 'auto',
					}}
				>
					{!isLoading ? (
						<FabricJSCanvas onReady={onReady} />
					) : (
						<Loader size="M" />
					)}
				</Box>
			</div>
			{!isLoading && (
				<ChipShapesList
					editor={editor}
					currentCellId={currentCellId}
					selectedShape={selectedShape}
					setSelectedShape={setSelectedShape}
					currentElementShapes={currentElementShapes}
					imageUrl={imageUrl}
					onDeleteShapeProps={{
						taskId: currentTaskState.uuid,
						exampleId: currentExampleState.uuid,
						currentShapesState,
						userState,
						dispatch,
						shapeId: selectedShape,
						setSelectedShape,
						currentRowId,
						currentExampleState,
						selectedShapeOutput,
						setIsLoading,
					}}
				/>
			)}
			{openSelectTargetModal && (
				<SelectTargetModal
					onClose={setOpenSelectTargetModal}
					open={openSelectTargetModal}
					selectedShape={selectedShape}
					selectedOutput={selectedOutput}
					setSelectedOutput={setSelectedOutput}
					selectedShapeOutput={selectedShapeOutput}
					setSelectedShapeOutput={setSelectedShapeOutput}
					selectedOutputValue={selectedOutputValue}
					setSelectedOutputValue={setSelectedOutputValue}
					selectedOutputs={selectedOutputs}
					setSelectedOutputs={setSelectedOutputs}
					editor={editor}
					zoom={zoom}
					scalingFactor={scalingFactor}
					containerWidth={containerWidth}
					containerHeight={containerHeight}
					currentElement={currentElement}
					setCurrentElementShapes={setCurrentElementShapes}
					isPolygonMode={isPolygonMode}
					setIsPolygonMode={setIsPolygonMode}
					isDrawingPolygon={isDrawingPolygon}
					fabric={fabric}
					setShapeVisibility={setShapeVisibility}
					currentRowId={currentRowId}
					taskId={currentTaskState.uuid}
					exampleId={currentExampleState.uuid}
					accessToken
					isShapeUpdate={isShapeUpdate}
					setIsShapeUpdate={setIsShapeUpdate}
					imgWidth={imgWidth}
					imgHeight={imgHeight}
				/>
			)}
		</>
	);
};

ImageFileEditor.propTypes = {
	currentElement: PropTypes.object,
	currentCellId: PropTypes.string,
	currentRowId: PropTypes.string,
	disabled: PropTypes.bool,
	handleOpenFileViewer: PropTypes.func,
	predictionsView: PropTypes.bool,
	testView: PropTypes.bool,
};
