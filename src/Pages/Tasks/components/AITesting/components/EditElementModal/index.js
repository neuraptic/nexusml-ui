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
import { getElementToEdit } from '../../../Examples/elementEditor.service';

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
	const { tests: testsState } = useSelector((state) => state.tests);
	const {
		isLoading: isLoadingSchemaState,
		schema: schemaState,
		categories: categoriesState,
	} = useSelector((state) => state.schema);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { currentTest: currentTestState } = useSelector((state) => state.tests);
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
					if (
						output.name === currentCellId ||
						`target-${output.name}` === currentCellId
					) {
						setCurrentElementValueType(output.type);
						setCurrentElementType('outputs');
						setCurrentElementMultiValue(output.multi_value);
					}
				});
			}

			if (
				currentTestState &&
				currentTestState.inputs &&
				currentTestState.inputs.find((input) => input.element === currentCellId)
			)
				currentTestState.inputs.forEach((input) => {
					if (input.element === currentCellId) setCurrentElement(input);
				});

			if (
				currentTestState &&
				currentTestState.metadata &&
				currentTestState.metadata.find((meta) => meta.element === currentCellId)
			)
				currentTestState.metadata.forEach((meta) => {
					if (meta.element === currentCellId) setCurrentElement(meta);
				});

			if (
				currentTestState &&
				currentTestState.outputs &&
				currentTestState.outputs.find(
					(output) => output.element === currentCellId
				)
			)
				currentTestState.outputs.forEach((output) => {
					if (output.element === currentCellId) setCurrentElement(output);
				});

			if (
				currentTestState &&
				currentTestState.targets &&
				currentTestState.targets.find(
					(target) => `target-${target.element}` === currentCellId
				)
			)
				currentTestState.targets.forEach((target) => {
					if (`target-${target.element}` === currentCellId)
						setCurrentElement(target);
				});
		}
	}, [currentCellId]);

	useEffect(() => {
		if (currentCellId !== '' && currentRowId !== '') {
			testsState.forEach((test) => {
				if (test.uuid === currentRowId) {
					// Check inputs
					if (
						test.inputs &&
						test.inputs.length > 0 &&
						test.inputs.find((input) => input.element === currentCellId)
					) {
						setCurrentElement(
							test.inputs.find((input) => input.element === currentCellId)
						);
					}
					// Check metadata
					if (
						test.metadata &&
						test.metadata.length > 0 &&
						test.metadata.find((meta) => meta.element === currentCellId)
					) {
						setCurrentElement(
							test.metadata.find((meta) => meta.element === currentCellId)
						);
					}
					// Check output
					if (
						test.outputs &&
						test.outputs.length > 0 &&
						test.outputs.find((output) => output.element === currentCellId)
					) {
						setCurrentElement(
							test.outputs.find((output) => output.element === currentCellId)
						);
					}
				}
			});
		}
	}, [currentCellId, currentRowId]);

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
		const tmpExample = testsState.find(
			(example) => example.id === currentRowId
		);

		if (tmpExample) {
			// INPUTS
			if (currentTestState.inputs && currentTestState.inputs.length > 0) {
				currentTestState.inputs.forEach((input) => {
					if (input.element !== currentCellId) {
						tmpUpdate = {
							...tmpUpdate,
							values: [...tmpUpdate.values, input],
						};
					}
				});
			}

			// METADATA
			if (currentTestState.metadata && currentTestState.metadata.length > 0) {
				currentTestState.metadata.forEach((meta) => {
					if (meta.element !== currentCellId) {
						tmpUpdate = {
							...tmpUpdate,
							values: [...tmpUpdate.values, meta],
						};
					}
				});
			}

			// OUTPUTS
			if (currentTestState.outputs && currentTestState.outputs.length > 0) {
				currentTestState.outputs.forEach((output) => {
					if (output.element !== currentCellId) {
						tmpUpdate = {
							...tmpUpdate,
							values: [...tmpUpdate.values, output],
						};
					}
				});
			}
		}

		if (currentElementValueType !== 'image_file') {
			await dispatch(
				UPDATE_EXAMPLE({
					taskId: currentTaskState.id,
					exampleId: currentRowId,
					examplesToUpdate: tmpUpdate,
					dispatch,
					userState,
				})
			);
		}
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
								disabled: true,
								currentElementMultiValue,
								testView: true,
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
								disabled: true,
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
								disabled: true,
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
								disabled: true,
								currentElementMultiValue,
								testView: true,
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
								disabled: true,
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
								disabled: true,
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
								disabled: true,
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
								disabled: true,
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
								disabled: true,
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
								disabled: true,
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
								disabled: true,
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
