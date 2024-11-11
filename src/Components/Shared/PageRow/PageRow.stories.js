import React from 'react';
import { Button, Typography } from '@mui/material';
import PageRow from './index';

export default {
	title: 'Components/PageRow',
	component: PageRow,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: { type: 'select' },
			options: ['default', 'danger'],
		},
		column1: { control: 'object' },
		column2: { control: 'object' },
	},
};

export const Default = (args) => <PageRow {...args} />;

Default.args = {
	type: 'default',
	column1: <Typography variant="h6">Column 1 Content</Typography>,
	column2: <Button variant="contained">Column 2 Button</Button>,
};

export const DangerZone = (args) => <PageRow {...args} />;

DangerZone.args = {
	type: 'danger',
	column1: <Typography variant="h6">Important Warning</Typography>,
	column2: (
		<Button variant="contained" color="error">
			Take Action
		</Button>
	),
};
