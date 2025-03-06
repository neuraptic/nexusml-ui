/* eslint-disable no-nested-ternary */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// Components
import { FormControl, Grid, Input, MenuItem, Select } from '@mui/material';
import { faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';
import StandardModal from '../../../../../../Components/Shared/StandardModal';

// Services
import { onAddBoxShape, onDrawPolygon } from '../ImageFileEditor.services';

// Styles
import styles from './styles';

// Redux
import { UPDATE_SHAPE } from '../../../../../../redux/examples.slice';

const SelectTargetModal = (props) => {
	const {
		onClose,
		selectedShape,
		selectedShapeOutput,
		setSelectedShapeOutput,
		open,
		editor,
		scalingFactor,
		containerWidth,
		containerHeight,
		currentElement,
		isPolygonMode,
		setIsPolygonMode,
		isDrawingPolygon,
		fabric,
		currentRowId,
		zoom,
		isShapeUpdate,
		setIsShapeUpdate,
		selectedOutputs,
		setSelectedOutputs,
	} = props;

	const radioGroupRef = useRef(null);

	const dispatch = useDispatch();

	// Global states
	const userState = useSelector((state) => state.user);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const {
		examples: examplesState,
		currentExample: currentExampleState,
		currentShapes: currentShapesState,
	} = useSelector((state) => state.examples);
	const { categories: categoriesState } = useSelector((state) => state.schema);
	const {
		inputs: inputsState,
		outputs: outputsState,
		groups: groupsState,
	} = useSelector((state) => state.schema.schema);

	// Local states
	const [isLoading, setIsLoading] = useState(false);
	const [currentTargets, setCurrentTargets] = useState([]);
	const [currentCategoriesOutputs, setCurrentCategoriesOutputs] = useState([]);
	const [currentShape, setCurrentShape] = useState({});

	useEffect(() => {
		setSelectedOutputs([]);
	}, []);

	useEffect(() => {
		if (currentShape !== '')
			setCurrentShape(
				currentShapesState.find((shape) => shape.id === selectedShape)
			);
	}, [selectedShape]);

	useEffect(() => {
		const tmpCatOutputs = currentTargets
			.filter((output) => output.type === 'category')
			.map((output) => ({
				id: output.id,
				name: output.name,
				categories: [],
			}));

		if (
			tmpCatOutputs &&
			tmpCatOutputs.length > 0 &&
			categoriesState &&
			categoriesState.outputs &&
			categoriesState.outputs.length > 0
		) {
			setCurrentCategoriesOutputs(
				tmpCatOutputs.map(
					(output) =>
						categoriesState.outputs.find((cat) => cat.id === output.id) && {
							...output,
							categories: categoriesState.outputs.find(
								(cat) => cat.id === output.id
							).categories,
						}
				)
			);
		}
	}, [currentShape]);

	useEffect(() => {
		// All shapes in schema
		if (inputsState && inputsState.length > 0)
			setCurrentTargets([...inputsState]);
		if (outputsState && outputsState.length > 0)
			setCurrentTargets([...outputsState]);
	}, [outputsState, groupsState]);

	useEffect(() => {
		if (selectedShape && currentTargets.length > 0) {
			if (
				currentShapesState.find((shape) => shape.id === selectedShape) &&
				currentShapesState.find((shape) => shape.id === selectedShape)
					.outputs &&
				currentShapesState.find((shape) => shape.id === selectedShape).outputs
					.length > 0
			) {
				const tmpOutputs = currentTargets.filter(
					(output) => output.type !== 'shape'
				);

				setSelectedOutputs(
					currentShape.outputs.map((output) => {
						const tmp = tmpOutputs.find((out) => out.name === output.element);
						return {
							id: tmp.id,
							name: output.element,
							type: tmp.type,
							value: output.value,
						};
					})
				);
			}
		}
	}, [currentTargets]);

	const handleCancel = () => {
		setIsPolygonMode(false);
		setIsShapeUpdate(false);
		onClose(false);
		setIsLoading(false);
	};

	const handleOk = () => {
		setIsLoading(true);
		if (selectedShapeOutput.name !== '') {
			if (isPolygonMode) {
				onDrawPolygon({
					editor,
					isDrawingPolygon,
					fabric,
				});
			} else {
				onAddBoxShape({
					editor,
					fabric,
					selectedShapeOutput,
					scalingFactor,
					containerWidth,
					containerHeight,
					currentElement,
					dispatch,
					currentRowId,
					taskId: currentTaskState.uuid,
					exampleId: currentExampleState.uuid,
					userState,
					zoom,
					currentExampleState,
					examplesState,
					selectedOutputs,
				});
			}
			handleCancel();
		}
	};

	const handleUpdate = async () => {
		setIsLoading(true);
		const tmpOutputs = selectedOutputs.filter((output) => output.value !== '');
		await dispatch(
			UPDATE_SHAPE({
				taskId: currentTaskState.id,
				exampleId: currentExampleState.id,
				shapeId: currentShape.id,
				newShape: {
					...currentShape,
					outputs: tmpOutputs.map((output) => ({
						element: output.name,
						value: output.value,
					})),
				},
				dispatch,
				userState,
			})
		);
		handleCancel();
	};

	const handleChangeShapeOutput = (e) => {
		const tmp = currentTargets.find((output) => output.id === e.target.value);
		if (tmp) setSelectedShapeOutput(tmp);
	};

	const handleChangeName = (e) => {
		const { id, name, value } = e.target;
		const tmpType = currentTargets.find((out) => out.name === value).type;
		if (id === undefined) {
			setSelectedOutputs((prevOutputs) =>
				prevOutputs.map((output) =>
					output.name === name
						? {
								...output,
								name: value,
								type: tmpType && tmpType,
								value: '',
						  }
						: output
				)
			);
		}
	};

	const handleChangeValue = (e) => {
		const { name, value } = e.target;
		setSelectedOutputs((prevOutputs) =>
			prevOutputs.map((output) =>
				output.name === name || output.name === ''
					? { ...output, value }
					: output
			)
		);
	};

	const handleAddOutput = async () => {
		setIsLoading(true);
		setSelectedOutputs([
			...selectedOutputs,
			{ name: '', id: '', type: '', value: '' },
		]);
		setIsLoading(false);
	};

	const handleDeleteOutput = async (name) => {
		setIsLoading(true);
		setSelectedOutputs(
			selectedOutputs.filter((output) => output.name !== name)
		);
		setIsLoading(false);
	};

	return (
		<StandardModal
			maxWidth="sm"
			open={open}
			setOpen={onClose}
			title="Select shape"
			content={
				<>
					<RadioGroup
						ref={radioGroupRef}
						aria-label="outputs"
						name="outputs"
						value={(selectedShapeOutput && selectedShapeOutput.id) || ''}
						onChange={handleChangeShapeOutput}
					>
						{currentTargets.map((target) => {
							if (target.type === 'shape')
								return (
									<FormControlLabel
										value={target.id}
										name={target.name}
										id={target.id}
										disabled={
											isShapeUpdate ||
											(currentExampleState.inputs &&
												currentExampleState.inputs.find(
													(inp) => inp.element === target.name
												) &&
												currentTargets.find(
													(out) => out.uuid === target.uuid
												) &&
												currentTargets.find((inp) => inp.uuid === target.uuid)
													.multi_value === null) ||
											(currentExampleState.outputs &&
												currentExampleState.outputs.find(
													(out) => out.element === target.name
												) &&
												currentTargets.find(
													(out) => out.uuid === target.uuid
												) &&
												currentTargets.find((out) => out.uuid === target.uuid)
													.multi_value === null)
										}
										checked={
											currentExampleState.outputs.find(
												(out) => selectedShape === out.value
											)?.element === target.name
										}
										key={uuidv4()}
										control={<Radio />}
										label={target.name}
									/>
								);
							return false;
						})}
					</RadioGroup>
					{Object.keys(selectedShapeOutput).length > 0 &&
						selectedOutputs.length !==
							currentTargets.filter((out) => out.type !== 'shape').length && (
							<Grid container spacing={1} sx={{ mt: 2 }}>
								<Grid
									item
									xs={12}
									sx={{ display: 'flex', justifyContent: 'center' }}
								>
									<StandardButton
										handleClick={handleAddOutput}
										value={
											<>
												<FontAwesomeIcon
													icon={faPlus}
													sx={styles().addOutputIcon}
												/>
												Add output to the selected shape
											</>
										}
									/>
								</Grid>
							</Grid>
						)}
					{selectedOutputs && selectedOutputs.length > 0 && (
						<Grid container spacing={1} sx={{ mt: 2 }}>
							<Grid item xs={12} md={6}>
								Output
							</Grid>
							<Grid item xs={12} md={6}>
								Value
							</Grid>
						</Grid>
					)}
					{selectedOutputs &&
						selectedOutputs.length > 0 &&
						selectedOutputs.map((output) => (
							<Grid container spacing={1} key={uuidv4} sx={{ mt: 2 }}>
								<Grid item xs={5} md={5}>
									<FormControl fullWidth>
										<Select
											name={output.name}
											id="name"
											value={output.name || ''}
											onChange={handleChangeName}
										>
											{currentTargets.map(
												({ name, type }) =>
													type !== 'shape' &&
													((selectedOutputs &&
														selectedOutputs.length > 0 &&
														!selectedOutputs.find(
															(out) => out.name === name
														)) ||
														output.name === name) && (
														<MenuItem key={uuidv4} value={name}>
															{name}
														</MenuItem>
													)
											)}
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={5} md={5}>
									{output.type === 'float' && (
										<FormControl
											fullWidth
											sx={{
												mt: 2,
											}}
										>
											<Input
												id="value"
												name={output.name}
												onChange={handleChangeValue}
												type="number"
												value={output.value}
											/>
										</FormControl>
									)}
									{output.type === 'text' && (
										<FormControl
											fullWidth
											sx={{
												mt: 2,
											}}
										>
											<Input
												id="value"
												name={output.name}
												onChange={handleChangeValue}
												value={output.value}
											/>
										</FormControl>
									)}
									{output.type === 'category' && (
										<FormControl fullWidth>
											<Select
												id="value"
												type="number"
												name={output.name}
												value={output.value}
												onChange={handleChangeValue}
											>
												{currentCategoriesOutputs.find(
													(out) => out.name === output.name
												) &&
													currentCategoriesOutputs
														.find((out) => out.name === output.name)
														.categories.map(({ name }) => (
															<MenuItem key={uuidv4()} value={name}>
																{name}
															</MenuItem>
														))}
											</Select>
										</FormControl>
									)}
								</Grid>
								<Grid
									xs={2}
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										mt: 2,
									}}
								>
									<FontAwesomeIcon
										icon={faTrashCan}
										sx={styles().trashIcon}
										onClick={() => {
											handleDeleteOutput(output.name);
										}}
									/>
								</Grid>
							</Grid>
						))}
				</>
			}
			actions={
				<>
					<StandardButton
						loading={isLoading}
						type={Object.keys(selectedShapeOutput).length === 0 && 'disabled'}
						handleClick={() => {
							if (Object.keys(selectedShapeOutput).length > 0)
								if (isShapeUpdate) handleUpdate();
								else handleOk();
						}}
						value="Save"
					/>
					<StandardButton close handleClick={handleCancel} value="Cancel" />
				</>
			}
		/>
	);
};

SelectTargetModal.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	selectedShape: PropTypes.string,
	selectedShapeOutput: PropTypes.object,
	setSelectedShapeOutput: PropTypes.func,
	selectedOutputs: PropTypes.array,
	setSelectedOutputs: PropTypes.func,
	editor: PropTypes.object,
	scalingFactor: PropTypes.number,
	containerWidth: PropTypes.number,
	containerHeight: PropTypes.number,
	currentElement: PropTypes.object,
	isPolygonMode: PropTypes.bool,
	setIsPolygonMode: PropTypes.func,
	isDrawingPolygon: PropTypes.object,
	fabric: PropTypes.object,
	currentRowId: PropTypes.string,
	zoom: PropTypes.any,
	isShapeUpdate: PropTypes.bool,
	setIsShapeUpdate: PropTypes.func,
};

export default SelectTargetModal;
