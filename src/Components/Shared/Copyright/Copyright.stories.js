import Copyright from './index';

export default {
	title: 'Components/Copyright',
	component: Copyright,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'text' },
		color: { control: 'color' },
		align: { control: 'text' },
	},
};

export const Default = (args) => <Copyright {...args} />;

Default.args = {
	variant: 'body2',
	color: 'text.secondary',
	align: 'center',
};
