import React from 'react';
import { Typography } from '@mui/material';
import Section from './index';

export default {
	title: 'Components/Section',
	component: Section,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' },
		children: { control: 'object' },
	},
};

export const Default = (args) => <Section {...args} />;

Default.args = {
	title: 'Section Title',
	children: (
		<Typography>
			This is the content of the section. You can place any components or text
			here.
		</Typography>
	),
};

export const WithMultipleElements = (args) => <Section {...args} />;

WithMultipleElements.args = {
	title: 'Another Section',
	children: (
		<div>
			<Typography paragraph>
				This section contains multiple elements.
			</Typography>
			<Typography paragraph>Each paragraph is a separate element.</Typography>
		</div>
	),
};
