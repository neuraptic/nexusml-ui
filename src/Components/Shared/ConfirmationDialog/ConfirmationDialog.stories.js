import { action } from '@storybook/addon-actions';
import { ConfirmationDialog } from './index';

export default {
	title: 'Components/ConfirmationDialog',
	component: ConfirmationDialog,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		children: { control: 'text' },
		open: { control: 'boolean' },
		setOpen: { action: 'setOpen' },
		onConfirm: { action: 'onConfirm' },
		isLoading: { control: 'boolean' },
		openShowSchema: { control: 'boolean' },
	},
};

export const Default = (args) => <ConfirmationDialog {...args} />;

Default.args = {
	title: 'Are you sure?',
	children: 'This action cannot be undone. Do you want to proceed?',
	open: false,
	setOpen: action('Dialog closed'),
	onConfirm: action('Confirmed'),
	isLoading: false,
	openShowSchema: false,
};

export const LoadingState = (args) => <ConfirmationDialog {...args} />;

LoadingState.args = {
	title: 'Processing...',
	children: 'Please wait while we complete the action.',
	open: false,
	setOpen: action('Dialog closed'),
	onConfirm: action('Confirmed'),
	isLoading: true,
	openShowSchema: false,
};

export const CustomDialog = (args) => <ConfirmationDialog {...args} />;

CustomDialog.args = {
	title: 'Delete Item',
	children: 'Are you sure you want to delete this item?',
	open: false,
	setOpen: action('Dialog closed'),
	onConfirm: action('Confirmed'),
	isLoading: false,
	openShowSchema: true,
};
