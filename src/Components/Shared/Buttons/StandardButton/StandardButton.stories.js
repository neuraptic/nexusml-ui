import { action } from '@storybook/addon-actions';
import UploadIcon from '@mui/icons-material/Upload';
import SaveIcon from '@mui/icons-material/Save';
import StandardButton from './index';

export default {
	title: 'Components/StandardButton',
	component: StandardButton,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: { type: 'select' },
			options: [
				'uploadFile',
				'danger',
				'textButton',
				'disabled',
				'filled',
				'with-icon',
				'submit',
				'icon',
			],
		},
		variant: {
			control: { type: 'select' },
			options: ['default', 'dropdown', 'disabled'],
		},
		tooltip: { control: 'text' },
		value: { control: 'text' },
		linkTo: { control: 'text' },
		close: { control: 'boolean' },
		loading: { control: 'boolean' },
		icon: { control: 'element' },
		disabled: { control: 'boolean' },
		handleClick: { action: 'clicked' },
		handleChange: { action: 'changed' },
	},
};

export const UploadFile = {
	args: {
		type: 'uploadFile',
		value: 'Upload',
		icon: <UploadIcon />,
		accept: '.jpg,.png',
		loading: false,
		handleClick: action('upload clicked'),
		handleChange: action('file changed'),
	},
};

export const UploadFileLoading = {
	args: {
		type: 'uploadFile',
		value: 'Upload',
		icon: <UploadIcon />,
		accept: '.jpg,.png',
		loading: true,
		handleClick: action('upload clicked'),
		handleChange: action('file changed'),
	},
};

export const DangerButton = {
	args: {
		type: 'danger',
		value: 'Delete',
		handleClick: action('delete clicked'),
	},
};

export const TextButton = {
	args: {
		type: 'textButton',
		value: 'Click Me',
		handleClick: action('text button clicked'),
	},
};

export const DisabledButton = {
	args: {
		type: 'disabled',
		value: 'Cannot Click',
		tooltip: 'This button is disabled',
	},
};

export const FilledButton = {
	args: {
		type: 'filled',
		value: 'Save',
		disabled: false,
		handleClick: action('filled button clicked'),
	},
};

export const WithIcon = {
	args: {
		type: 'with-icon',
		value: 'Save with Icon',
		icon: <SaveIcon />,
		handleClick: action('with-icon button clicked'),
	},
};

export const SubmitButton = {
	args: {
		type: 'submit',
		value: 'Submit',
		handleClick: action('submit button clicked'),
	},
};

export const IconDropdownButton = {
	args: {
		type: 'icon',
		variant: 'dropdown',
		value: [
			{ value: '1', display: 'Option 1' },
			{ value: '2', display: 'Option 2' },
		],
		icon: <SaveIcon />,
		handleClick: action('dropdown opened'),
		handleChange: action('menu item selected'),
	},
};
