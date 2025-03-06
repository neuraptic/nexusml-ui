import React, { useState } from 'react';

// Components
import { Button, Typography } from '@mui/material';
import StandardModal from './index';

// Services
import { newLog } from '../../../services/logger';

export default {
	title: 'Components/StandardModal',
	component: StandardModal,
	tags: ['autodocs'],
	argTypes: {
		open: { control: 'boolean' },
		title: { control: 'text' },
		content: { control: 'object' },
		actions: { control: 'object' },
		maxWidth: {
			control: { type: 'select' },
			options: ['xs', 'sm', 'md', 'lg', 'xl'],
		},
	},
};

export const Default = (args) => {
	const { open } = args;
	const [opened, setOpened] = useState(open);

	const toggleOpen = () => setOpened(!opened);

	return (
		<>
			<Button variant="contained" onClick={toggleOpen}>
				Open Modal
			</Button>
			<StandardModal {...args} open={opened} setOpen={toggleOpen} />
		</>
	);
};

Default.args = {
	open: false,
	title: 'Modal Title',
	content: (
		<Typography variant="body1">
			This is the content of the modal. You can place any content here.
		</Typography>
	),
	actions: (
		<div>
			<Button
				variant="contained"
				color="primary"
				onClick={() => newLog('Confirmed')}
			>
				Confirm
			</Button>
			<Button
				variant="outlined"
				color="secondary"
				onClick={() => newLog('Canceled')}
			>
				Cancel
			</Button>
		</div>
	),
	maxWidth: 'md',
};

export const WithoutActions = (args) => {
	const { open } = args;
	const [opened, setOpened] = useState(open);

	const toggleOpen = () => setOpened(!opened);

	return (
		<>
			<Button variant="contained" onClick={toggleOpen}>
				Open Modal
			</Button>
			<StandardModal {...args} open={opened} setOpen={toggleOpen} />
		</>
	);
};

WithoutActions.args = {
	open: false,
	title: 'Modal Title',
	content: (
		<Typography variant="body1">
			This is a modal without actions. You can place any content here.
		</Typography>
	),
	maxWidth: 'md',
	actions: null,
};
