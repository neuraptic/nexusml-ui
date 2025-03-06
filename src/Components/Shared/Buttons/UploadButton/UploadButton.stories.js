import { action } from '@storybook/addon-actions';
import { UploadButton } from './index';

export default {
	title: 'Components/UploadButton',
	component: UploadButton,
	tags: ['autodocs'],
	argTypes: {
		currentCellId: { control: 'text' },
		allColumns: { control: 'array' },
		setCurrentValue: { action: 'setCurrentValue' },
		type: { control: { type: 'select' }, options: ['document', 'image'] },
	},
};

export const Default = (args) => <UploadButton {...args} />;

Default.args = {
	currentCellId: 'cell-1',
	allColumns: [
		{ name: 'cell-1', field: 'field1', fieldType: 'image' },
		{ name: 'cell-2', field: 'field2', fieldType: 'document' },
	],
	setCurrentValue: action('Value set'),
	type: 'image',
};

export const DocumentUpload = (args) => <UploadButton {...args} />;

DocumentUpload.args = {
	currentCellId: 'cell-2',
	allColumns: [
		{ name: 'cell-1', field: 'field1', fieldType: 'image' },
		{ name: 'cell-2', field: 'field2', fieldType: 'document' },
	],
	setCurrentValue: action('Value set'),
	type: 'document',
};
