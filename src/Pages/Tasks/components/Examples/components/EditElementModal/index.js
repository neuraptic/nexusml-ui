/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Components
import Box from '@mui/material/Box';
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';

// Styles
import styles from './styles';

// Services
import { getElementToEdit } from '../../elementEditor.service';

// Redux
import {
	GET_EXAMPLES,
	UPDATE_EXAMPLE,
} from '../../../../../../redux/examples.slice';

export const EditElementModal = (props) => {
	const {
		open,
		setOpen,
		currentCellId,
		currentRowId,
		setCurrentRowId,
		setCurrentCellId,
		allColumns,
	} = props;

	const dispatch = useDispatch();

	// Global states
	const { examples: examplesState } = useSelector((state) => state.examples);
	const {
		isLoading: isLoadingSchemaState,
		schema: schemaState,
		categories: categoriesState,
	} = useSelector((state) => state.schema);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { currentExample: currentExampleState } = useSelector(
		(state) => state.examples
	);
	const userState = useSelector((state) => state.user);

	// Local states
	const [currentElement, setCurrentElement] = useState({});
	const [currentElementValueType, setCurrentElementValueType] = useState('');
	const [currentValue, setCurrentValue] = useState('');
	const [currentElementType, setCurrentElementType] = useState('');
	const [currentElementMultiValue, setCurrentElementMultiValue] =
		useState(null);

	useEffect(() => {
		if (Object.keys(schemaState).length > 0 && currentCellId !== '') {
			// Check inputs
			if (schemaState.inputs && schemaState.inputs.length > 0) {
				schemaState.inputs.forEach((input) => {
					if (input.name === currentCellId) {
						setCurrentElementValueType(input.type);
						setCurrentElementType('inputs');
						setCurrentElementMultiValue(input.multi_value);
					}
				});
			}
			// Check metadata
			if (schemaState.metadata && schemaState.metadata.length > 0) {
				schemaState.metadata.forEach((meta) => {
					if (meta.name === currentCellId) {
						setCurrentElementValueType(meta.type);
						setCurrentElementType('metadata');
						setCurrentElementMultiValue(meta.multi_value);
					}
				});
			}
			// Check outputs
			if (schemaState.outputs && schemaState.outputs.length > 0) {
				schemaState.outputs.forEach((output) => {
					if (output.name === currentCellId) {
						setCurrentElementValueType(output.type);
						setCurrentElementType('outputs');
						setCurrentElementMultiValue(output.multi_value);
					}
				});
			}

			if (
				currentExampleState.inputs &&
				currentExampleState.inputs.find((input) => input.name === currentCellId)
			)
				currentExampleState.inputs.forEach((input) => {
					if (input.name === currentCellId) setCurrentElement(input);
				});

			if (
				currentExampleState.metadata &&
				currentExampleState.metadata.find((meta) => meta.name === currentCellId)
			)
				currentExampleState.metadata.forEach((meta) => {
					if (meta.name === currentCellId) setCurrentElement(meta);
				});

			if (
				currentExampleState.outputs &&
				currentExampleState.outputs.find(
					(output) => output.name === currentCellId
				)
			)
				currentExampleState.outputs.forEach((output) => {
					if (output.name === currentCellId) setCurrentElement(output);
				});
		}
	}, [currentCellId]);

	useEffect(() => {
		if (currentCellId !== '' && currentRowId !== '') {
			examplesState.forEach((example) => {
				if (example.id === currentRowId) {
					// Check inputs
					if (
						example.inputs &&
						example.inputs.length > 0 &&
						example.inputs.find((input) => input.element === currentCellId)
					) {
						setCurrentElement(
							example.inputs.find((input) => input.element === currentCellId)
						);
					}
					// Check metadata
					if (
						example.metadata &&
						example.metadata.length > 0 &&
						example.metadata.find((meta) => meta.element === currentCellId)
					) {
						setCurrentElement(
							example.metadata.find((meta) => meta.element === currentCellId)
						);
					}
					// Check output
					if (
						example.outputs &&
						example.outputs.length > 0 &&
						example.outputs.find((output) => output.element === currentCellId)
					) {
						setCurrentElement(
							example.outputs.find((output) => output.element === currentCellId)
						);
					}
				}
			});
		}
	}, [currentCellId, currentRowId]);

	useEffect(() => {
		if (currentElementMultiValue) setCurrentValue([]);
	}, [currentElement]);

	const handleClose = () => {
		setCurrentCellId('');
		setCurrentRowId('');
		setOpen(false);
		setCurrentValue('');
	};

	const handleSave = async () => {
		let tmpUpdate = {
			values: [
				{
					element: currentCellId,
					value:
						currentElementValueType === 'integer'
							? parseInt(currentValue)
							: currentElementValueType === 'float'
							? parseFloat(currentValue)
							: currentValue,
				},
			],
		};
		const tmpExample = examplesState.find(
			(example) => example.id === currentRowId
		);

		if (tmpExample) {
			// INPUTS
			if (currentExampleState.inputs && currentExampleState.inputs.length > 0) {
				currentExampleState.inputs.forEach((input) => {
					if (input.element !== currentCellId) {
						tmpUpdate = {
							...tmpUpdate,
							values: [...tmpUpdate.values, input],
						};
					}
				});
			}

			// METADATA
			if (
				currentExampleState.metadata &&
				currentExampleState.metadata.length > 0
			) {
				currentExampleState.metadata.forEach((meta) => {
					if (meta.element !== currentCellId) {
						tmpUpdate = {
							...tmpUpdate,
							values: [...tmpUpdate.values, meta],
						};
					}
				});
			}

			// OUTPUTS
			if (
				currentExampleState.outputs &&
				currentExampleState.outputs.length > 0
			) {
				currentExampleState.outputs.forEach((output) => {
					if (output.element !== currentCellId) {
						tmpUpdate = {
							...tmpUpdate,
							values: [...tmpUpdate.values, output],
						};
					}
				});
			}
		}

		await dispatch(
			UPDATE_EXAMPLE({
				taskId: currentTaskState.id,
				exampleId: currentRowId,
				examplesToUpdate: tmpUpdate,
				dispatch,
				userState,
			})
		);

		await dispatch(
			GET_EXAMPLES({
				taskId: currentTaskState.uuid,
				userState,
				dispatch,
			})
		);

		handleClose();
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Edit view:"
			// multivalue={
			// 	currentElementMultiValue &&
			// 	currentElementValueType !== 'integer' &&
			// 	currentElementValueType !== 'float' &&
			// 	currentValue
			// }
			content={
				<Box sx={styles().dialogContentContainer}>
					{
						// INTEGER TYPE
						currentElementValueType === 'integer' &&
							currentElement &&
							getElementToEdit[currentElementValueType]({
								classes: styles(),
								currentElement,
								currentCellId,
								currentRowId,
								currentElementValueType,
								currentValue,
								setCurrentValue,
								currentElementMultiValue,
							})
					}
					{
						// BOOLEAN TYPE
						currentElementValueType === 'boolean' &&
							currentElement &&
							getElementToEdit[currentElementValueType]({
								currentValue,
								setCurrentValue,
								currentElement,
							})
					}
					{
						// DATETIME TYPE
						currentElementValueType === 'datetime' &&
							currentElement &&
							getElementToEdit[currentElementValueType]({
								classes: styles(),
								currentElement,
								currentCellId,
								currentRowId,
								currentElementValueType,
								currentValue,
								setCurrentValue,
							})
					}
					{
						// FLOAT TYPE
						currentElementValueType === 'float' &&
							currentElement &&
							getElementToEdit[currentElementValueType]({
								classes: styles(),
								currentElement,
								currentCellId,
								currentRowId,
								currentElementValueType,
								currentValue,
								setCurrentValue,
								currentElementMultiValue,
							})
					}
					{
						// TEXT TYPE
						currentElementValueType === 'text' &&
							currentElement &&
							getElementToEdit[currentElementValueType]({
								classes: styles(),
								currentElement,
								currentCellId,
								currentRowId,
								currentElementValueType,
								currentValue,
								setCurrentValue,
							})
					}
					{
						// CATEGORY TYPE
						currentElementValueType === 'category' &&
							currentElement &&
							getElementToEdit[currentElementValueType]({
								classes: styles(),
								currentElement,
								currentCellId,
								currentRowId,
								categoriesState,
								currentElementType,
								currentValue,
								setCurrentValue,
								isLoadingSchemaState,
								currentElementMultiValue,
							})
					}
					{
						// GENERIC FILE TYPE
						currentElementValueType === 'generic_file' &&
							currentElement &&
							getElementToEdit[currentElementValueType]({
								currentElement,
								currentCellId,
								currentRowId,
								allColumns,
								setCurrentValue,
							})
					}
					{
						// DOCUMENT FILE TYPE
						currentElementValueType === 'document_file' &&
							currentElement &&
							getElementToEdit[currentElementValueType]({
								currentElement,
								currentCellId,
								currentRowId,
								allColumns,
								setCurrentValue,
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
								setCurrentValue,
							})
					}
					{
						// VIDEO TYPE
						currentElementValueType === 'video_file' &&
							currentElement &&
							getElementToEdit[currentElementValueType]({
								currentElement,
								currentCellId,
								currentRowId,
								allColumns,
								setCurrentValue,
							})
					}
					{
						// AUDIO TYPE
						currentElementValueType === 'audio_file' &&
							currentElement &&
							getElementToEdit[currentElementValueType]({
								currentElement,
								currentCellId,
								currentRowId,
								allColumns,
								setCurrentValue,
							})
					}
					{
						// SHAPE TYPE
						currentElementValueType === 'shape' &&
							currentElement &&
							getElementToEdit[currentElementValueType]({
								currentElement,
								currentCellId,
								currentRowId,
							})
					}
				</Box>
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
					<StandardButton
						value="Save"
						type="filled"
						handleClick={handleSave}
						close
					/>
					<StandardButton value="Close" handleClick={handleClose} close />
				</div>
			}
		/>
	);
};

EditElementModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	currentCellId: PropTypes.string,
	setCurrentCellId: PropTypes.func,
	currentRowId: PropTypes.string,
	setCurrentRowId: PropTypes.func,
	allColumns: PropTypes.any,
};
