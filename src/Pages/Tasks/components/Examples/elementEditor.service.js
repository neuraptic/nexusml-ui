import { Switch, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

// Components
import { ImageFileEditor } from './Editors/ImageFile.editor';
import { TextEditor } from './Editors/Text.editor';
import { UploadButton } from '../../../../Components/Shared/Buttons/UploadButton';
import { CategoryEditor } from './Editors/Category.editor';
import { DocumentFileEditor } from './Editors/DocumentFile.editor';
import { TimeSerieEditor } from './Editors/TimeSeries.editor';

export const getElementToEdit = {
	integer: ({
		classes,
		currentElement,
		currentCellId,
		currentRowId,
		currentElementValueType,
		currentValue,
		setCurrentValue,
		name,
		disabled,
		currentElementMultiValue,
		predictionsView,
		testView,
	}) =>
		currentElementMultiValue ? (
			<TimeSerieEditor
				currentElement={currentElement}
				currentCellId={currentCellId}
				currentRowId={currentRowId}
				currentElementValueType={currentElementValueType}
				currentValue={currentValue}
				setCurrentValue={setCurrentValue}
				name={name}
				predictionsView={predictionsView}
				testView={testView}
			/>
		) : (
			<TextEditor
				classes={classes}
				currentElement={currentElement}
				currentCellId={currentCellId}
				currentRowId={currentRowId}
				currentElementValueType={currentElementValueType}
				currentValue={currentValue}
				setCurrentValue={setCurrentValue}
				name={name}
				disabled={disabled}
			/>
		),
	boolean: ({
		currentValue = false,
		setCurrentValue,
		currentElement,
		name = null,
		disabled,
	}) => {
		if (currentValue === '' && currentElement && currentElement.value) {
			setCurrentValue(currentElement.value);
		}

		const handleChange = (newValue) => {
			if (!name) setCurrentValue(newValue);
			else setCurrentValue(name, newValue);
		};

		return (
			<Switch
				checked={currentValue}
				onChange={(newValue) => {
					handleChange(newValue.target.checked);
				}}
				disabled={disabled}
				sx={{ backgroundColor: 'white' }}
			/>
		);
	},
	datetime: ({
		currentElement,
		currentValue = '',
		setCurrentValue,
		name = null,
		disabled,
	}) => {
		if (currentValue === '' && currentElement && currentElement.value) {
			setCurrentValue(currentElement.value);
		}

		const handleChange = (newValue) => {
			if (!name)
				setCurrentValue(format(new Date(newValue), "yyyy-MM-dd'T'HH:mm:ss"));
			else
				setCurrentValue(
					name,
					format(new Date(newValue), "yyyy-MM-dd'T'HH:mm:ss")
				);
		};

		return (
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DateTimePicker
					className={Date}
					value={currentValue}
					onChange={(newValue) => handleChange(newValue)}
					renderInput={(params) => (
						<TextField
							{...params}
							helperText={null}
							sx={{ backgroundColor: 'white' }}
						/>
					)}
					inputFormat="YYYY/MM/DD hh:mm A"
					disabled={disabled}
				/>
			</LocalizationProvider>
		);
	},
	float: ({
		classes,
		currentElement,
		currentCellId,
		currentRowId,
		currentElementValueType,
		currentValue,
		setCurrentValue,
		name,
		disabled,
		currentElementMultiValue,
		predictionsView,
		testView,
	}) =>
		currentElementMultiValue ? (
			<TimeSerieEditor
				currentElement={currentElement}
				currentCellId={currentCellId}
				currentRowId={currentRowId}
				currentElementValueType={currentElementValueType}
				currentValue={currentValue}
				setCurrentValue={setCurrentValue}
				name={name}
				predictionsView={predictionsView}
				testView={testView}
			/>
		) : (
			<TextEditor
				classes={classes}
				currentElement={currentElement}
				currentCellId={currentCellId}
				currentRowId={currentRowId}
				currentElementValueType={currentElementValueType}
				currentValue={currentValue}
				setCurrentValue={setCurrentValue}
				name={name}
				disabled={disabled}
			/>
		),
	text: ({
		classes,
		currentElement,
		currentCellId,
		currentRowId,
		currentElementValueType,
		currentValue,
		setCurrentValue,
		name,
		disabled,
	}) => (
		<TextEditor
			classes={classes}
			currentElement={currentElement}
			currentCellId={currentCellId}
			currentRowId={currentRowId}
			currentElementValueType={currentElementValueType}
			currentValue={currentValue}
			setCurrentValue={setCurrentValue}
			name={name}
			disabled={disabled}
		/>
	),
	category: ({
		classes,
		currentElement,
		currentCellId,
		currentElementType,
		currentValue,
		setCurrentValue,
		categoriesState,
		name,
		disabled,
		currentElementMultiValue,
	}) => {
		const currentCategories = categoriesState[currentElementType].find(
			(cat) => cat.name === currentCellId
		);

		if (currentCategories) {
			return (
				<CategoryEditor
					classes={classes}
					currentElement={currentElement}
					currentCellId={currentCellId}
					currentElementType={currentElementType}
					currentValue={currentValue}
					setCurrentValue={setCurrentValue}
					name={name}
					currentCategories={currentCategories}
					disabled={disabled}
					currentElementMultiValue={currentElementMultiValue}
				/>
			);
		}
	},
	generic_file: ({
		currentElement,
		currentCellId,
		allColumns,
		setCurrentValue,
	}) =>
		currentElement && Object.keys(currentElement).length > 0 ? (
			"Can't load file preview"
		) : (
			<UploadButton
				type="generic"
				currentCellId={currentCellId}
				allColumns={allColumns}
				setCurrentValue={setCurrentValue}
			/>
		),
	document_file: ({
		currentElement,
		currentCellId,
		allColumns,
		setCurrentValue,
	}) =>
		currentElement && Object.keys(currentElement).length > 0 ? (
			<DocumentFileEditor cellValue={currentElement.value} />
		) : (
			<UploadButton
				type="document"
				currentCellId={currentCellId}
				allColumns={allColumns}
				setCurrentValue={setCurrentValue}
			/>
		),
	image_file: ({
		currentElement,
		currentCellId,
		currentRowId,
		allColumns,
		setCurrentValue,
		disabled,
		handleOpenFileViewer,
	}) =>
		currentElement && Object.keys(currentElement).length > 0 ? (
			<ImageFileEditor
				currentElement={currentElement}
				currentCellId={currentCellId}
				currentRowId={currentRowId}
				disabled={disabled}
				handleOpenFileViewer={handleOpenFileViewer}
			/>
		) : (
			<UploadButton
				type="image"
				currentCellId={currentCellId}
				allColumns={allColumns}
				setCurrentValue={setCurrentValue}
			/>
		),
	audio_file: ({
		currentElement,
		currentCellId,
		allColumns,
		setCurrentValue,
	}) =>
		currentElement && Object.keys(currentElement).length > 0 ? (
			"Can't load audio preview"
		) : (
			<UploadButton
				type="audio"
				currentCellId={currentCellId}
				allColumns={allColumns}
				setCurrentValue={setCurrentValue}
			/>
		),
	video_file: ({
		currentElement,
		currentCellId,
		allColumns,
		setCurrentValue,
	}) =>
		currentElement && Object.keys(currentElement).length > 0 ? (
			"Can't load video preview"
		) : (
			<UploadButton
				type="video"
				currentCellId={currentCellId}
				allColumns={allColumns}
				setCurrentValue={setCurrentValue}
			/>
		),
	shape: (classes, element) => (element && element.value) || '',
	slice: (classes, element) => (element && element.value) || '',
};

getElementToEdit.propTypes = {
	currentElement: PropTypes.string,
	currentCellId: PropTypes.string,
	currentRowId: PropTypes.string,
	handleChangeValue: PropTypes.func,
};
