import React from 'react';
import { Button } from '@mui/material';
import { CustomTooltip } from './index';

export default {
	title: 'Components/CustomTooltip',
	component: CustomTooltip,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		placement: {
			control: { type: 'select' },
			options: ['bottom', 'top', 'left', 'right'],
		},
	},
};

export const Default = (args) => (
	<CustomTooltip {...args}>
		<Button variant="contained">Hover me</Button>
	</CustomTooltip>
);

Default.args = {
	title: 'Custom tooltip text',
	placement: 'top',
};
