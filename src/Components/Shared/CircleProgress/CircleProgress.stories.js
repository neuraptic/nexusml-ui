import CircleProgress from './index';

export default {
	title: 'Components/CircleProgress',
	component: CircleProgress,
	tags: ['autodocs'],
	argTypes: {
		size: { control: 'number' },
		thickness: { control: 'number' },
		value: { control: 'number' },
		max: { control: 'number' },
		secColor: { control: 'color' },
	},
};

export const Default = (args) => <CircleProgress {...args} />;

Default.args = {
	size: 50,
	thickness: 4,
	value: 25,
	max: 100,
	secColor: '#d1d1d1',
};

export const CustomProgress = (args) => <CircleProgress {...args} />;

CustomProgress.args = {
	size: 75,
	thickness: 6,
	value: 50,
	max: 100,
	secColor: '#f0f0f0',
};
