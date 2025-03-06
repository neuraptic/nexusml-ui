/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Grid } from '@mui/material';
import StandardButton from '../../../../../Components/Shared/Buttons/StandardButton';
import SelectTimeSeriesTargetModal from './SelectTimeSeriesTargetModal';
import ChipSlicesList from '../components/ChipSlicesList';
import { Loader } from '../../../../../Components/Shared/Loader';

// Consts
import { colors } from '../../../../../consts/colors';

// Services
import { getTextColorBasedOnBackgroundColor } from '../../../../../services/getTextColorBasedOnBackgroundColor';

// Redux
import { CREATE_SLICE } from '../../../../../redux/examples.slice';

export const TimeSerieEditor = (props) => {
	const {
		currentElement,
		currentCellId,
		currentValue,
		testView = false,
		predictionsView = false,
		handleOpenFileViewer,
	} = props;

	const dispatch = useDispatch();
	const mainChart = useRef();

	// Global states
	const userState = useSelector((state) => state.user);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { isLoading: isLoadingState } = useSelector((state) => state.examples);
	const { uuid: currentExampleUUID, slices: exampleSlicesState } = useSelector(
		(state) => state.examples.currentExample
	);
	const { slices: testSlicesState } = useSelector(
		(state) =>
			Object.keys(state.tests.currentTest).length > 0 && state.tests.currentTest
	);
	const { slices: predictionSlicesState } = useSelector(
		(state) =>
			Object.keys(state.predictions.currentPrediction).length > 0 &&
			state.predictions.currentPrediction
	);
	const { outputs: outputsState } = useSelector((state) => state.schema.schema);

	// Local states
	const [annotations, setAnnotations] = useState([]);
	const [addPointEnabled, setAddPointEnabled] = useState(false);
	const [addRangeEnabled, setAddRangeEnabled] = useState(false);

	const [selectedPoint, setSelectedPoint] = useState(null);
	const [selectedRange, setSelectedRange] = useState(null);

	const [selectedSlice, setSelectedSlice] = useState(null);
	const [selectedOutputs, setSelectedOutputs] = useState([]);

	// Modals
	const [openSelectTargetModal, setOpenSelectTargetModal] = useState(false);

	// Mouse events states
	const [mouseUp, setMouseUp] = useState(false);

	// Set chart config
	const [state, setState] = useState({
		series: [
			{
				data: [],
			},
		],
		options: {
			chart: {
				id: 'mainChart',
				type: 'line',
				height: 300,
				selection: {
					enabled: true,
				},
				pan: {
					enabled: false,
				},
				zoom: {
					enabled: true,
					type: 'x',
					resetIcon: {
						offsetX: -10,
						offsetY: 0,
						fillColor: '#fff',
						strokeColor: '#37474F',
					},
					selection: {
						background: '#90CAF9',
						border: '#0D47A1',
					},
				},
				toolbar: {
					show: true,
					offsetY: '-10',
					tools: {
						zoom: false,
						zoomin: true,
						zoomout: true,
						pan: true,
						download: false,
						reset: false,
						selection:
							!testView &&
							!predictionsView &&
							'<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>',
					},
				},
				tooltip: {
					enabled: true,
					intersect: true,
					shared: false,
				},
				markers: {
					size: 1,
				},
				events: {
					click: (e, chartContext, config) => {
						if (e.type === 'mouseup') setMouseUp(true);

						if (e.target.title === 'Selection') {
							setAddPointEnabled(false);
							setOpenSelectTargetModal(true);
							setAddRangeEnabled(true);
							setSelectedRange(null);
						}

						if (e.target.classList?.contains('addPoint')) {
							setAddRangeEnabled(false);
							setOpenSelectTargetModal(true);
							setAddPointEnabled(true);
							setSelectedRange(null);
						}

						if (config.dataPointIndex)
							setSelectedPoint(Math.round(config.dataPointIndex + 1));
					},
					selection: (context, { xaxis }) => {
						setSelectedRange(xaxis);
					},
				},
			},
			annotations: { xaxis: [] },
			colors: ['#546E7A'],
			stroke: {
				width: 3,
			},
			dataLabels: {
				enabled: false,
			},
			fill: {
				opacity: 1,
			},
			markers: {
				size: 0,
			},
			xaxis: {
				type: 'numeric',
			},
		},
	});

	// Add data to chart
	useEffect(() => {
		if (currentElement?.value?.length > 0)
			setState({
				...state,

				series: [
					{
						data: currentElement.value,
					},
				],
				options: {
					...state.options,
					annotations: { xaxis: annotations },
				},
			});
	}, [currentElement, annotations]);

	// Add annotations to chart
	useEffect(() => {
		if (
			(exampleSlicesState?.length > 0 &&
				exampleSlicesState.find((slice) => slice.element === currentCellId)) ||
			(testSlicesState?.length > 0 &&
				testSlicesState.find((slice) => slice.element === currentCellId)) ||
			(predictionSlicesState?.length > 0 &&
				predictionSlicesState.find((slice) => slice.element === currentCellId))
		) {
			let tmpSlices = [];

			// If examples view
			if (!testView && !predictionsView)
				tmpSlices = exampleSlicesState.filter(
					(slice) => slice.element === currentCellId
				);

			// If testing view
			if (testView)
				tmpSlices = testSlicesState.filter(
					(slice) => slice.element === currentCellId
				);

			// If predictions view
			if (predictionsView)
				tmpSlices = predictionSlicesState.filter(
					(slice) => slice.element === currentCellId
				);

			if (tmpSlices?.length > 0 && outputsState?.length > 0) {
				setAnnotations(
					tmpSlices.map((slice) => {
						if (selectedSlice === slice.uuid) {
							if (slice.start_index === slice.end_index)
								return {
									x: slice.start_index,
									fillColor: colors.buttonPrimaryBg,
									opacity: 0.4,
									label: {
										id: 3,
										borderColor: colors.buttonPrimaryBg,
										style: {
											fontSize: '12px',
											color: getTextColorBasedOnBackgroundColor(
												colors.buttonPrimaryBg
											),
											background: colors.buttonPrimaryBg,
										},
										offsetY: -10,
										text: `${
											slice.outputs?.length > 0 && slice.outputs[0]?.element
										}${
											(testView || predictionsView) &&
											`-${(
												slice.outputs?.length > 0 &&
												slice.outputs[0].value * 100
											).toFixed(2)}%}`
										}`,
									},
								};
							return {
								x: slice.start_index,
								x2: slice.end_index,
								fillColor: colors.buttonPrimaryBg,
								opacity: 0.4,
								label: {
									id: 3,
									borderColor: colors.buttonPrimaryBg,
									style: {
										fontSize: '12px',
										color: getTextColorBasedOnBackgroundColor(
											colors.buttonPrimaryBg
										),
										background: colors.buttonPrimaryBg,
									},
									offsetY: -10,
									text: `${
										slice.outputs?.length > 0 && slice.outputs[0]?.element
									}${
										(testView || predictionsView) &&
										`-${(
											slice.outputs?.length > 0 && slice.outputs[0].value * 100
										).toFixed(2)}%}`
									}`,
								},
							};
						}
						if (slice.start_index === slice.end_index)
							return {
								x: slice.start_index,
								fillColor: colors.lightRed,
								opacity: 0.4,
								label: {
									id: 3,
									borderColor: colors.lightRed,
									style: {
										fontSize: '12px',
										color: getTextColorBasedOnBackgroundColor(colors.lightRed),
										background: colors.lightRed,
									},
									offsetY: -10,
									text: `${
										slice.outputs?.length > 0 && slice.outputs[0]?.element
									}${
										(testView || predictionsView) &&
										`-${(
											slice.outputs?.length > 0 && slice.outputs[0].value * 100
										).toFixed(2)}%}`
									}`,
								},
							};
						return {
							x: slice.start_index,
							x2: slice.end_index,
							fillColor: colors.lightRed,
							opacity: 0.4,
							label: {
								id: 3,
								borderColor: colors.lightRed,
								style: {
									fontSize: '12px',
									color: getTextColorBasedOnBackgroundColor(colors.lightRed),
									background: colors.lightRed,
								},
								offsetY: -10,
								text: `${
									slice.outputs?.length > 0 && slice.outputs[0]?.element
								}${
									(testView || predictionsView) &&
									`-${(
										slice.outputs?.length > 0 && slice.outputs[0].value * 100
									).toFixed(2)}%}`
								}`,
							},
						};
					})
				);
			}
		}
	}, [
		exampleSlicesState,
		testSlicesState,
		predictionSlicesState,
		selectedSlice,
	]);

	const handleAddAnnotation = async () => {
		let newSlice = {};

		if (addPointEnabled)
			newSlice = {
				element: currentCellId,
				end_index: selectedPoint,
				outputs: selectedOutputs?.map((output) => ({
					element: output.name,
					value: output.value,
				})),
				start_index: selectedPoint,
			};

		if (addRangeEnabled && selectedRange)
			newSlice = {
				element: currentCellId,
				end_index: Math.round(selectedRange.max),
				outputs: selectedOutputs?.map((output) => ({
					element: output.name,
					value: output.value,
				})),
				start_index: Math.round(selectedRange.min),
			};

		if (newSlice && Object.keys(newSlice).length > 0)
			await dispatch(
				CREATE_SLICE({
					taskId: currentTaskState.uuid,
					exampleId: currentExampleUUID,
					userState,
					dispatch,
					newSlice,
				})
			);

		setSelectedSlice(null);
		setAddPointEnabled(false);
		setSelectedPoint(null);
	};

	useEffect(() => {
		if (mouseUp && selectedPoint && (addPointEnabled || addRangeEnabled)) {
			handleAddAnnotation();
		}
		setMouseUp(false);
		setSelectedRange(null);
	}, [mouseUp]);

	const handleChangeMouseUp = () => {
		if (!mouseUp) setMouseUp(true);
		else setMouseUp(false);
	};

	if (isLoadingState) return <Loader size="L" />;

	if (currentValue?.value || currentElement?.value)
		return (
			<>
				{predictionsView && (
					<Grid
						item
						xs={12}
						sx={{
							display: 'flex',
							alignItems: 'center',
							fontSize: '0.8rem',
							color: colors.blue,
							marginBottom: '2rem',
						}}
					>
						<StandardButton
							value="Back to table"
							handleClick={handleOpenFileViewer}
						/>
					</Grid>
				)}

				{Object.keys(state).length > 0 && (
					<Grid
						container
						sx={{ display: 'flex', flexDirection: 'column' }}
						id="wrapper"
					>
						<Grid
							container
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '1.2em',
								fontWeight: 'bold',
							}}
						>
							Signal Detail View
						</Grid>
						<Grid container sx={{ display: 'flex' }}>
							<Grid
								item
								xs={1}
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '1em',
									fontWeight: 'bold',
								}}
							>
								<div
									style={{
										width: '100%',
										transform: 'rotate(-90deg)',
										transformOrigin: 'right, top',

										position: 'relative',
										bottom: ' 0%',
										left: '0%',
									}}
								>
									Values
								</div>
							</Grid>
							<div
								id="mainChart"
								style={{ width: '90%' }}
								onMouseUp={handleChangeMouseUp}
							>
								<ReactApexChart
									options={state.options}
									series={state.series}
									type="line"
									height={300}
									ref={mainChart}
								/>
							</div>
						</Grid>
						<Grid
							container
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '1em',
								fontWeight: 'bold',
							}}
						>
							Index
						</Grid>
					</Grid>
				)}
				<ChipSlicesList
					currentCellId={currentCellId}
					selectedSlice={selectedSlice}
					setSelectedSlice={setSelectedSlice}
					slicesState={
						// eslint-disable-next-line no-nested-ternary
						!testView && !predictionsView
							? exampleSlicesState
							: testView
							? testSlicesState
							: predictionSlicesState
					}
				/>
				{openSelectTargetModal && (
					<SelectTimeSeriesTargetModal
						onClose={setOpenSelectTargetModal}
						open={openSelectTargetModal}
						selectedSlice={selectedSlice}
						setSelectedSlice={setSelectedSlice}
						selectedOutputs={selectedOutputs}
						setSelectedOutputs={setSelectedOutputs}
					/>
				)}
			</>
		);
};

TimeSerieEditor.propTypes = {
	currentElement: PropTypes.object,
	currentCellId: PropTypes.string,
	currentValue: PropTypes.any,
	testView: PropTypes.bool,
	predictionsView: PropTypes.bool,
	handleOpenFileViewer: PropTypes.func,
};
