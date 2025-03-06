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

// Styles
import styles from './styles';

// Redux
import { UPDATE_SLICE } from '../../../../../../redux/examples.slice';

const SelectTimeSeriesTargetModal = (props) => {
	const {
		open,
		onClose,
		selectedSlice,
		setSelectedSlice,
		selectedOutputs,
		setSelectedOutputs,
		isSliceUpdate = false,
	} = props;

	const radioGroupRef = useRef(null);

	const dispatch = useDispatch();

	// Global states
	const userState = useSelector((state) => state.user);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { currentExample: currentExampleState } = useSelector(
		(state) => state.examples
	);
	const { categories: categoriesState } = useSelector((state) => state.schema);
	const { outputs: outputsState } = useSelector((state) => state.schema);

	// Local states
	const [isLoading, setIsLoading] = useState(false);
	const [currentOutputs, setCurrentOutputs] = useState([]);
	const [currentCategoriesOutputs, setCurrentCategoriesOutputs] = useState([]);
	const [currentSlice, setCurrentSlice] = useState(null);

	useEffect(() => {
		setSelectedOutputs([]);
	}, []);

	useEffect(() => {
		if (selectedSlice !== '')
			setCurrentSlice(
				outputsState.find((output) => output.uuid === selectedSlice)
			);
	}, [selectedSlice]);

	useEffect(() => {
		const tmpCatOutputs = outputsState
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
	}, [selectedSlice]);

	useEffect(() => {
		if (outputsState && outputsState.length > 0)
			setCurrentOutputs(
				outputsState.filter(
					(output) => output.type !== 'slice' && output.type !== 'shape'
				)
			);
	}, [outputsState]);

	useEffect(() => {
		if (selectedSlice && currentOutputs.length > 0) {
			if (
				outputsState.find((slice) => slice.uuid === selectedSlice) &&
				outputsState.find((slice) => slice.uuid === selectedSlice).outputs &&
				outputsState.find((slice) => slice.uuid === selectedSlice).outputs
					.length > 0
			) {
				const tmpOutputs = currentOutputs.filter(
					(output) => output.type !== 'slice'
				);

				setSelectedOutputs(
					currentSlice.outputs.map((output) => {
						const tmp = tmpOutputs.find((out) => out.name === output.element);
						return {
							id: tmp.uuid,
							name: output.element,
							type: tmp.type,
							value: output.value,
						};
					})
				);
			}
		}
	}, [currentOutputs]);

	const handleCancel = () => {
		onClose(false);
		setIsLoading(false);
	};

	const handleOk = () => {
		setIsLoading(true);
		// TODO: handle create slice
		handleCancel();
	};

	const handleUpdate = async () => {
		setIsLoading(true);
		const tmpOutputs = selectedOutputs.filter((output) => output.value !== '');
		await dispatch(
			UPDATE_SLICE({
				taskId: currentTaskState.id,
				exampleId: currentExampleState.id,
				sliceUUID: currentSlice.uuid,
				newSlice: {
					...currentSlice,
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

	const handleChangeSlice = (e) => {
		const tmp = outputsState.find((output) => output.id === e.target.value);
		if (tmp) {
			setCurrentSlice(tmp);
			setSelectedSlice(tmp.uuid);
		}
	};

	const handleChangeName = (e) => {
		const { id, name, value } = e.target;
		const tmpType = currentOutputs.find((out) => out.name === value).type;
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
			title="Select slice"
			content={
				<>
					<RadioGroup
						ref={radioGroupRef}
						aria-label="outputs"
						name="outputs"
						value={selectedSlice || ''}
						onChange={handleChangeSlice}
					>
						{outputsState.map(
							(output) =>
								output.type === 'slice' && (
									<FormControlLabel
										value={output.id}
										name={output.name}
										id={output.id}
										// TODO: disabled if slice is in currentExamples.slices array and is not multiValue
										// disabled={
										// 	currentExampleState.slices.find(
										// 		(el) => output.uuid === el.uuid
										// 	) &&
										// 	!currentExampleState.slices.find(
										// 		(el) => output.uuid === el.uuid
										// 	)?.multiValue
										// }
										checked={
											selectedSlice === output.uuid ||
											currentExampleState.slices?.find(
												(el) => selectedSlice === el.uuid
											)?.element === output.name
										}
										key={uuidv4()}
										control={<Radio />}
										label={output.name}
									/>
								)
						)}
					</RadioGroup>
					{currentSlice &&
						Object.keys(currentSlice).length > 0 &&
						selectedOutputs.length !==
							currentOutputs.filter((out) => out.type !== 'slice').length && (
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
						selectedOutputs.map((output, index) => (
							<Grid container spacing={1} key={index} sx={{ mt: 2 }}>
								<Grid item xs={5} md={5}>
									<FormControl fullWidth>
										<Select
											name={output.name}
											id="name"
											value={output.name || ''}
											onChange={handleChangeName}
										>
											{currentOutputs.map(
												({ name, type }, index) =>
													type !== 'slice' &&
													((selectedOutputs &&
														selectedOutputs.length > 0 &&
														!selectedOutputs.find(
															(out) => out.name === name
														)) ||
														output.name === name) && (
														<MenuItem key={index} value={name}>
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
														.categories.map(({ name }, index) => (
															<MenuItem key={index} value={name}>
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
						type={
							selectedOutputs &&
							Object.keys(selectedOutputs).length === 0 &&
							'disabled'
						}
						handleClick={() => {
							if (selectedOutputs && Object.keys(selectedOutputs).length > 0)
								if (isSliceUpdate) handleUpdate();
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

SelectTimeSeriesTargetModal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	isSliceUpdate: PropTypes.bool,
	selectedSlice: PropTypes.string,
	setSelectedSlice: PropTypes.func,
	selectedOutputs: PropTypes.string,
	setSelectedOutputs: PropTypes.func,
};

export default SelectTimeSeriesTargetModal;
