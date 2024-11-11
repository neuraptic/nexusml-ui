import AnomalyChip from './index';

export default {
	title: 'Components/AnomalyChip',
	component: AnomalyChip,
	tags: ['autodocs'],
	argTypes: {
		color: { control: 'color' },
		name: { control: 'text' },
		tooltip: { control: 'boolean' },
	},
};

export const Default = (args) => <AnomalyChip {...args} />;

Default.args = {
	color: '#ff0000',
	name: 'Anomaly',
	tooltip: false,
};

export const WithTooltip = (args) => <AnomalyChip {...args} />;

WithTooltip.args = {
	color: '#007bff',
	name: 'Info Anomaly',
	tooltip: true,
};
