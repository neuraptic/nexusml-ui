import React, { useState } from 'react';

// Components
import { Button, Typography } from '@mui/material';
import { StandardModalDialog } from './index';
import StandardButton from '../Buttons/StandardButton';

// Services
import { newLog } from '../../../services/logger';

export default {
	title: 'Components/StandardModalDialog',
	component: StandardModalDialog,
	tags: ['autodocs'],
	argTypes: {
		open: { control: 'boolean' },
		title: { control: 'text' },
		titleDescription: { control: 'text' },
		content: { control: 'object' },
		confirmActions: { control: 'object' },
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
			<StandardModalDialog {...args} open={opened} setOpen={toggleOpen} />
		</>
	);
};

Default.args = {
	open: false,
	title: 'Confirmation Required',
	titleDescription: 'Are you sure you want to proceed with this action?',
	content: (
		<Typography variant="body1">
			Please confirm your action. This cannot be undone.
		</Typography>
	),
	confirmActions: (
		<StandardButton
			type="filled"
			handleClick={() => newLog('Confirmed')}
			value="Confirm"
		/>
	),
};

export const WithoutTitleDescription = (args) => {
	const { open } = args;
	const [opened, setOpened] = useState(open);

	const toggleOpen = () => setOpened(!opened);

	return (
		<>
			<Button variant="contained" onClick={toggleOpen}>
				Open Modal
			</Button>
			<StandardModalDialog {...args} open={opened} setOpen={toggleOpen} />
		</>
	);
};

WithoutTitleDescription.args = {
	open: false,
	title: 'Confirmation',
	content: <Typography variant="body1">Please confirm your action.</Typography>,
	confirmActions: (
		<StandardButton
			type="filled"
			handleClick={() => newLog('Confirmed')}
			value="Confirm"
		/>
	),
};
