import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { action } from '@storybook/addon-actions';
import CardItem from './index';

export default {
	title: 'Components/CardItem',
	component: CardItem,
	tags: ['autodocs'],
	argTypes: {
		children: { control: 'text' },
		sx: { control: 'object' },
		type: {
			control: { type: 'select' },
			options: ['task', 'bigLeftIcon', 'noIcon', null],
		},
		title: { control: 'text' },
		titleimg: { control: 'text' },
		titleicon: { control: 'object' },
		titlelink: { control: 'object' },
		loading: { control: 'boolean' },
		loaderSize: { control: 'number' },
		closeIcon: { control: 'object' },
		open: { control: 'boolean' },
		setOpen: { action: 'setOpen' },
	},
};

export const Default = (args) => <CardItem {...args} />;

Default.args = {
	type: 'task',
	title: 'Task Title',
	children: 'This is the content of the card.',
	loading: false,
	loaderSize: 4,
	closeIcon: <FontAwesomeIcon icon={faUser} />,
	open: true,
	setOpen: action('Card toggled'),
	sx: {},
};

export const WithBigLeftIcon = (args) => <CardItem {...args} />;

WithBigLeftIcon.args = {
	type: 'bigLeftIcon',
	title: 'Big Left Icon Title',
	children: 'This is the content of the card with a big left icon.',
	loading: false,
	loaderSize: 4,
	titleicon: <FontAwesomeIcon icon={faUser} />,
	sx: {},
};

export const NoIconCard = (args) => <CardItem {...args} />;

NoIconCard.args = {
	type: 'noIcon',
	title: 'No Icon Title',
	children: 'This is the content of the card without an icon.',
	loading: false,
	loaderSize: 4,
	sx: {},
};
